import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { handleChatRequest } from "./_core/chat";
import * as db from "./db";
import { SYSTEM_PROMPTS } from "./_core/prompts";
import { checkRateLimit } from "./_core/rateLimit";
import { buildSystemPrompt } from "./_core/systemPrompt";
import { prepareMessagesForLLM } from "./_core/contextManager";
import { streamChat } from "./_core/streaming";

const messageSchema = z.object({
  role: z.enum(["system", "user", "assistant", "tool", "function"]),
  content: z.any(),
  name: z.string().optional(),
  tool_call_id: z.string().optional(),
});

const providerEnum = z.enum(["openai", "gemini", "anthropic", "deepseek", "forge"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  projects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.listProjects(ctx.user.id);
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
      return await db.getProjectById(input.id, ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          description: z.string().optional(),
          tags: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createProject({
          ownerId: ctx.user.id,
          name: input.name,
          description: input.description,
          tags: input.tags ? JSON.stringify(input.tags) : undefined,
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          status: z.enum(["active", "archived"]).optional(),
          tags: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, tags, ...rest } = input;
        await db.updateProject(id, ctx.user.id, {
          ...rest,
          tags: tags ? JSON.stringify(tags) : undefined,
        });
        return { success: true };
      }),

    archive: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
      await db.archiveProject(input.id, ctx.user.id);
      return { success: true };
    }),
  }),

  sessions: router({
    list: protectedProcedure
      .input(z.object({ projectId: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return await db.listSessions(ctx.user.id, input?.projectId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          projectId: z.number().optional(),
          title: z.string().optional(),
          mode: z.enum(["chat", "analysis", "build"]).optional(),
          systemPrompt: z.string().optional(),
          activeModel: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createSession({
          userId: ctx.user.id,
          projectId: input.projectId,
          title: input.title || "New Session",
          mode: input.mode || "chat",
          systemPrompt: input.systemPrompt,
          activeModel: input.activeModel,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastActivityAt: new Date(),
        });
        return { success: true };
      }),

    rename: protectedProcedure
      .input(z.object({ id: z.number(), title: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        await db.renameSession(input.id, ctx.user.id, input.title);
        return { success: true };
      }),
  }),

  templates: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.listTemplatesForUser(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          category: z.string().optional(),
          content: z.string().min(1),
          variables: z.array(z.string()).optional(),
          isShared: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createTemplate({
          ownerId: ctx.user.id,
          title: input.title,
          category: input.category || "general",
          content: input.content,
          variables: input.variables ? JSON.stringify(input.variables) : undefined,
          isShared: input.isShared ? 1 : 0,
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          category: z.string().optional(),
          content: z.string().optional(),
          variables: z.array(z.string()).optional(),
          isShared: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, variables, isShared, ...rest } = input;
        await db.updateTemplate(id, ctx.user.id, {
          ...rest,
          variables: variables ? JSON.stringify(variables) : undefined,
          isShared: typeof isShared === "boolean" ? (isShared ? 1 : 0) : undefined,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteTemplate(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  analytics: router({
    usage: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUsageSummary(ctx.user.id);
    }),
  }),

  chat: router({
    send: protectedProcedure
      .input(
        z.object({
          messages: z.array(messageSchema),
          projectId: z.number().optional(),
          sessionId: z.number().optional(),
          provider: providerEnum.optional(),
          model: z.string().optional(),
          taskHint: z.enum(["code", "long", "general"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { decision, response } = await handleChatRequest({
          messages: input.messages,
          userId: ctx.user.id,
          projectId: input.projectId,
          sessionId: input.sessionId,
          provider: input.provider,
          model: input.model,
          taskHint: input.taskHint,
        });

        return {
          decision,
          response,
        };
      }),

    // Public chat endpoint for ChatRaqim (no authentication required)
    // مع دعم إدارة السياق الذكي والبرومبتات المحسنة
    publicChat: publicProcedure
      .input(
        z.object({
          message: z.string(),
          conversationHistory: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ).optional(),
          mode: z.enum(['code', 'education', 'creative', 'analysis', 'general']).optional(),
          userPreferences: z.object({
            responseLength: z.enum(['short', 'medium', 'detailed']).optional(),
            formalityLevel: z.enum(['casual', 'professional', 'formal']).optional(),
          }).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // التحقق من Rate Limiting
          const clientIp = ctx.req.ip || ctx.req.socket.remoteAddress || 'unknown';
          checkRateLimit(clientIp);

          // 1. بناء System Prompt ذكي بناءً على السياق
          const systemPrompt = buildSystemPrompt({
            mode: input.mode || 'general',
            userPreferences: input.userPreferences,
          });

          // 2. إدارة السياق بذكاء
          const optimizedMessages = prepareMessagesForLLM(
            input.conversationHistory || [],
            input.message,
            systemPrompt,
            {
              maxTokens: 4000,
              maxMessages: 20,
              preserveRecent: 6,
              summarizeOld: true,
            }
          );

          // 3. استدعاء LLM مع الرسائل المحسّنة
          const response = await invokeLLM({ 
            messages: optimizedMessages.map(m => ({
              role: m.role,
              content: m.content,
            }))
          });

          const content = typeof response.choices[0].message.content === 'string'
            ? response.choices[0].message.content
            : JSON.stringify(response.choices[0].message.content);

          return { response: content };
        } catch (error) {
          console.error("Error in public chat:", error);
          throw new Error(error instanceof Error ? error.message : "فشل في الحصول على الرد. الرجاء المحاولة مرة أخرى.");
        }
      }),

    // Public chat with streaming support
    publicChatStream: publicProcedure
      .input(
        z.object({
          message: z.string(),
          conversationHistory: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ).optional(),
          mode: z.enum(['code', 'education', 'creative', 'analysis', 'general']).optional(),
          userPreferences: z.object({
            responseLength: z.enum(['short', 'medium', 'detailed']).optional(),
            formalityLevel: z.enum(['casual', 'professional', 'formal']).optional(),
          }).optional(),
        })
      )
      .mutation(async function* ({ input, ctx }) {
        try {
          // التحقق من Rate Limiting
          const clientIp = ctx.req.ip || ctx.req.socket.remoteAddress || 'unknown';
          checkRateLimit(clientIp);

          // استخدام دالة streaming من الملف المخصص
          for await (const chunk of streamChat({
            message: input.message,
            conversationHistory: input.conversationHistory,
            mode: input.mode,
            userPreferences: input.userPreferences,
          })) {
            yield chunk;
          }
        } catch (error) {
          yield {
            type: 'error',
            error: error instanceof Error ? error.message : 'حدث خطأ في الحصول على الرد'
          };
        }
      }),
  }),

  savedPrompts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserSavedPrompts(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          basePrompt: z.string(),
          enhancedPrompt: z.string(),
          usageType: z.string(),
          tags: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createSavedPrompt({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteSavedPrompt(input.id, ctx.user.id);
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          tags: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        await db.updateSavedPrompt(id, ctx.user.id, updates);
        return { success: true };
      }),

    exportPrompts: protectedProcedure
      .input(z.object({ format: z.enum(["json", "txt"]) }))
      .query(async ({ ctx, input }) => {
        const prompts = await db.getUserSavedPrompts(ctx.user.id);
        
        if (input.format === "json") {
          return {
            format: "json" as const,
            data: JSON.stringify(prompts, null, 2),
          };
        } else {
          const txtContent = prompts
            .map((p) => `العنوان: ${p.title}\n\nالبرومبت الأساسي:\n${p.basePrompt}\n\nالبرومبت المحسّن:\n${p.enhancedPrompt}\n\n${"-".repeat(50)}\n\n`)
            .join("");
          return {
            format: "txt" as const,
            data: txtContent,
          };
        }
      }),

    toggleFavorite: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const isFavorite = await db.toggleFavorite(ctx.user.id, input.id);
        
        // Log activity
        await db.logActivity({
          userId: ctx.user.id,
          action: isFavorite ? "favorite" : "unfavorite",
          entityType: "prompt",
          entityId: input.id,
          details: null,
        });
        
        return { success: true, isFavorite };
      }),

    getFavorites: protectedProcedure.query(async ({ ctx }) => {
      return await db.getFavoritePrompts(ctx.user.id);
    }),
  }),

  popularPrompts: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getPopularPrompts(input.limit || 10);
      }),

    use: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.incrementPromptUsage(input.id);
        return { success: true };
      }),

    like: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.likePrompt(input.id);
        return { success: true };
      }),

    rate: protectedProcedure
      .input(
        z.object({
          promptId: z.number(),
          rating: z.number().min(1).max(5),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.ratePrompt({
          promptId: input.promptId,
          userId: ctx.user.id,
          rating: input.rating,
        });
        return { success: true };
      }),
  }),

  dashboard: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserStats(ctx.user.id);
    }),

    recentPrompts: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getRecentPrompts(ctx.user.id, input.limit || 5);
      }),
  }),

  activity: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserActivity(ctx.user.id, 50);
    }),
  }),

  share: router({
    generateLink: protectedProcedure
      .input(z.object({ promptId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const token = await db.generateShareToken(ctx.user.id, input.promptId);
        
        // Log activity
        await db.logActivity({
          userId: ctx.user.id,
          action: "share",
          entityType: "prompt",
          entityId: input.promptId,
          details: null,
        });
        
        return { token, url: `${process.env.VITE_APP_URL || ''}/share/${token}` };
      }),

    getByToken: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        return await db.getPromptByShareToken(input.token);
      }),

    togglePublic: protectedProcedure
      .input(z.object({ promptId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const isPublic = await db.togglePromptPublic(ctx.user.id, input.promptId);
        return { success: true, isPublic };
      }),
  }),

  prompt: router({
    analyze: publicProcedure
      .input(z.object({ prompt: z.string() }))
      .mutation(async ({ input }) => {
        // Use centralized prompt
        const systemPrompt = SYSTEM_PROMPTS.PROMPT_ANALYZER;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: input.prompt },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "prompt_analysis",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    score: { type: "number" },
                    strengths: { type: "array", items: { type: "string" } },
                    weaknesses: { type: "array", items: { type: "string" } },
                    suggestions: { type: "array", items: { type: "string" } },
                    improvedVersion: { type: "string" },
                  },
                  required: ["score", "strengths", "weaknesses", "suggestions", "improvedVersion"],
                  additionalProperties: false,
                },
              },
            },
          });

          const content = response.choices[0].message.content;
          if (!content || typeof content !== "string") throw new Error("لم يتم الحصول على رد");

          return JSON.parse(content);
        } catch (error) {
          console.error("Error analyzing prompt:", error);
          throw new Error("حدث خطأ في تحليل البرومبت");
        }
      }),

    generate: publicProcedure
      .input(
        z.object({
          basePrompt: z.string(),
          usageType: z.enum(["social", "code", "education", "crypto", "article", "exam"]),
          options: z.object({
            humanTone: z.boolean(),
            examples: z.boolean(),
            keyPoints: z.boolean(),
            complexity: z.enum(["بسيط", "متوسط", "متقدم"]),
            engaging: z.boolean(),
          }),
        })
      )
      .mutation(async ({ input }) => {
        const { basePrompt, usageType, options } = input;

        // Build system prompt based on usage type
        const usageTypePrompts = SYSTEM_PROMPTS.USAGE_TYPES;

        // Build enhancement instructions
        const enhancements: string[] = [];
        
        if (options.humanTone) {
          enhancements.push("استخدم لهجة بشرية طبيعية وودية");
        }
        if (options.examples) {
          enhancements.push("قدم أمثلة عملية وواقعية");
        }
        if (options.keyPoints) {
          enhancements.push("اعرض النقاط الرئيسية بشكل منظم وأضف ملخصاً في النهاية");
        }
        if (options.engaging) {
          enhancements.push("استخدم أسلوباً جدلياً محفزاً للتفاعل والنقاش");
        }

        const complexityInstructions: Record<string, string> = {
          "بسيط": "اجعل المحتوى بسيطاً وسهل الفهم للمبتدئين",
          "متوسط": "اجعل المحتوى متوازناً بين البساطة والعمق",
          "متقدم": "اجعل المحتوى متقدماً ومفصلاً للخبراء والمحترفين",
        };

        enhancements.push(complexityInstructions[options.complexity]);

        // Create the meta-prompt using centralized prompts
        const systemPrompt = `${usageTypePrompts[usageType]}

${SYSTEM_PROMPTS.PROMPT_ENHANCER(usageType)}

متطلبات التحسين:
${enhancements.map((e, i) => `${i + 1}. ${e}`).join("\n")}

البرومبت الأساسي المطلوب تحسينه:
"${basePrompt}"`;

        try {
          // Force DeepSeek for prompt generation (better quality for Arabic)
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: "قم بتحسين البرومبت الآن:",
              },
            ],
            provider: "deepseek", // Always use DeepSeek for prompt generation
          });

          const content = response.choices[0]?.message?.content;
          const enhancedPrompt = typeof content === 'string' ? content.trim() : basePrompt;

          return {
            enhancedPrompt,
            originalPrompt: basePrompt,
          };
        } catch (error) {
          console.error("Error generating prompt:", error);
          throw new Error("فشل في توليد البرومبت. الرجاء المحاولة مرة أخرى.");
        }
      }),
  }),

  worksheets: router({
    generate: publicProcedure
      .input(
        z.object({
          generationMethod: z.enum(["text", "file", "title"]),
          questionType: z.enum(["multiple_choice", "short_answer", "essay", "true_false", "fill_blank", "mixed"]),
          questionCount: z.number().min(1).max(30),
          language: z.string(),
          gradeLevel: z.string(),
          lessonTitle: z.string(),
          teacherName: z.string().optional(),
          schoolName: z.string().optional(),
          sourceText: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Use centralized prompt builder
        const prompt = SYSTEM_PROMPTS.buildWorksheetPrompt(input);

        try {
          const response = await invokeLLM({
            messages: [
              {
                role: "system",
                content: SYSTEM_PROMPTS.WORKSHEET_GEN,
              },
              {
                role: "user",
                content: prompt,
              },
            ],
          });

          const content = typeof response.choices[0].message.content === 'string'
            ? response.choices[0].message.content
            : JSON.stringify(response.choices[0].message.content);

          // Save to database only if user is authenticated
          if (ctx.user) {
            await db.createWorksheet({
              userId: ctx.user.id,
              title: input.lessonTitle,
              generationMethod: input.generationMethod,
              questionType: input.questionType,
              questionCount: input.questionCount,
              language: input.language,
              gradeLevel: input.gradeLevel,
              lessonTitle: input.lessonTitle,
              teacherName: input.teacherName || undefined,
              schoolName: input.schoolName || undefined,
              content,
              sourceText: input.sourceText || undefined,
            });

            // Log activity
            await db.logActivity({
              userId: ctx.user.id,
              action: "generate",
              entityType: "worksheet",
              details: JSON.stringify({ lessonTitle: input.lessonTitle }),
            });
          }

          return { content };
        } catch (error) {
          console.error("Error generating worksheet:", error);
          throw new Error("فشل في توليد ورقة العمل. الرجاء المحاولة مرة أخرى.");
        }
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserWorksheets(ctx.user.id);
    }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteWorksheet(input.id, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

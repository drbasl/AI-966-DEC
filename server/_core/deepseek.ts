/**
 * DeepSeek API Integration Service
 *
 * Provides advanced AI capabilities with support for:
 * - Multiple models (deepseek-chat, deepseek-reasoner)
 * - Customizable parameters (temperature, max_tokens)
 * - System prompts and message history
 * - JSON response formatting
 * - Error handling and retry logic
 */

import { ENV } from "./env";

export interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface DeepSeekRequestParams {
  model?: "deepseek-chat" | "deepseek-reasoner";
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
  stream?: boolean;
  response_format?: {
    type: "text" | "json_object" | "json_schema";
    json_schema?: {
      name: string;
      schema: Record<string, unknown>;
      strict?: boolean;
    };
  };
}

export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Call DeepSeek API with custom parameters
 */
export async function callDeepSeek(
  params: DeepSeekRequestParams
): Promise<DeepSeekResponse> {
  const apiKey = ENV.deepseekApiKey;
  const apiBase = ENV.deepseekApiBase || "https://api.deepseek.com";

  if (!apiKey) {
    throw new Error(
      "DEEPSEEK_API_KEY is not configured. Please add it to your .env file."
    );
  }

  const endpoint = `${apiBase}/v1/chat/completions`;

  const requestBody = {
    model: params.model || "deepseek-chat",
    messages: params.messages,
    temperature: params.temperature ?? 0.7,
    max_tokens: params.max_tokens ?? 4096,
    ...(params.top_p && { top_p: params.top_p }),
    ...(params.frequency_penalty && { frequency_penalty: params.frequency_penalty }),
    ...(params.presence_penalty && { presence_penalty: params.presence_penalty }),
    ...(params.stop && { stop: params.stop }),
    ...(params.stream !== undefined && { stream: params.stream }),
    ...(params.response_format && { response_format: params.response_format }),
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `DeepSeek API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    return data as DeepSeekResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`DeepSeek API call failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Generate text completion with DeepSeek
 */
export async function generateText(
  prompt: string,
  systemPrompt?: string,
  options?: {
    model?: "deepseek-chat" | "deepseek-reasoner";
    temperature?: number;
    max_tokens?: number;
  }
): Promise<string> {
  const messages: DeepSeekMessage[] = [];

  if (systemPrompt) {
    messages.push({
      role: "system",
      content: systemPrompt,
    });
  }

  messages.push({
    role: "user",
    content: prompt,
  });

  const response = await callDeepSeek({
    messages,
    model: options?.model,
    temperature: options?.temperature,
    max_tokens: options?.max_tokens,
  });

  return response.choices[0]?.message?.content || "";
}

/**
 * Generate JSON response with DeepSeek
 */
export async function generateJSON<T = unknown>(
  prompt: string,
  systemPrompt?: string,
  schema?: {
    name: string;
    schema: Record<string, unknown>;
  },
  options?: {
    model?: "deepseek-chat" | "deepseek-reasoner";
    temperature?: number;
    max_tokens?: number;
  }
): Promise<T> {
  const messages: DeepSeekMessage[] = [];

  if (systemPrompt) {
    messages.push({
      role: "system",
      content: systemPrompt,
    });
  }

  messages.push({
    role: "user",
    content: prompt,
  });

  const response = await callDeepSeek({
    messages,
    model: options?.model,
    temperature: options?.temperature,
    max_tokens: options?.max_tokens,
    response_format: schema
      ? {
          type: "json_schema",
          json_schema: {
            name: schema.name,
            schema: schema.schema,
            strict: true,
          },
        }
      : { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response content from DeepSeek");
  }

  try {
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${content}`);
  }
}

/**
 * Chat with conversation history
 */
export async function chat(
  messages: DeepSeekMessage[],
  options?: {
    model?: "deepseek-chat" | "deepseek-reasoner";
    temperature?: number;
    max_tokens?: number;
  }
): Promise<DeepSeekMessage> {
  const response = await callDeepSeek({
    messages,
    model: options?.model,
    temperature: options?.temperature,
    max_tokens: options?.max_tokens,
  });

  const assistantMessage = response.choices[0]?.message;
  if (!assistantMessage) {
    throw new Error("No message in response");
  }

  return {
    role: "assistant",
    content: assistantMessage.content,
  };
}

/**
 * Analyze text with DeepSeek (utility function)
 */
export async function analyzeText(
  text: string,
  analysisType: "summary" | "sentiment" | "keywords" | "custom",
  customPrompt?: string
): Promise<string> {
  const systemPrompts = {
    summary: "أنت مساعد متخصص في تلخيص النصوص بدقة واحترافية.",
    sentiment: "أنت محلل مشاعر متخصص في تحليل النصوص وتحديد المشاعر.",
    keywords: "أنت خبير في استخراج الكلمات المفتاحية والمصطلحات الهامة.",
    custom: customPrompt || "أنت مساعد ذكي متخصص.",
  };

  const userPrompts = {
    summary: `الرجاء تلخيص النص التالي:\n\n${text}`,
    sentiment: `الرجاء تحليل المشاعر في النص التالي:\n\n${text}`,
    keywords: `الرجاء استخراج الكلمات المفتاحية من النص التالي:\n\n${text}`,
    custom: text,
  };

  return generateText(
    userPrompts[analysisType],
    systemPrompts[analysisType],
    {
      temperature: 0.5,
      max_tokens: 2048,
    }
  );
}

/**
 * Enhance Arabic prompt with DeepSeek
 */
export async function enhanceArabicPrompt(
  basePrompt: string,
  options: {
    usageType?: string;
    complexity?: "بسيط" | "متوسط" | "متقدم";
    addExamples?: boolean;
    humanTone?: boolean;
  } = {}
): Promise<string> {
  const systemPrompt = `أنت خبير في تحسين وإنشاء البرومبتات العربية للذكاء الاصطناعي.
مهمتك تحسين البرومبت المعطى ليكون أكثر وضوحاً وفعالية واحترافية.

متطلبات التحسين:
${options.complexity ? `- المستوى: ${options.complexity}` : ""}
${options.addExamples ? "- إضافة أمثلة عملية" : ""}
${options.humanTone ? "- استخدام لهجة بشرية ودية" : ""}
${options.usageType ? `- النوع: ${options.usageType}` : ""}

اكتب البرومبت المحسّن مباشرة بدون مقدمات.`;

  return generateText(
    `البرومبت الأساسي: ${basePrompt}`,
    systemPrompt,
    {
      temperature: 0.8,
      max_tokens: 2048,
    }
  );
}

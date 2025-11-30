import { eq, desc, and, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, savedPrompts, InsertSavedPrompt, popularPrompts, InsertPopularPrompt, promptRatings, InsertPromptRating, activityLog, InsertActivityLog, projects, InsertProject, sessions, InsertSession, templates, InsertTemplate, modelCallLogs, InsertModelCallLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Saved Prompts functions
export async function createSavedPrompt(prompt: InsertSavedPrompt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(savedPrompts).values(prompt);
  return result;
}

export async function getUserSavedPrompts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(savedPrompts)
    .where(eq(savedPrompts.userId, userId))
    .orderBy(desc(savedPrompts.createdAt));
}

export async function deleteSavedPrompt(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .delete(savedPrompts)
    .where(and(eq(savedPrompts.id, id), eq(savedPrompts.userId, userId)));
}

export async function updateSavedPrompt(id: number, userId: number, updates: Partial<InsertSavedPrompt>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(savedPrompts)
    .set(updates)
    .where(and(eq(savedPrompts.id, id), eq(savedPrompts.userId, userId)));
}

// Popular Prompts functions
export async function getPopularPrompts(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(popularPrompts)
    .orderBy(desc(popularPrompts.rating), desc(popularPrompts.usageCount))
    .limit(limit);
}

export async function incrementPromptUsage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const prompt = await db.select().from(popularPrompts).where(eq(popularPrompts.id, id)).limit(1);
  if (prompt.length > 0) {
    await db
      .update(popularPrompts)
      .set({ usageCount: prompt[0].usageCount + 1 })
      .where(eq(popularPrompts.id, id));
  }
}

export async function likePrompt(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const prompt = await db.select().from(popularPrompts).where(eq(popularPrompts.id, id)).limit(1);
  if (prompt.length > 0) {
    await db
      .update(popularPrompts)
      .set({ likesCount: prompt[0].likesCount + 1 })
      .where(eq(popularPrompts.id, id));
  }
}

export async function ratePrompt(rating: InsertPromptRating) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Insert or update rating
  await db.insert(promptRatings).values(rating);
  
  // Recalculate average rating
  const ratings = await db
    .select()
    .from(promptRatings)
    .where(eq(promptRatings.promptId, rating.promptId));
  
  const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  
  await db
    .update(popularPrompts)
    .set({ rating: Math.round(avgRating * 10) })
    .where(eq(popularPrompts.id, rating.promptId));
}

// Dashboard Stats functions
export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const prompts = await db
    .select()
    .from(savedPrompts)
    .where(eq(savedPrompts.userId, userId));
  
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const thisMonthPrompts = prompts.filter(
    (p) => new Date(p.createdAt) >= firstDayOfMonth
  );
  
  // Get unique categories
  const categories = new Set(prompts.map(p => p.usageType).filter(Boolean));
  
  // Calculate favorites
  const favorites = prompts.filter(p => p.isFavorite === 1);
  
  // Calculate total shares
  const totalShares = prompts.reduce((sum, p) => sum + (p.shareCount || 0), 0);
  
  return {
    totalPrompts: prompts.length,
    favoritePrompts: favorites.length,
    totalCategories: categories.size,
    thisMonthPrompts: thisMonthPrompts.length,
    totalShares,
  };
}

export async function getRecentPrompts(userId: number, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select({
      id: savedPrompts.id,
      title: savedPrompts.title,
      content: savedPrompts.enhancedPrompt,
      category: savedPrompts.usageType,
      createdAt: savedPrompts.createdAt,
    })
    .from(savedPrompts)
    .where(eq(savedPrompts.userId, userId))
    .orderBy(desc(savedPrompts.createdAt))
    .limit(limit);
}

// ============= Favorites Functions =============

export async function toggleFavorite(userId: number, promptId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const prompt = await db.select().from(savedPrompts)
    .where(and(eq(savedPrompts.id, promptId), eq(savedPrompts.userId, userId)))
    .limit(1);

  if (prompt.length === 0) {
    throw new Error("Prompt not found");
  }

  const newFavoriteStatus = prompt[0].isFavorite === 1 ? 0 : 1;
  
  await db.update(savedPrompts)
    .set({ isFavorite: newFavoriteStatus })
    .where(eq(savedPrompts.id, promptId));

  return newFavoriteStatus === 1;
}

export async function getFavoritePrompts(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(savedPrompts)
    .where(and(eq(savedPrompts.userId, userId), eq(savedPrompts.isFavorite, 1)))
    .orderBy(desc(savedPrompts.updatedAt));
}

// ============= Activity Log Functions =============

export async function logActivity(data: InsertActivityLog): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(activityLog).values(data);
  } catch (error) {
    console.error("[Database] Failed to log activity:", error);
  }
}

export async function getUserActivity(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(activityLog)
    .where(eq(activityLog.userId, userId))
    .orderBy(desc(activityLog.createdAt))
    .limit(limit);
}

// ============= Share Functions =============

export async function generateShareToken(userId: number, promptId: number): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Generate unique token
  const crypto = await import("crypto");
  const token = crypto.randomBytes(32).toString("hex");

  // Get current prompt
  const currentPrompt = await db.select().from(savedPrompts)
    .where(and(eq(savedPrompts.id, promptId), eq(savedPrompts.userId, userId)))
    .limit(1);

  if (currentPrompt.length === 0) {
    throw new Error("Prompt not found");
  }

  // Update prompt with share token and make it public
  await db.update(savedPrompts)
    .set({ 
      shareToken: token, 
      isPublic: 1,
      shareCount: (currentPrompt[0].shareCount || 0) + 1
    })
    .where(and(eq(savedPrompts.id, promptId), eq(savedPrompts.userId, userId)));

  return token;
}

export async function getPromptByShareToken(token: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(savedPrompts)
    .where(and(eq(savedPrompts.shareToken, token), eq(savedPrompts.isPublic, 1)))
    .limit(1);

  if (result.length === 0) return null;

  // Increment view count
  await db.update(savedPrompts)
    .set({ viewCount: (result[0].viewCount || 0) + 1 })
    .where(eq(savedPrompts.id, result[0].id));

  return result[0];
}

export async function togglePromptPublic(userId: number, promptId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const prompt = await db.select().from(savedPrompts)
    .where(and(eq(savedPrompts.id, promptId), eq(savedPrompts.userId, userId)))
    .limit(1);

  if (prompt.length === 0) {
    throw new Error("Prompt not found");
  }

  const newPublicStatus = prompt[0].isPublic === 1 ? 0 : 1;
  
  await db.update(savedPrompts)
    .set({ isPublic: newPublicStatus })
    .where(eq(savedPrompts.id, promptId));

  return newPublicStatus === 1;
}

import { worksheets, type InsertWorksheet } from "../drizzle/schema";

// Worksheet operations
export async function createWorksheet(worksheet: InsertWorksheet) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(worksheets).values(worksheet);
  return result;
}

export async function getUserWorksheets(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(worksheets)
    .where(eq(worksheets.userId, userId))
    .orderBy(desc(worksheets.createdAt));
}

export async function getWorksheetById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(worksheets).where(eq(worksheets.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteWorksheet(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(worksheets).where(and(eq(worksheets.id, id), eq(worksheets.userId, userId)));
}

// Project operations
export async function listProjects(ownerId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(projects)
    .where(eq(projects.ownerId, ownerId))
    .orderBy(desc(projects.updatedAt));
}

export async function getProjectById(id: number, ownerId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.ownerId, ownerId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createProject(project: Omit<InsertProject, "id">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(projects).values(project);
  return result;
}

export async function updateProject(id: number, ownerId: number, updates: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(projects)
    .set({ ...updates, updatedAt: new Date() })
    .where(and(eq(projects.id, id), eq(projects.ownerId, ownerId)));
}

export async function archiveProject(id: number, ownerId: number) {
  await updateProject(id, ownerId, { status: "archived" as const });
}

// Session operations
export async function listSessions(userId: number, projectId?: number) {
  const db = await getDb();
  if (!db) return [];

  const whereClause = projectId
    ? and(eq(sessions.userId, userId), eq(sessions.projectId, projectId))
    : eq(sessions.userId, userId);

  return await db
    .select()
    .from(sessions)
    .where(whereClause)
    .orderBy(desc(sessions.lastActivityAt));
}

export async function createSession(session: Omit<InsertSession, "id">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = new Date();
  const result = await db.insert(sessions).values({
    ...session,
    createdAt: now,
    updatedAt: now,
    lastActivityAt: now,
  });
  return result;
}

export async function renameSession(id: number, userId: number, title: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(sessions)
    .set({ title, updatedAt: new Date(), lastActivityAt: new Date() })
    .where(and(eq(sessions.id, id), eq(sessions.userId, userId)));
}

// Templates operations
export async function listTemplatesForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(templates)
    .where(or(eq(templates.isShared, 1), eq(templates.ownerId, userId)))
    .orderBy(desc(templates.updatedAt));
}

export async function createTemplate(template: Omit<InsertTemplate, "id">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(templates).values(template);
}

export async function updateTemplate(id: number, ownerId: number, updates: Partial<InsertTemplate>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(templates)
    .set({ ...updates, updatedAt: new Date() })
    .where(and(eq(templates.id, id), eq(templates.ownerId, ownerId)));
}

export async function deleteTemplate(id: number, ownerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(templates)
    .where(and(eq(templates.id, id), eq(templates.ownerId, ownerId)));
}

export async function incrementTemplateUsage(id: number) {
  const db = await getDb();
  if (!db) return;

  const rows = await db.select().from(templates).where(eq(templates.id, id)).limit(1);
  if (rows.length === 0) return;
  const current = rows[0];

  await db
    .update(templates)
    .set({ usageCount: (current.usageCount ?? 0) + 1, updatedAt: new Date() })
    .where(eq(templates.id, id));
}

// Model call logs
export async function logModelCall(log: Omit<InsertModelCallLog, "id">) {
  const db = await getDb();
  if (!db) return;

  await db.insert(modelCallLogs).values(log);
}

export type UsageSummary = {
  totalCalls: number;
  totalCostUsd: number;
  byModel: Array<{ model: string; provider: string; calls: number; costUsd: number }>;
};

export async function getUsageSummary(userId: number): Promise<UsageSummary> {
  const db = await getDb();
  if (!db) {
    return { totalCalls: 0, totalCostUsd: 0, byModel: [] };
  }

  const rows = await db
    .select()
    .from(modelCallLogs)
    .where(eq(modelCallLogs.userId, userId));

  const byModelMap = new Map<string, { model: string; provider: string; calls: number; costUsd: number }>();

  let totalCostUsd = 0;
  rows.forEach(row => {
    const key = `${row.provider}:${row.model}`;
    const existing = byModelMap.get(key) || {
      model: row.model,
      provider: row.provider,
      calls: 0,
      costUsd: 0,
    };
    existing.calls += 1;
    existing.costUsd += row.costUsd ?? 0;
    byModelMap.set(key, existing);
    totalCostUsd += row.costUsd ?? 0;
  });

  return {
    totalCalls: rows.length,
    totalCostUsd,
    byModel: Array.from(byModelMap.values()).sort((a, b) => b.calls - a.calls),
  };
}

import { double, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Saved prompts table - stores user's personal prompt library
 */
export const savedPrompts = mysqlTable("savedPrompts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  basePrompt: text("basePrompt").notNull(),
  enhancedPrompt: text("enhancedPrompt").notNull(),
  usageType: varchar("usageType", { length: 50 }).notNull(),
  tags: text("tags"), // JSON array of tags
  isFavorite: int("isFavorite").default(0).notNull(), // 0 = false, 1 = true
  shareToken: varchar("shareToken", { length: 64 }).unique(), // Unique token for sharing
  isPublic: int("isPublic").default(0).notNull(), // 0 = private, 1 = public
  shareCount: int("shareCount").default(0).notNull(), // Number of times shared
  viewCount: int("viewCount").default(0).notNull(), // Number of views on public link
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SavedPrompt = typeof savedPrompts.$inferSelect;
export type InsertSavedPrompt = typeof savedPrompts.$inferInsert;

/**
 * Popular prompts table - community shared prompts with ratings
 */
export const popularPrompts = mysqlTable("popularPrompts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  prompt: text("prompt").notNull(),
  usageType: varchar("usageType", { length: 50 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  rating: int("rating").default(0).notNull(), // Average rating * 10 (e.g., 45 = 4.5 stars)
  usageCount: int("usageCount").default(0).notNull(),
  likesCount: int("likesCount").default(0).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PopularPrompt = typeof popularPrompts.$inferSelect;
export type InsertPopularPrompt = typeof popularPrompts.$inferInsert;

/**
 * Prompt ratings table - stores user ratings for popular prompts
 */
export const promptRatings = mysqlTable("promptRatings", {
  id: int("id").autoincrement().primaryKey(),
  promptId: int("promptId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PromptRating = typeof promptRatings.$inferSelect;
export type InsertPromptRating = typeof promptRatings.$inferInsert;

/**
 * Activity log table - tracks all user activities
 */
export const activityLog = mysqlTable("activityLog", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 50 }).notNull(), // generate, save, delete, update, favorite
  entityType: varchar("entityType", { length: 50 }).notNull(), // prompt, template, etc.
  entityId: int("entityId"), // ID of the related entity
  details: text("details"), // JSON with additional info
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = typeof activityLog.$inferInsert;
/**
 * Worksheets table - stores generated educational worksheets
 */
export const worksheets = mysqlTable("worksheets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  generationMethod: varchar("generationMethod", { length: 50 }).notNull(), // text, file, title
  questionType: varchar("questionType", { length: 50 }).notNull(), // multiple_choice, short_answer, essay, true_false, fill_blank, mixed
  questionCount: int("questionCount").notNull(),
  language: varchar("language", { length: 50 }).notNull(),
  gradeLevel: varchar("gradeLevel", { length: 50 }).notNull(),
  lessonTitle: varchar("lessonTitle", { length: 255 }).notNull(),
  teacherName: varchar("teacherName", { length: 255 }),
  schoolName: varchar("schoolName", { length: 255 }),
  content: text("content").notNull(), // Generated worksheet content
  sourceText: text("sourceText"), // Original text if method is 'text'
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Worksheet = typeof worksheets.$inferSelect;
export type InsertWorksheet = typeof worksheets.$inferInsert;

/**
 * Projects table - organizes workspaces/apps under a user.
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["active", "archived"]).default("active").notNull(),
  tags: text("tags"), // JSON array of tags
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Sessions table - chat/work sessions under a project or standalone.
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId"),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  mode: mysqlEnum("mode", ["chat", "analysis", "build"]).default("chat").notNull(),
  systemPrompt: text("systemPrompt"),
  activeModel: varchar("activeModel", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastActivityAt: timestamp("lastActivityAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

/**
 * Templates table - central prompt templates.
 */
export const templates = mysqlTable("templates", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId"),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).default("general").notNull(),
  content: text("content").notNull(),
  variables: text("variables"), // JSON array describing variables/slots
  isShared: int("isShared").default(0).notNull(),
  usageCount: int("usageCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;

/**
 * Model call logs - tracks model usage/cost per user/session/project.
 */
export const modelCallLogs = mysqlTable("modelCallLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId"),
  sessionId: int("sessionId"),
  model: varchar("model", { length: 128 }).notNull(),
  provider: varchar("provider", { length: 64 }).notNull(),
  promptTokens: int("promptTokens").default(0).notNull(),
  completionTokens: int("completionTokens").default(0).notNull(),
  costUsd: double("costUsd").default(0).notNull(),
  latencyMs: int("latencyMs").default(0).notNull(),
  status: varchar("status", { length: 32 }).default("success").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ModelCallLog = typeof modelCallLogs.$inferSelect;
export type InsertModelCallLog = typeof modelCallLogs.$inferInsert;

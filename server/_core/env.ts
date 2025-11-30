export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // OpenAI & Gemini API keys
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  // Additional providers
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  deepseekApiKey: process.env.DEEPSEEK_API_KEY ?? "",
  deepseekApiBase: process.env.DEEPSEEK_API_BASE ?? "",
  anthropicApiBase: process.env.ANTHROPIC_API_BASE ?? "",
  // Primary LLM provider: "openai" | "gemini" | "forge"
  llmProvider: process.env.LLM_PROVIDER ?? "gemini",
  defaultLlmProvider: process.env.DEFAULT_LLM_PROVIDER ?? "",
};

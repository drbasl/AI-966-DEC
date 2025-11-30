import { ENV } from "./env";
import type { Message } from "./llm";

export type Provider = "openai" | "gemini" | "anthropic" | "deepseek" | "forge";

export type RouteDecision = {
  provider: Provider;
  model: string;
  reason: string;
  apiKey?: string;
  apiBase?: string;
};

const DEFAULT_MODELS: Record<Provider, string> = {
  openai: "gpt-4o-mini",
  gemini: "gemini-2.5-flash",
  anthropic: "claude-3-5-sonnet-latest",
  deepseek: "deepseek-chat",
  forge: "gemini-2.5-flash",
};

const providerAvailable = {
  openai: () => !!ENV.openaiApiKey,
  gemini: () => !!ENV.geminiApiKey,
  anthropic: () => !!ENV.anthropicApiKey,
  deepseek: () => !!ENV.deepseekApiKey,
  forge: () => !!ENV.forgeApiKey,
};

const apiKeyFor = (provider: Provider) => {
  switch (provider) {
    case "openai":
      return ENV.openaiApiKey;
    case "gemini":
      return ENV.geminiApiKey;
    case "anthropic":
      return ENV.anthropicApiKey;
    case "deepseek":
      return ENV.deepseekApiKey;
    case "forge":
      return ENV.forgeApiKey;
  }
};

const apiBaseFor = (provider: Provider) => {
  switch (provider) {
    case "deepseek":
      return ENV.deepseekApiBase;
    case "anthropic":
      return ENV.anthropicApiBase;
    default:
      return "";
  }
};

const detectTask = (messages: Message[]): "code" | "long" | "general" => {
  const text = messages
    .map(m => (typeof m.content === "string" ? m.content : ""))
    .join(" ")
    .toLowerCase();
  if (text.includes("```") || text.includes("code") || text.includes("function")) {
    return "code";
  }
  if (text.length > 1200 || text.includes("analyze") || text.includes("summarize")) {
    return "long";
  }
  return "general";
};

const getPreferredOrder = (): Provider[] => {
  const explicit = (ENV.defaultLlmProvider || ENV.llmProvider || "").toLowerCase() as Provider;
  const order: Provider[] = ["openai", "anthropic", "deepseek", "gemini", "forge"];
  if (explicit && order.includes(explicit)) {
    return [explicit, ...order.filter(p => p !== explicit)];
  }
  return order;
};

export function routeModel(options: {
  messages: Message[];
  preferredProvider?: Provider;
  preferredModel?: string;
  taskHint?: "code" | "long" | "general";
}): RouteDecision {
  const task = options.taskHint ?? detectTask(options.messages);

  if (options.preferredProvider && providerAvailable[options.preferredProvider]()) {
    return {
      provider: options.preferredProvider,
      model: options.preferredModel || DEFAULT_MODELS[options.preferredProvider],
      reason: "User preference",
      apiKey: apiKeyFor(options.preferredProvider),
      apiBase: apiBaseFor(options.preferredProvider),
    };
  }

  const ordered = getPreferredOrder().filter(p => providerAvailable[p]());

  const pickByTask = () => {
    if (task === "code") {
      return ordered.find(p => p === "openai" || p === "deepseek") ?? ordered[0];
    }
    if (task === "long") {
      return ordered.find(p => p === "anthropic" || p === "gemini") ?? ordered[0];
    }
    return ordered[0];
  };

  const provider = pickByTask() || "gemini";
  return {
    provider,
    model: DEFAULT_MODELS[provider],
    reason: `Rule-based routing for task=${task}`,
    apiKey: apiKeyFor(provider),
    apiBase: apiBaseFor(provider),
  };
}

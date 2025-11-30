import { logModelCall } from "../db";
import { routeModel, type Provider } from "./modelRouter";
import { invokeLLM, type InvokeParams, type Message, type InvokeResult } from "./llm";

type ChatOptions = {
  messages: Message[];
  userId?: number;
  projectId?: number;
  sessionId?: number;
  provider?: Provider;
  model?: string;
  taskHint?: "code" | "long" | "general";
};

const PRICING_TABLE: Record<Provider, { prompt: number; completion: number }> = {
  openai: { prompt: 0.00015, completion: 0.0006 }, // gpt-4o-mini-ish
  gemini: { prompt: 0.0001, completion: 0.0003 },
  anthropic: { prompt: 0.0008, completion: 0.0024 },
  deepseek: { prompt: 0.00014, completion: 0.00028 },
  forge: { prompt: 0.0001, completion: 0.0003 },
};

const estimateCost = (provider: Provider, promptTokens: number, completionTokens: number) => {
  const pricing = PRICING_TABLE[provider] ?? PRICING_TABLE.gemini;
  return (promptTokens / 1000) * pricing.prompt + (completionTokens / 1000) * pricing.completion;
};

export async function handleChatRequest(options: ChatOptions): Promise<{
  decision: { provider: Provider; model: string; reason: string };
  response: InvokeResult;
}> {
  const decision = routeModel({
    messages: options.messages,
    preferredProvider: options.provider,
    preferredModel: options.model,
    taskHint: options.taskHint,
  });

  const start = Date.now();
  let response: InvokeResult;

  try {
    response = await invokeLLM({
      messages: options.messages,
      provider: decision.provider,
      model: decision.model,
      apiKeyOverride: decision.apiKey,
      apiBaseOverride: decision.apiBase,
    } as InvokeParams);
  } catch (error) {
    await logModelCall({
      userId: options.userId ?? 0,
      projectId: options.projectId,
      sessionId: options.sessionId,
      model: options.model || decision.model,
      provider: decision.provider,
      promptTokens: 0,
      completionTokens: 0,
      costUsd: 0,
      latencyMs: Date.now() - start,
      status: "error",
      metadata: error instanceof Error ? error.message : "unknown error",
      createdAt: new Date(),
    });
    throw error;
  }

  const promptTokens = response.usage?.prompt_tokens ?? 0;
  const completionTokens = response.usage?.completion_tokens ?? 0;
  const costUsd = estimateCost(decision.provider, promptTokens, completionTokens);

  await logModelCall({
    userId: options.userId ?? 0,
    projectId: options.projectId,
    sessionId: options.sessionId,
    model: options.model || decision.model,
    provider: decision.provider,
    promptTokens,
    completionTokens,
    costUsd,
    latencyMs: Date.now() - start,
    status: "success",
    metadata: response.model,
    createdAt: new Date(),
  });

  return {
    decision: {
      provider: decision.provider,
      model: options.model || decision.model,
      reason: decision.reason,
    },
    response,
  };
}

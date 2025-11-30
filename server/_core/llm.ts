import { ENV } from "./env";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: "audio/mpeg" | "audio/wav" | "application/pdf" | "audio/mp4" | "video/mp4" ;
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = {
  type: "function";
  function: {
    name: string;
  };
};

export type ToolChoice =
  | ToolChoicePrimitive
  | ToolChoiceByName
  | ToolChoiceExplicit;

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  provider?: LLMProvider;
  model?: string;
  apiKeyOverride?: string;
  apiBaseOverride?: string;
};

export type ToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type OutputSchema = JsonSchema;

export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

const ensureArray = (
  value: MessageContent | MessageContent[]
): MessageContent[] => (Array.isArray(value) ? value : [value]);

const normalizeContentPart = (
  part: MessageContent
): TextContent | ImageContent | FileContent => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }

  if (part.type === "text") {
    return part;
  }

  if (part.type === "image_url") {
    return part;
  }

  if (part.type === "file_url") {
    return part;
  }

  throw new Error("Unsupported message content part");
};

const normalizeMessage = (message: Message) => {
  const { role, name, tool_call_id } = message;

  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content)
      .map(part => (typeof part === "string" ? part : JSON.stringify(part)))
      .join("\n");

    return {
      role,
      name,
      tool_call_id,
      content,
    };
  }

  const contentParts = ensureArray(message.content).map(normalizeContentPart);

  // If there's only text content, collapse to a single string for compatibility
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text,
    };
  }

  return {
    role,
    name,
    content: contentParts,
  };
};

const normalizeToolChoice = (
  toolChoice: ToolChoice | undefined,
  tools: Tool[] | undefined
): "none" | "auto" | ToolChoiceExplicit | undefined => {
  if (!toolChoice) return undefined;

  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }

  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }

    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }

    return {
      type: "function",
      function: { name: tools[0].function.name },
    };
  }

  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name },
    };
  }

  return toolChoice;
};

type LLMProvider = "openai" | "gemini" | "forge" | "anthropic" | "deepseek";

const getProvider = (override?: LLMProvider): LLMProvider => {
  const desired = (override || ENV.defaultLlmProvider || ENV.llmProvider) as LLMProvider | undefined;
  const available = {
    gemini: !!ENV.geminiApiKey,
    openai: !!ENV.openaiApiKey,
    forge: !!ENV.forgeApiKey,
    anthropic: !!ENV.anthropicApiKey,
    deepseek: !!ENV.deepseekApiKey,
  };

  if (desired && available[desired]) return desired;
  if (available.openai) return "openai";
  if (available.anthropic) return "anthropic";
  if (available.deepseek) return "deepseek";
  if (available.forge) return "forge";
  return "gemini";
};

const resolveApiUrl = (provider: LLMProvider, apiBaseOverride?: string): string => {
  const overrideBase = apiBaseOverride?.trim();

  switch (provider) {
    case "openai":
      return overrideBase && overrideBase.length > 0
        ? `${overrideBase.replace(/\/$/, "")}/v1/chat/completions`
        : "https://api.openai.com/v1/chat/completions";
    case "gemini":
      return overrideBase && overrideBase.length > 0
        ? `${overrideBase.replace(/\/$/, "")}/v1beta/openai/chat/completions`
        : "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
    case "anthropic":
      return overrideBase && overrideBase.length > 0
        ? `${overrideBase.replace(/\/$/, "")}/v1/chat/completions`
        : "https://api.anthropic.com/v1/messages";
    case "deepseek":
      return overrideBase && overrideBase.length > 0
        ? `${overrideBase.replace(/\/$/, "")}/v1/chat/completions`
        : "https://api.deepseek.com/v1/chat/completions";
    case "forge":
    default:
      return overrideBase && overrideBase.length > 0
        ? `${overrideBase.replace(/\/$/, "")}/v1/chat/completions`
        : ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0
          ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`
          : "https://forge.manus.im/v1/chat/completions";
  }
};

const getApiKey = (provider?: LLMProvider, apiKeyOverride?: string): string => {
  if (apiKeyOverride) return apiKeyOverride;
  const resolved = provider || getProvider();

  switch (resolved) {
    case "openai":
      return ENV.openaiApiKey;
    case "gemini":
      return ENV.geminiApiKey;
    case "anthropic":
      return ENV.anthropicApiKey;
    case "deepseek":
      return ENV.deepseekApiKey;
    case "forge":
    default:
      return ENV.forgeApiKey;
  }
};

const getModel = (provider?: LLMProvider): string => {
  const resolved = provider || getProvider();

  switch (resolved) {
    case "openai":
      return "gpt-4o-mini";
    case "gemini":
      return "gemini-2.5-flash";
    case "anthropic":
      return "claude-3-5-sonnet-latest";
    case "deepseek":
      return "deepseek-chat";
    case "forge":
    default:
      return "gemini-2.5-flash";
  }
};

const assertApiKey = (provider?: LLMProvider, apiKeyOverride?: string) => {
  const apiKey = getApiKey(provider, apiKeyOverride);
  if (!apiKey) {
    throw new Error(`API key is not configured. Set OPENAI_API_KEY or GEMINI_API_KEY in .env file`);
  }
};

const normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema,
}: {
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
}):
  | { type: "json_schema"; json_schema: JsonSchema }
  | { type: "text" }
  | { type: "json_object" }
  | undefined => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (
      explicitFormat.type === "json_schema" &&
      !explicitFormat.json_schema?.schema
    ) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }

  const schema = outputSchema || output_schema;
  if (!schema) return undefined;

  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }

  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...(typeof schema.strict === "boolean" ? { strict: schema.strict } : {}),
    },
  };
};

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const provider = getProvider(params.provider);
  const apiKey = getApiKey(provider, params.apiKeyOverride);
  assertApiKey(provider, params.apiKeyOverride);

  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
    model,
    apiBaseOverride,
  } = params;

  const payload: Record<string, unknown> = {
    model: model || getModel(provider),
    messages: messages.map(normalizeMessage),
  };

  if (tools && tools.length > 0) {
    payload.tools = tools;
  }

  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }

  payload.max_tokens = 8192

  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema,
  });

  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }

  const response = await fetch(resolveApiUrl(provider, apiBaseOverride), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} – ${errorText}`
    );
  }

  return (await response.json()) as InvokeResult;
}

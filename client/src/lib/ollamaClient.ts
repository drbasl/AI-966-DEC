/**
 * Ollama Client for Raqim AI 966
 * Connects to self-hosted Ollama instance at ollama.raqim966.com
 */

const OLLAMA_API_URL = 'https://ollama.raqim966.com/api';

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  system?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

/**
 * Generate text using Ollama
 */
export async function generateWithOllama(
  prompt: string,
  model: string = 'qwen2.5:7b',
  systemPrompt?: string,
  temperature: number = 0.7
): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        system: systemPrompt,
        temperature,
        stream: false,
      } as OllamaGenerateRequest),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data: OllamaGenerateResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error('Ollama generation error:', error);
    throw error;
  }
}

/**
 * Stream text generation using Ollama
 */
export async function* streamWithOllama(
  prompt: string,
  model: string = 'qwen2.5:7b',
  systemPrompt?: string,
  temperature: number = 0.7
): AsyncGenerator<string> {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        system: systemPrompt,
        temperature,
        stream: true,
      } as OllamaGenerateRequest),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          try {
            const data: OllamaGenerateResponse = JSON.parse(line);
            if (data.response) {
              yield data.response;
            }
          } catch (e) {
            console.error('Failed to parse line:', line);
          }
        }
      }
    }
  } catch (error) {
    console.error('Ollama stream error:', error);
    throw error;
  }
}

/**
 * List available Ollama models
 */
export async function listOllamaModels(): Promise<OllamaModel[]> {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/tags`);
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error('Failed to list Ollama models:', error);
    return [];
  }
}

/**
 * Check if Ollama is available
 */
export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    console.error('Ollama health check failed:', error);
    return false;
  }
}

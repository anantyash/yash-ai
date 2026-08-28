export interface GenerateOptions {
  systemPrompt?: string;
  context?: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
  signal?: AbortSignal;
}

export interface GenerateResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export interface AIProvider {
  generate(options: GenerateOptions): Promise<GenerateResult>;
  stream(
    options: GenerateOptions,
  ): AsyncGenerator<string, GenerateResult, unknown>;
}

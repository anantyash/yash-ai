import { generateText, embed } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { env } from '../../config/env.js';
import { GenerateOptions, GenerateResult } from './ai.types.js';
import { ProviderError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';
import { estimateTokens } from '../budget/token-estimator.js';

export class OpenAIService {
  private openaiProvider: ReturnType<typeof createOpenAI>;

  constructor() {
    this.openaiProvider = createOpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const { embedding } = await embed({
        model: this.openaiProvider.embedding(env.RAG_EMBEDDING_MODEL),
        value: text.replace(/\n+/g, ' '),
      });

      return embedding;
    } catch (error: any) {
      logger.error({ err: error.message }, 'OpenAI embedding generation failed via AI SDK');
      throw new ProviderError(error.message || 'Failed to generate query embedding');
    }
  }

  async generate(options: GenerateOptions): Promise<GenerateResult> {
    const fullPrompt = options.context
      ? `[VERIFIED PORTFOLIO CONTEXT]\n${options.context}\n\n[USER QUESTION]\n${options.userPrompt}\n\n[INSTRUCTION]: Answer the question accurately using ONLY the verified context documents above.`
      : options.userPrompt;

    try {
      const { text, usage } = await generateText({
        model: this.openaiProvider(env.RAG_CHAT_MODEL),
        system: options.systemPrompt,
        prompt: fullPrompt,
        maxOutputTokens: options.maxTokens || env.RAG_MAX_OUTPUT_TOKENS,
        temperature: options.temperature ?? 0.1,
        abortSignal: options.signal,
      });

      const inputTokens = usage?.inputTokens || estimateTokens(fullPrompt);
      const outputTokens = usage?.outputTokens || estimateTokens(text);
      const totalTokens = usage?.totalTokens || inputTokens + outputTokens;

      return {
        text: text || 'Unable to synthesize grounded answer.',
        inputTokens,
        outputTokens,
        totalTokens,
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new ProviderError('OpenAI request timed out', 504, 'PROVIDER_TIMEOUT');
      }
      if (error instanceof ProviderError) throw error;
      throw new ProviderError(error.message || 'OpenAI chat completion error');
    }
  }
}

export const openaiService = new OpenAIService();

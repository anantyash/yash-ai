import { generateText, streamText } from "ai";
import { createGoogle } from "@ai-sdk/google";
import { AIProvider, GenerateOptions, GenerateResult } from "./ai.types.js";
import { env } from "../../config/env.js";
import { ProviderError } from "../../utils/errors.js";
import { logger } from "../../utils/logger.js";
import { estimateTokens } from "../budget/token-estimator.js";

export class GeminiService implements AIProvider {
  private googleProvider: ReturnType<typeof createGoogle>;
  private modelName: string;

  constructor() {
    this.googleProvider = createGoogle({
      apiKey: env.GEMINI_API_KEY,
    });
    this.modelName = env.ASK_MODEL || "gemini-3.6-flash";
  }

  async generate(options: GenerateOptions): Promise<GenerateResult> {
    const candidateModels = [
      this.modelName,
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-3.7-flash",
      "gemini-flash-latest",
    ];

    const modelsToTry = Array.from(new Set(candidateModels));
    let lastError: any = null;

    const fullPrompt = options.context
      ? `[VERIFIED PORTFOLIO CONTEXT]\n${options.context}\n\n[USER QUESTION]\n${options.userPrompt}`
      : options.userPrompt;

    for (const modelId of modelsToTry) {
      try {
        const { text, usage } = await generateText({
          model: this.googleProvider(modelId),
          system: options.systemPrompt,
          prompt: fullPrompt,
          maxOutputTokens: Math.max(options.maxTokens || 1200, 1200),
          temperature: options.temperature ?? 0.2,
          abortSignal: options.signal,
        });

        const inputTokens = usage?.inputTokens || estimateTokens(fullPrompt);
        const outputTokens = usage?.outputTokens || estimateTokens(text);
        const totalTokens = usage?.totalTokens || inputTokens + outputTokens;

        return {
          text,
          inputTokens,
          outputTokens,
          totalTokens,
        };
      } catch (error: any) {
        lastError = error;
        logger.warn(
          { model: modelId, error: error.message },
          "AI SDK Gemini model attempt failed, trying fallback",
        );

        if (error.name === "AbortError") {
          throw new ProviderError(
            "Gemini request timed out",
            504,
            "PROVIDER_TIMEOUT",
          );
        }
      }
    }

    logger.error(
      { error: lastError?.message, stack: lastError?.stack },
      "All Gemini model attempts failed",
    );
    throw new ProviderError(
      lastError?.message || "Gemini AI SDK communication error",
    );
  }

  async *stream(
    options: GenerateOptions,
  ): AsyncGenerator<string, GenerateResult, unknown> {
    const fullPrompt = options.context
      ? `[VERIFIED PORTFOLIO CONTEXT]\n${options.context}\n\n[USER QUESTION]\n${options.userPrompt}`
      : options.userPrompt;

    try {
      const result = streamText({
        model: this.googleProvider(this.modelName),
        system: options.systemPrompt,
        prompt: fullPrompt,
        maxOutputTokens: options.maxTokens || env.ASK_MAX_OUTPUT_TOKENS,
        temperature: options.temperature ?? 0.2,
        abortSignal: options.signal,
      });

      let fullText = "";
      for await (const textDelta of result.textStream) {
        if (textDelta) {
          fullText += textDelta;
          yield textDelta;
        }
      }

      const inputTokens = estimateTokens(fullPrompt);
      const outputTokens = estimateTokens(fullText);

      return {
        text: fullText,
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
      };
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new ProviderError(
          "Gemini stream timed out",
          504,
          "PROVIDER_TIMEOUT",
        );
      }
      throw new ProviderError(
        error.message || "Gemini streaming communication error",
      );
    }
  }
}

export const geminiService = new GeminiService();

import { openaiService } from "../ai/openai.service.js";
import {
  vectorRepository,
  RetrievedChunk,
} from "../../repositories/vector.repository.js";
import { responseCacheService } from "../cache/response-cache.js";
import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

export class RetrievalService {
  async retrieveContext(
    queryText: string,
    topK = env.RAG_TOP_K,
  ): Promise<{ chunks: RetrievedChunk[]; queryEmbedding: number[] }> {
    // 1. Check Redis embedding cache for repeated query
    let embedding = await responseCacheService.getCachedEmbedding(queryText);

    if (!embedding) {
      embedding = await openaiService.generateEmbedding(queryText);
      await responseCacheService.setCachedEmbedding(queryText, embedding);
    } else {
      logger.info({ queryText }, "Query embedding cache hit");
    }

    // 2. Perform pgvector similarity search
    const chunks = await vectorRepository.searchSimilarChunks(
      embedding,
      topK,
      env.RAG_SIMILARITY_THRESHOLD,
    );

    logger.info(
      { matchedChunks: chunks.length, topK },
      "Retrieved vector chunks",
    );

    return { chunks, queryEmbedding: embedding };
  }
}

export const retrievalService = new RetrievalService();

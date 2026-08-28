import { SessionRecord } from '../../repositories/session.repository.js';
import { env } from '../../config/env.js';
import { BudgetExceededError } from '../../utils/errors.js';
import { reservationService } from './reservation.service.js';

export class BudgetService {
  /**
   * Validates that the session has not exceeded question count or token limits.
   */
  validateSessionBudget(session: SessionRecord, service: 'ask' | 'rag', estimatedTokens: number): void {
    if (service === 'ask') {
      if (session.ask_questions >= env.ASK_SESSION_LIMIT) {
        throw new BudgetExceededError(
          `You have reached the maximum of ${env.ASK_SESSION_LIMIT} questions for 'Ask Yash' this session.`
        );
      }
      if (session.ask_tokens + estimatedTokens > env.ASK_SESSION_TOKEN_BUDGET) {
        throw new BudgetExceededError(
          `You have reached the token limit (${env.ASK_SESSION_TOKEN_BUDGET} tokens) for 'Ask Yash' this session.`
        );
      }
    } else {
      if (session.rag_questions >= env.RAG_SESSION_LIMIT) {
        throw new BudgetExceededError(
          `You have reached the maximum of ${env.RAG_SESSION_LIMIT} questions for the RAG Engine this session.`
        );
      }
      if (session.rag_tokens + estimatedTokens > env.RAG_SESSION_TOKEN_BUDGET) {
        throw new BudgetExceededError(
          `You have reached the token limit (${env.RAG_SESSION_TOKEN_BUDGET} tokens) for the RAG Engine this session.`
        );
      }
    }
  }

  async checkAndReserveTokens(
    session: SessionRecord,
    service: 'ask' | 'rag',
    estimatedTokens: number
  ): Promise<void> {
    // 1. Session check
    this.validateSessionBudget(session, service, estimatedTokens);

    // 2. Global budget reservation
    await reservationService.reserveGlobalTokens(estimatedTokens);
  }
}

export const budgetService = new BudgetService();

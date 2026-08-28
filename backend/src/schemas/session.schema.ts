import { z } from 'zod';
import { uuidSchema } from './common.schema.js';

export const sessionResponseSchema = z.object({
  sessionId: uuidSchema,
  expiresAt: z.string().datetime(),
  limits: z.object({
    askQuestionsRemaining: z.number().int().nonnegative(),
    ragQuestionsRemaining: z.number().int().nonnegative(),
    askTokensRemaining: z.number().int().nonnegative(),
    ragTokensRemaining: z.number().int().nonnegative(),
  }),
});

export type SessionResponse = z.infer<typeof sessionResponseSchema>;

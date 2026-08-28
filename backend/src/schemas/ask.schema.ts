import { z } from "zod";
import { uuidSchema, usageTokenSchema } from "./common.schema.js";

export const askRequestSchema = z.object({
  question: z
    .string({ required_error: "Question is required" })
    .trim()
    .min(2, "Question must be at least 2 characters long")
    .max(500, "Question cannot exceed 500 characters"),
  sessionId: uuidSchema.optional(),
  stream: z.boolean().default(false),
});

export const askResponseSchema = z.object({
  answer: z.string().min(1).max(3000),
  service: z.literal("ask"),
  provider: z.literal("gemini"),
  model: z.string(),
  usage: usageTokenSchema,
  cacheHit: z.boolean(),
  limits: z.object({
    questionsRemaining: z.number().int().nonnegative(),
    tokensRemaining: z.number().int().nonnegative(),
  }),
});

export type AskRequest = z.infer<typeof askRequestSchema>;
export type AskResponse = z.infer<typeof askResponseSchema>;

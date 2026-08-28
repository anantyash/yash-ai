import { z } from "zod";
import { uuidSchema, usageTokenSchema } from "./common.schema.js";

export const ragRequestSchema = z.object({
  question: z
    .string({ required_error: "Question is required" })
    .trim()
    .min(3, "Question must be at least 3 characters long")
    .max(500, "Question cannot exceed 500 characters"),
  sessionId: uuidSchema.optional(),
  topK: z.number().int().min(1).max(5).optional(),
});

export const ragSourceSchema = z.object({
  documentId: z.string(),
  title: z.string(),
  score: z.number().min(0).max(1),
  source: z.string(),
  content: z.string(),
});

export const ragResponseSchema = z.object({
  answer: z.string().min(1).max(4000),
  service: z.literal("rag"),
  provider: z.literal("openai"),
  model: z.string(),
  sources: z.array(ragSourceSchema),
  usage: usageTokenSchema,
  cacheHit: z.boolean(),
  limits: z.object({
    questionsRemaining: z.number().int().nonnegative(),
    tokensRemaining: z.number().int().nonnegative(),
  }),
});

export type RagRequest = z.infer<typeof ragRequestSchema>;
export type RagSource = z.infer<typeof ragSourceSchema>;
export type RagResponse = z.infer<typeof ragResponseSchema>;

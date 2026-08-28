import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  ALLOWED_ORIGIN: z.string().default("http://localhost:3000"),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),

  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),

  ASK_MODEL: z.string().default("gemini-3.6-flash"),
  ASK_MAX_INPUT_TOKENS: z.coerce.number().int().positive().default(800),
  ASK_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(1000),
  ASK_SESSION_LIMIT: z.coerce.number().int().positive().default(8),
  ASK_SESSION_TOKEN_BUDGET: z.coerce.number().int().positive().default(10000),

  RAG_CHAT_MODEL: z.string().default("gpt-4o-mini"),
  RAG_EMBEDDING_MODEL: z.string().default("text-embedding-3-small"),
  RAG_MAX_QUERY_TOKENS: z.coerce.number().int().positive().default(500),
  RAG_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(1000),
  RAG_SESSION_LIMIT: z.coerce.number().int().positive().default(3),
  RAG_SESSION_TOKEN_BUDGET: z.coerce.number().int().positive().default(10000),
  RAG_TOP_K: z.coerce.number().int().min(1).max(10).default(4),
  RAG_SIMILARITY_THRESHOLD: z.coerce.number().min(0).max(1).default(0.3),

  GLOBAL_DAILY_TOKEN_LIMIT: z.coerce.number().int().positive().default(30000),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(5),
  MAX_CONCURRENT_REQUESTS_PER_SESSION: z.coerce
    .number()
    .int()
    .positive()
    .default(1),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(20000),

  CACHE_RESPONSE_TTL_SECONDS: z.coerce.number().int().positive().default(3600),
  CACHE_EMBEDDING_TTL_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(86400),

  ADMIN_API_KEY: z.string().default("dev_admin_secret_key_12345"),
  ASK_YASH_ENABLED: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .default("true"),
  RAG_ENABLED: z
    .enum(["true", "false"])
    .transform((v) => v === "true")
    .default("true"),
});

export type EnvConfig = z.infer<typeof envSchema>;

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables configuration:",
    JSON.stringify(parsedEnv.error.format(), null, 2),
  );
  if (process.env.NODE_ENV !== "test") {
    process.exit(1);
  }
}

export const env: EnvConfig = parsedEnv.success
  ? parsedEnv.data
  : ({} as EnvConfig);

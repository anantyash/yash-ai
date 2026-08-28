import { describe, it, expect } from "vitest";
import { estimateTokens } from "../../src/services/budget/token-estimator.js";

describe("Token Estimator", () => {
  it("should return 0 for empty string", () => {
    expect(estimateTokens("")).toBe(0);
    expect(estimateTokens("   ")).toBe(0);
  });

  it("should return minimum 5 tokens for short queries", () => {
    expect(estimateTokens("Hi")).toBe(5);
    expect(estimateTokens("What?")).toBe(5);
  });

  it("should estimate ~4 characters per token for typical questions", () => {
    const question = "What projects has Yash built using Gemini and OpenAI?"; // 53 chars
    const tokens = estimateTokens(question);
    expect(tokens).toBeGreaterThanOrEqual(13);
    expect(tokens).toBeLessThanOrEqual(25);
  });
});

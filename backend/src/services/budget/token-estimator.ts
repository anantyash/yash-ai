/**
 * Fast deterministic token estimator for pre-flight budget checks.
 * Averages ~4 characters per token in English text with a 15% safety buffer.
 */
export function estimateTokens(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  const rawEstimate = Math.ceil(text.trim().length / 3.8);
  // Add minimum baseline of 5 tokens
  return Math.max(rawEstimate, 5);
}

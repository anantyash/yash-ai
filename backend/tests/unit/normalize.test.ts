import { describe, it, expect } from "vitest";
import { normalizeQuestion, hashString } from "../../src/utils/normalize.js";

describe("Question Normalization & Hashing", () => {
  it("should normalize casing, whitespace, and trailing punctuation identically", () => {
    const q1 = "What projects has Yash built?";
    const q2 = "  what   projects has yash built  ";
    const q3 = "what projects has yash built???";

    expect(normalizeQuestion(q1)).toBe("what projects has yash built");
    expect(normalizeQuestion(q2)).toBe("what projects has yash built");
    expect(normalizeQuestion(q3)).toBe("what projects has yash built");

    const h1 = hashString(normalizeQuestion(q1));
    const h2 = hashString(normalizeQuestion(q2));
    const h3 = hashString(normalizeQuestion(q3));

    expect(h1).toBe(h2);
    expect(h2).toBe(h3);
  });
});

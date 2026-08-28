import { describe, it, expect } from "vitest";
import { TopicGuard } from "../../src/services/guardrails/topic.guard.js";
import { GuardrailError } from "../../src/utils/errors.js";

describe("TopicGuard", () => {
  it("should pass relevant software and portfolio questions", () => {
    expect(() =>
      TopicGuard.validate("Does Yash have experience with RAG?"),
    ).not.toThrow();
    expect(() =>
      TopicGuard.validate("What technologies are in his stack?"),
    ).not.toThrow();
  });

  it("should reject disallowed off-topic queries", () => {
    expect(() =>
      TopicGuard.validate("Should I buy Bitcoin right now?"),
    ).toThrow(GuardrailError);
    expect(() =>
      TopicGuard.validate("Give me medical advice for back pain"),
    ).toThrow(GuardrailError);
    expect(() =>
      TopicGuard.validate("Who should I vote for in the election?"),
    ).toThrow(GuardrailError);
  });
});

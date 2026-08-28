import { GuardrailError } from "../../utils/errors.js";

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /you\s+are\s+now\s+(in\s+)?(dan|jailbreak|developer\s+mode)/i,
  /reveal\s+(.*)?(system\s+prompt|instructions|api\s*key|secret)/i,
  /(what\s+is|show\s+me|tell\s+me|print|output|give\s+me)\s+(.*)?(system\s+prompt|hidden\s+instruction|api\s*key|secret)/i,
  /api\s*key/i,
  /system\s+prompt/i,
  /<script[\s\S]*?>/i,
  /exec\s*\(/i,
  /eval\s*\(/i,
];

export class InjectionGuard {
  static validate(input: string): void {
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(input)) {
        throw new GuardrailError(
          "I can only answer factual questions regarding Yash and his engineering work.",
          "PROMPT_INJECTION_DETECTED",
        );
      }
    }
  }
}

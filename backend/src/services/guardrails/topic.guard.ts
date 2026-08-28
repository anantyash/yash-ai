import { GuardrailError } from "../../utils/errors.js";

const DISALLOWED_GENERAL_TOPICS = [
  /bitcoin|crypto\s+trading|stock\s+tips|buy\s+crypto/i,
  /medical\s+advice|symptom\s+check|prescribe/i,
  /political\s+opinion|vote\s+for|election\s+prediction/i,
  /write\s+an\s+essay\s+about|homework\s+help/i,
  /generate\s+porn|nsfw|gambling/i,
];

export class TopicGuard {
  static validate(input: string): void {
    for (const pattern of DISALLOWED_GENERAL_TOPICS) {
      if (pattern.test(input)) {
        throw new GuardrailError(
          "I am a specialized assistant focused solely on Yash and his software engineering portfolio.",
          "TOPIC_RESTRICTED",
        );
      }
    }
  }
}

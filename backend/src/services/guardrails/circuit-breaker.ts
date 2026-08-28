import { redis } from "../cache/redis.service.js";
import { ProviderError } from "../../utils/errors.js";
import { logger } from "../../utils/logger.js";

export class CircuitBreaker {
  private failureThreshold: number;
  private cooldownSeconds: number;

  constructor(failureThreshold = 5, cooldownSeconds = 60) {
    this.failureThreshold = failureThreshold;
    this.cooldownSeconds = cooldownSeconds;
  }

  async checkState(providerName: string): Promise<void> {
    const key = `circuit:${providerName}:state`;
    const state = await redis.get(key);

    if (state === "OPEN") {
      logger.warn({ providerName }, "Circuit breaker is OPEN");
      throw new ProviderError(
        `${providerName} is temporarily experiencing upstream service interruptions. Please try again shortly.`,
        503,
        "SERVICE_UNAVAILABLE",
      );
    }
  }

  async recordFailure(providerName: string): Promise<void> {
    const failKey = `circuit:${providerName}:failures`;
    const stateKey = `circuit:${providerName}:state`;

    const count = await redis.incr(failKey);
    if (count === 1) {
      await redis.expire(failKey, this.cooldownSeconds);
    }

    if (count >= this.failureThreshold) {
      await redis.set(stateKey, "OPEN", "EX", this.cooldownSeconds);
      logger.error(
        { providerName, failures: count },
        "Circuit breaker tripped to OPEN state",
      );
    }
  }

  async recordSuccess(providerName: string): Promise<void> {
    const failKey = `circuit:${providerName}:failures`;
    const stateKey = `circuit:${providerName}:state`;
    await Promise.all([redis.del(failKey), redis.del(stateKey)]);
  }
}

export const circuitBreaker = new CircuitBreaker();

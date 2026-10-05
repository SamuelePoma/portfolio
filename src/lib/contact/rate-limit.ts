import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import type { RateLimiter, RateLimitResult } from "./ports";

/** Both windows apply: 3 messages per 10 minutes and 10 per day, per visitor. */
export const RATE_LIMITS = [
  { name: "10m", requests: 3, window: "10 m", windowMs: 10 * 60 * 1000 },
  { name: "1d", requests: 10, window: "1 d", windowMs: 24 * 60 * 60 * 1000 },
] as const;

/** A request passes only if every window lets it through; it may retry once all have reset. */
export function combineLimits(results: readonly RateLimitResult[]): RateLimitResult {
  const blocked = results.filter((result) => !result.success);
  const relevant = blocked.length > 0 ? blocked : results;
  return {
    success: blocked.length === 0,
    reset: Math.max(0, ...relevant.map((result) => result.reset)),
  };
}

interface UpstashConfig {
  url: string;
  token: string;
}

/**
 * Sliding windows in Upstash Redis (EU region). Keys are already salted hashes, never
 * raw IPs, and expire with their window. If Redis can't be reached within the
 * library's timeout, requests are let through rather than blocking real visitors.
 */
export function createUpstashRateLimiter({ url, token }: UpstashConfig): RateLimiter {
  const redis = new Redis({ url, token });
  const limiters = RATE_LIMITS.map(
    ({ name, requests, window }) =>
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(requests, window),
        prefix: `contact:${name}`,
        analytics: false,
      }),
  );

  return {
    async limit(key) {
      const results = await Promise.all(limiters.map((limiter) => limiter.limit(key)));
      return combineLimits(results);
    },
  };
}

/**
 * The same windows kept in memory, for local development without Upstash. State lives
 * in one server process only, so it is never used in production.
 */
export function createMemoryRateLimiter(now: () => number = Date.now): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    limit(key) {
      const time = now();
      const results = RATE_LIMITS.map(({ name, requests, windowMs }) => {
        const bucket = `${name}:${key}`;
        const recent = (hits.get(bucket) ?? []).filter((hit) => hit > time - windowMs);
        const oldest = recent[0];
        if (recent.length >= requests && oldest !== undefined) {
          hits.set(bucket, recent);
          return { success: false, reset: oldest + windowMs };
        }
        recent.push(time);
        hits.set(bucket, recent);
        return { success: true, reset: time + windowMs };
      });
      return Promise.resolve(combineLimits(results));
    },
  };
}

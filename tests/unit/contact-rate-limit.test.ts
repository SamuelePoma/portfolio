const { ratelimitInstances, slidingWindow } = vi.hoisted(() => ({
  ratelimitInstances: [] as { prefix: string; limit: ReturnType<typeof vi.fn> }[],
  slidingWindow: vi.fn((requests: number, window: string) => ({ requests, window })),
}));

vi.mock("@upstash/redis", () => ({
  Redis: vi.fn(function Redis(this: object, config: unknown) {
    Object.assign(this, { config });
  }),
}));

vi.mock("@upstash/ratelimit", () => {
  const Ratelimit = vi.fn(function Ratelimit(this: object, options: { prefix: string }) {
    const instance = { prefix: options.prefix, limit: vi.fn() };
    ratelimitInstances.push(instance);
    Object.assign(this, instance);
  });
  Object.assign(Ratelimit, { slidingWindow });
  return { Ratelimit };
});

import { Redis } from "@upstash/redis";

import {
  combineLimits,
  createMemoryRateLimiter,
  createUpstashRateLimiter,
  RATE_LIMITS,
} from "@/lib/contact/rate-limit";

describe("combineLimits", () => {
  it("passes when every window passes, resetting when the last one does", () => {
    expect(
      combineLimits([
        { success: true, reset: 100 },
        { success: true, reset: 300 },
      ]),
    ).toEqual({ success: true, reset: 300 });
  });

  it("blocks when any window blocks, until every blocking window resets", () => {
    expect(
      combineLimits([
        { success: false, reset: 200 },
        { success: true, reset: 900 },
        { success: false, reset: 500 },
      ]),
    ).toEqual({ success: false, reset: 500 });
  });
});

describe("createMemoryRateLimiter", () => {
  it("allows three messages per ten minutes, then blocks until the oldest expires", async () => {
    let time = 1_000_000;
    const limiter = createMemoryRateLimiter(() => time);

    for (let i = 0; i < 3; i++) {
      expect((await limiter.limit("visitor")).success).toBe(true);
      time += 1000;
    }
    const blocked = await limiter.limit("visitor");
    expect(blocked).toEqual({ success: false, reset: 1_000_000 + 10 * 60 * 1000 });

    time = 1_000_000 + 10 * 60 * 1000 + 1;
    expect((await limiter.limit("visitor")).success).toBe(true);
  });

  it("allows ten messages per day", async () => {
    let time = 0;
    const limiter = createMemoryRateLimiter(() => time);
    for (let i = 0; i < 10; i++) {
      expect((await limiter.limit("visitor")).success).toBe(true);
      time += 11 * 60 * 1000; // past the 10-minute window each time
    }
    const blocked = await limiter.limit("visitor");
    expect(blocked.success).toBe(false);
    expect(blocked.reset).toBe(24 * 60 * 60 * 1000);
  });

  it("keeps visitors apart", async () => {
    const limiter = createMemoryRateLimiter(() => 0);
    for (let i = 0; i < 3; i++) await limiter.limit("first");
    expect((await limiter.limit("first")).success).toBe(false);
    expect((await limiter.limit("second")).success).toBe(true);
  });

  it("uses the real clock by default", async () => {
    const before = Date.now();
    const result = await createMemoryRateLimiter().limit("visitor");
    expect(result.reset).toBeGreaterThanOrEqual(before + 10 * 60 * 1000);
  });
});

describe("createUpstashRateLimiter", () => {
  it("creates one sliding window per limit on a shared Redis client", () => {
    ratelimitInstances.length = 0;
    createUpstashRateLimiter({ url: "https://eu1.upstash.io", token: "token" });

    expect(Redis).toHaveBeenCalledWith({ url: "https://eu1.upstash.io", token: "token" });
    for (const { requests, window } of RATE_LIMITS) {
      expect(slidingWindow).toHaveBeenCalledWith(requests, window);
    }
    expect(ratelimitInstances.map((instance) => instance.prefix)).toEqual([
      "contact:10m",
      "contact:1d",
    ]);
  });

  it("checks the key against every window and combines the answers", async () => {
    ratelimitInstances.length = 0;
    const limiter = createUpstashRateLimiter({ url: "https://eu1.upstash.io", token: "token" });
    const [short, long] = ratelimitInstances;
    short?.limit.mockResolvedValue({ success: true, reset: 100 });
    long?.limit.mockResolvedValue({ success: false, reset: 900 });

    await expect(limiter.limit("hash")).resolves.toEqual({ success: false, reset: 900 });
    expect(short?.limit).toHaveBeenCalledWith("hash");
    expect(long?.limit).toHaveBeenCalledWith("hash");
  });
});

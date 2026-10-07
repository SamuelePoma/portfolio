afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("publicEnv", () => {
  it("reads NEXT_PUBLIC_* variables from process.env", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://samuelepoma.com");
    const { publicEnv } = await import("@/lib/env/public");
    expect(publicEnv.NEXT_PUBLIC_SITE_URL).toBe("https://samuelepoma.com");
  });
});

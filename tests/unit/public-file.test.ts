const existsSync = vi.hoisted(() => vi.fn<(path: string) => boolean>());
vi.mock("node:fs", () => ({ existsSync, default: { existsSync } }));

import { publicFileExists } from "@/lib/public-file";

describe("publicFileExists", () => {
  afterEach(() => {
    existsSync.mockReset();
  });

  it("resolves the path inside public/", () => {
    existsSync.mockReturnValue(true);
    expect(publicFileExists("/cv/samuele-poma-cv.pdf")).toBe(true);
    expect(existsSync.mock.calls[0]?.[0]).toMatch(/public[\\/]cv[\\/]samuele-poma-cv\.pdf$/);
  });

  it("reports missing files", () => {
    existsSync.mockReturnValue(false);
    expect(publicFileExists("/cv/samuele-poma-cv.pdf")).toBe(false);
  });

  it("refuses paths that climb out of public/", () => {
    existsSync.mockReturnValue(true);
    expect(publicFileExists("/../package.json")).toBe(false);
    expect(publicFileExists("cv/../../.env")).toBe(false);
    expect(existsSync).not.toHaveBeenCalled();
  });
});

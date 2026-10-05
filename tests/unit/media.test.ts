import { getMediaSlot, mediaRatios, mediaSlots } from "@/content/media";

describe("media slots", () => {
  it("have unique ids and unique file names", () => {
    const ids = mediaSlots.map((slot) => slot.id);
    const files = mediaSlots.map((slot) => slot.file);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(files).size).toBe(files.length);
  });

  it.each(mediaSlots)("$id is well formed", (slot) => {
    expect(slot.id).toMatch(/^IMG-[A-Z0-9-]+$/);
    expect(slot.file).toMatch(/^[a-z0-9-]+\.(webp|avif)$/);
    expect(mediaRatios).toContain(slot.ratio);
    expect(slot.alt.trim().length).toBeGreaterThan(0);
    expect(slot.placeholder.trim().length).toBeGreaterThan(0);
  });

  it("never uses em or en dashes in visible text", () => {
    for (const slot of mediaSlots) {
      const caption = "caption" in slot ? slot.caption : "";
      expect(`${slot.alt} ${slot.placeholder} ${caption}`).not.toMatch(/[\u2013\u2014]/);
    }
  });

  it("looks a slot up by id", () => {
    expect(getMediaSlot("IMG-STEDIN-01").file).toBe("stedin-01.webp");
  });

  it("throws on an unknown id", () => {
    // @ts-expect-error: runtime guard for ids that bypass the type system
    expect(() => getMediaSlot("IMG-NOPE")).toThrow(/Unknown media slot/);
  });
});

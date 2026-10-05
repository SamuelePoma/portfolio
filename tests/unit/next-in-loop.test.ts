import { nextInLoop } from "@/lib/work/next-in-loop";

describe("nextInLoop", () => {
  const items = ["a", "b", "c"] as const;

  it("returns the following item", () => {
    expect(nextInLoop(items, 0)).toBe("b");
    expect(nextInLoop(items, 1)).toBe("c");
  });

  it("wraps from the last item to the first", () => {
    expect(nextInLoop(items, 2)).toBe("a");
  });

  it("returns the only item of a one-item list", () => {
    expect(nextInLoop(["solo"], 0)).toBe("solo");
  });

  it.each([-1, 3, 1.5, Number.NaN])("throws for index %s", (index) => {
    expect(() => nextInLoop(items, index)).toThrow(RangeError);
  });

  it("throws for an empty list", () => {
    expect(() => nextInLoop([], 0)).toThrow(RangeError);
  });
});

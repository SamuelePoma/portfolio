import { cn } from "@/lib/utils/cn";
import { isExternalHref } from "@/lib/utils/is-external-href";

describe("cn", () => {
  it("joins truthy class names and skips falsy ones", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("returns an empty string when nothing is truthy", () => {
    expect(cn(false, undefined)).toBe("");
  });
});

describe("isExternalHref", () => {
  it.each([
    ["https://github.com/SamuelePoma", true],
    ["http://example.com", true],
    ["//cdn.example.com/x.js", true],
    ["HTTPS://EXAMPLE.COM", true],
    ["/work/musetrail", false],
    ["#contact", false],
    ["mailto:hello@example.com", false],
    ["/cv/samuele-poma-cv.pdf", false],
  ])("%s → %s", (href, expected) => {
    expect(isExternalHref(href)).toBe(expected);
  });
});

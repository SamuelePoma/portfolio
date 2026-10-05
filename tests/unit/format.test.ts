import { formatPeriod, formatPeriodLong } from "@/lib/format/period";
import { projectMeta } from "@/lib/format/project-meta";

describe("formatPeriod", () => {
  it.each([
    [{ start: "2024-09", end: "2025-01" }, "2024-25"],
    [{ start: "2020", end: "2022" }, "2020-22"],
    [{ start: "2024-11", end: "2024-12" }, "2024"],
    [{ start: "2026-09" }, "Since 2026"],
    [{ start: "1999", end: "2001" }, "1999-2001"],
  ])("%o → %s", (period, expected) => {
    expect(formatPeriod(period)).toBe(expected);
  });

  it("never produces em or en dashes", () => {
    expect(formatPeriod({ start: "2023", end: "2027" })).not.toMatch(/[\u2013\u2014]/);
  });
});

describe("formatPeriodLong", () => {
  it.each([
    [{ start: "2024-11", end: "2025-01" }, "Nov 2024 to Jan 2025"],
    [{ start: "2026-06", end: "2026-06" }, "Jun 2026"],
    [{ start: "2026-09" }, "Since Sep 2026"],
    [{ start: "2020", end: "2022" }, "2020 to 2022"],
    [{ start: "2023" }, "Since 2023"],
  ])("%o → %s", (period, expected) => {
    expect(formatPeriodLong(period)).toBe(expected);
  });

  it("never produces em or en dashes", () => {
    expect(formatPeriodLong({ start: "2024-09", end: "2025-01" })).not.toMatch(/[\u2013\u2014]/);
  });
});

describe("projectMeta", () => {
  it("shows the organisation and the period", () => {
    expect(
      projectMeta({
        organisation: "Conneqtech",
        category: "Internship",
        period: { start: "2024-09", end: "2025-01" },
      }),
    ).toBe("Conneqtech · 2024-25");
  });

  it("falls back to the category when there is no period", () => {
    expect(projectMeta({ organisation: "Stedin", category: "University project" })).toBe(
      "Stedin · University project",
    );
  });

  it("uses the category first when there is no organisation", () => {
    expect(projectMeta({ category: "Java", period: { start: "2024-12", end: "2025-01" } })).toBe(
      "Java · 2024-25",
    );
  });

  it("shows the category alone when nothing else is known", () => {
    expect(projectMeta({ category: "Team project" })).toBe("Team project");
  });

  it("uses at most one middle dot", () => {
    const meta = projectMeta({
      organisation: "Progmatic",
      category: "Research",
      period: { start: "2026-09" },
    });
    expect(meta.split("·")).toHaveLength(2);
  });
});

// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";

import { ProjectCard, type ProjectCardProps } from "@/components/home/ProjectCard";

const base: ProjectCardProps = {
  slug: "progmatic-ai-knowledge-assistant",
  title: "AI knowledge assistant",
  organisation: "Progmatic",
  category: "Research",
  period: { start: "2026-09" },
  status: "in-progress",
  tagline: "Researching an internal assistant.",
  stack: ["AI", "FileMaker"],
  card: { type: "diagram", name: "research-map" },
};

describe("ProjectCard", () => {
  it("links the title to the case study with a short accessible name", () => {
    render(<ProjectCard {...base} />);
    expect(screen.getByRole("link", { name: "AI knowledge assistant" })).toHaveAttribute(
      "href",
      "/work/progmatic-ai-knowledge-assistant",
    );
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("shows the metadata line and the in-progress status", () => {
    render(<ProjectCard {...base} />);
    expect(screen.getByText("Progmatic · Since 2026")).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
  });

  it("omits the status for completed projects", () => {
    render(
      <ProjectCard {...base} status="completed" period={{ start: "2024-09", end: "2025-01" }} />,
    );
    expect(screen.queryByText("In progress")).not.toBeInTheDocument();
  });

  it("lists the stack as tags", () => {
    render(<ProjectCard {...base} />);
    const list = screen.getByRole("list");
    expect(
      within(list)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["AI", "FileMaker"]);
  });

  it("describes the diagram for screen readers", () => {
    render(<ProjectCard {...base} />);
    expect(
      screen.getByRole("img", { name: /Research areas of the knowledge assistant/ }),
    ).toBeInTheDocument();
  });
});

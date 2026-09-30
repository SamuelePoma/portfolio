// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";

import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders a <button type=button> when there is no href", () => {
    render(<Button>Send message</Button>);
    expect(screen.getByRole("button", { name: "Send message" })).toHaveAttribute("type", "button");
  });

  it("keeps an explicit submit type", () => {
    render(<Button type="submit">Send message</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("opens external links in a new tab safely and says so to screen readers", () => {
    render(
      <Button href="https://github.com/SamuelePoma" icon="arrow-up-right">
        GitHub
      </Button>,
    );
    const link = screen.getByRole("link", { name: "GitHub (opens in new tab)" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders internal routes and file links in the same tab", () => {
    render(
      <>
        <Button href="/work/musetrail">Case study</Button>
        <Button href="/cv/samuele-poma-cv.pdf">Résumé (PDF)</Button>
      </>,
    );
    expect(screen.getByRole("link", { name: "Case study" })).not.toHaveAttribute("target");
    expect(screen.getByRole("link", { name: "Résumé (PDF)" })).toHaveAttribute(
      "href",
      "/cv/samuele-poma-cv.pdf",
    );
  });

  it("hides the decorative icon from assistive technology", () => {
    const { container } = render(<Button icon="arrow-right">Next</Button>);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});

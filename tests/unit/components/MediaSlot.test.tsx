// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";

const existsSync = vi.hoisted(() => vi.fn<(path: string) => boolean>());
vi.mock("node:fs", () => ({ existsSync, default: { existsSync } }));

import { MediaSlot } from "@/components/ui/MediaSlot";

describe("MediaSlot", () => {
  afterEach(() => {
    existsSync.mockReset();
  });

  it("renders a labelled placeholder when the file is missing", () => {
    existsSync.mockReturnValue(false);
    render(<MediaSlot id="IMG-PORTRAIT" sizes="100vw" />);

    const placeholder = screen.getByRole("img", {
      name: "Image coming soon: Portrait, neutral background",
    });
    expect(placeholder).toHaveTextContent("IMG-PORTRAIT · 4:5");
  });

  it.each([
    ["IMG-CONNEQTECH-01", /^Illustration: a route tracked across a city map/],
    ["IMG-DND-01", /^Illustration: the six ability scores of a character sheet/],
  ] as const)("draws a stand-in for %s while its file is missing", (id, name) => {
    existsSync.mockReturnValue(false);
    render(<MediaSlot id={id} sizes="100vw" />);
    expect(screen.getByRole("img", { name })).toBeInTheDocument();
    expect(screen.queryByText(id, { exact: false })).not.toBeInTheDocument();
  });

  it("renders the image with its alt text when the file exists", () => {
    existsSync.mockReturnValue(true);
    render(<MediaSlot id="IMG-CONNEQTECH-01" sizes="100vw" />);

    const image = screen.getByRole("img", {
      name: "GPS monitoring dashboard with a map of tracked vehicles",
    });
    expect(image.tagName).toBe("IMG");
    expect(image.getAttribute("src")).toContain("conneqtech-01.webp");
  });

  it("looks for the file inside public/images", () => {
    existsSync.mockReturnValue(false);
    render(<MediaSlot id="IMG-PORTRAIT" sizes="100vw" />);
    expect(existsSync.mock.calls[0]?.[0]).toMatch(/public[\\/]images[\\/]portrait\.webp$/);
  });
});

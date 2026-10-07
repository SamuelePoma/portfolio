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

  it("draws a stand-in for a slot that has one while its file is missing", () => {
    existsSync.mockReturnValue(false);
    render(<MediaSlot id="IMG-DND-01" sizes="100vw" />);
    expect(
      screen.getByRole("img", {
        name: /^Illustration: the six ability scores of a character sheet/,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText("IMG-DND-01", { exact: false })).not.toBeInTheDocument();
  });

  it("renders the image with its alt text when the file exists", () => {
    existsSync.mockReturnValue(true);
    render(<MediaSlot id="IMG-CONNEQTECH-01" sizes="100vw" />);

    const image = screen.getByRole("img", {
      name: /^Design of the fleet health dashboard/,
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

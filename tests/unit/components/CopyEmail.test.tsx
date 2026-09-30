// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { CopyEmail } from "@/components/contact/CopyEmail";

const showToast = vi.hoisted(() => vi.fn());
vi.mock("@/components/ui/toast", () => ({ showToast }));

const EMAIL = "hello@example.com";

function setClipboard(writeText?: (text: string) => Promise<void>) {
  if (writeText) {
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  } else {
    Reflect.deleteProperty(navigator, "clipboard");
  }
}

describe("CopyEmail", () => {
  afterEach(() => {
    setClipboard();
    showToast.mockReset();
  });

  it("is a mailto link that says it copies", () => {
    render(<CopyEmail email={EMAIL} />);
    const link = screen.getByRole("link", { name: `${EMAIL} (copy to clipboard)` });
    expect(link).toHaveAttribute("href", `mailto:${EMAIL}`);
  });

  it("copies the address and confirms with a toast", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    render(<CopyEmail email={EMAIL} />);

    const notPrevented = fireEvent.click(screen.getByRole("link"));

    expect(notPrevented).toBe(false);
    expect(writeText).toHaveBeenCalledWith(EMAIL);
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith("Email copied");
    });
  });

  it("falls back to the mailto link when the clipboard API is missing", () => {
    setClipboard();
    render(<CopyEmail email={EMAIL} />);

    const notPrevented = fireEvent.click(screen.getByRole("link"));

    expect(notPrevented).toBe(true);
    expect(showToast).not.toHaveBeenCalled();
  });
});

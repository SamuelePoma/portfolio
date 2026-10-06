// @vitest-environment jsdom
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ContactForm } from "@/components/contact/ContactForm";
import type { TurnstileRenderOptions } from "@/components/contact/Turnstile";

const EMAIL = "hello@example.com";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
  await user.type(screen.getByLabelText("Email"), "ada@example.com");
  await user.type(screen.getByLabelText("Message"), "I'd like to talk about a project.");
}

describe("ContactForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts (never GETs) so a message can't end up in a URL, even without JavaScript", () => {
    render(<ContactForm email={EMAIL} />);
    const form = screen.getByRole("form", { name: "Contact form" });
    expect(form).toHaveAttribute("method", "post");
    expect(form).toHaveAttribute("action", "/api/contact");
  });

  it("labels every field and explains how the message is used", () => {
    render(<ContactForm email={EMAIL} />);
    expect(screen.getByLabelText("Name")).toHaveAttribute("autocomplete", "name");
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Message")).toHaveAttribute("maxlength", "2000");
    expect(screen.getByRole("link", { name: "privacy policy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
  });

  it("shows an error per field on an empty submit and focuses the first one", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm email={EMAIL} />);

    await user.click(screen.getByRole("button", { name: "Send message" }));

    // The rules load on first use, so the messages arrive a moment after the click.
    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your email address.")).toBeInTheDocument();
    expect(screen.getByText("Please write a message.")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveFocus();
    expect(screen.getByLabelText("Name")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Name")).toHaveAccessibleDescription("Please enter your name.");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("validates on blur, not while typing, and clears the error once fixed", async () => {
    const user = userEvent.setup();
    render(<ContactForm email={EMAIL} />);
    const email = screen.getByLabelText("Email");

    await user.type(email, "ada@");
    expect(screen.queryByText(/valid email address/)).not.toBeInTheDocument();

    await user.tab();
    expect(await screen.findByText(/valid email address/)).toBeInTheDocument();

    await user.type(email, "example.com");
    await waitFor(() => {
      expect(screen.queryByText(/valid email address/)).not.toBeInTheDocument();
    });
  });

  it("does not flag an untouched empty field on blur", async () => {
    const user = userEvent.setup();
    render(<ContactForm email={EMAIL} />);

    await user.click(screen.getByLabelText("Name"));
    await user.tab();

    expect(screen.queryByText("Please enter your name.")).not.toBeInTheDocument();
  });

  it("counts message characters", async () => {
    const user = userEvent.setup();
    render(<ContactForm email={EMAIL} />);

    await user.type(screen.getByLabelText("Message"), "Hello");

    expect(screen.getByText(/5 \/ 2000/)).toBeInTheDocument();
  });

  it("sends trimmed values as JSON and confirms success", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm email={EMAIL} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));

    const heading = await screen.findByRole("heading", { name: "Message sent." });
    await waitFor(() => {
      expect(heading).toHaveFocus();
    });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/contact");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(init.body as string)).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "I'd like to talk about a project.",
      turnstileToken: "",
      company: "",
      elapsedMs: expect.any(Number) as number,
    });

    await user.click(screen.getByRole("button", { name: "Send another message" }));
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("shows an alert with the email alternative when sending fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ ok: false }, 500)));
    render(<ContactForm email={EMAIL} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("couldn't be sent");
    expect(screen.getByRole("link", { name: EMAIL })).toHaveAttribute("href", `mailto:${EMAIL}`);
    expect(screen.getByLabelText("Message")).toHaveValue("I'd like to talk about a project.");
  });

  it("treats a network error as a failure", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    render(<ContactForm email={EMAIL} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it.each([
    ["rate_limited", 429, "several messages in a short time"],
    ["captcha_failed", 400, "spam check didn't go through"],
    ["invalid_input", 400, "couldn't be sent"],
  ])("explains a %s answer and offers email", async (error, status, text) => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ ok: false, error }, status)));
    render(<ContactForm email={EMAIL} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(text);
    expect(alert).toHaveTextContent(EMAIL);
  });

  it("hides the honeypot from people and keyboards", () => {
    const { container } = render(<ContactForm email={EMAIL} />);
    const honeypot = container.querySelector<HTMLInputElement>('input[name="company"]');
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot?.closest("[aria-hidden]")).not.toBeNull();
    expect(screen.queryByRole("textbox", { name: "Company" })).not.toBeInTheDocument();
  });

  it("disables the button while sending", async () => {
    const user = userEvent.setup();
    let resolveFetch: (value: Response) => void = () => undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            resolveFetch = resolve;
          }),
      ),
    );
    render(<ContactForm email={EMAIL} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(screen.getByRole("button", { name: /Sending/ })).toBeDisabled();
    resolveFetch(jsonResponse({ ok: true }));
    expect(await screen.findByRole("heading", { name: "Message sent." })).toBeInTheDocument();
  });
});

describe("ContactForm with Turnstile", () => {
  let callbacks: { callback: (token: string) => void; expired: () => void } | undefined;
  const reset = vi.fn();
  const remove = vi.fn();
  const renderWidget = vi.fn((_container: HTMLElement, options: TurnstileRenderOptions) => {
    callbacks = { callback: options.callback, expired: options["expired-callback"] };
    return "widget-1";
  });

  beforeEach(() => {
    callbacks = undefined;
    renderWidget.mockClear();
    window.turnstile = { render: renderWidget, reset, remove };
  });

  afterEach(() => {
    delete window.turnstile;
    vi.unstubAllGlobals();
    reset.mockClear();
    remove.mockClear();
  });

  it("renders a compact, dark widget with the site key", async () => {
    render(<ContactForm email={EMAIL} turnstileSiteKey="site-key" />);
    await waitFor(() => {
      expect(renderWidget).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({ sitekey: "site-key", theme: "dark", size: "compact" }),
      );
    });
  });

  it("waits for the check before sending, then sends its token once", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ ok: false, error: "server_error" }, 500));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm email={EMAIL} turnstileSiteKey="site-key" />);
    await waitFor(() => {
      expect(callbacks).toBeDefined();
    });

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(await screen.findByText(/spam check is still running/)).toBeInTheDocument();

    act(() => {
      callbacks?.callback("token-1");
    });
    expect(screen.queryByText(/spam check is still running/)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Send message" }));

    await screen.findByRole("alert");
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toMatchObject({ turnstileToken: "token-1" });
    // Tokens are single use: the widget asks for a new one after every attempt.
    expect(reset).toHaveBeenCalledWith("widget-1");
  });

  it("forgets an expired token", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm email={EMAIL} turnstileSiteKey="site-key" />);
    await waitFor(() => {
      expect(callbacks).toBeDefined();
    });

    act(() => {
      callbacks?.callback("token-1");
      callbacks?.expired();
    });
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("removes the widget when the form goes away", async () => {
    const { unmount } = render(<ContactForm email={EMAIL} turnstileSiteKey="site-key" />);
    await waitFor(() => {
      expect(callbacks).toBeDefined();
    });
    unmount();
    expect(remove).toHaveBeenCalledWith("widget-1");
  });
});

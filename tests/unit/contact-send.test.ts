const send = vi.fn();

vi.mock("resend", () => ({
  Resend: vi.fn(function Resend(this: object, apiKey: string) {
    Object.assign(this, { apiKey, emails: { send } });
  }),
}));

import { Resend } from "resend";

import { consoleLogger } from "@/lib/contact/ports";
import {
  createConsoleMailer,
  createResendMailer,
  formatContactEmail,
  MailerError,
} from "@/lib/contact/send";

const message = { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there." };

describe("formatContactEmail", () => {
  it("puts the sender in the subject and signs the plain-text body", () => {
    expect(formatContactEmail(message)).toEqual({
      subject: "Portfolio contact from Ada Lovelace",
      text: "Hello there.\n\nFrom: Ada Lovelace <ada@example.com>\nSent with the contact form on the portfolio.",
    });
  });

  it("never contains em or en dashes", () => {
    const { subject, text } = formatContactEmail(message);
    expect(`${subject} ${text}`).not.toMatch(/[\u2013\u2014]/);
  });
});

describe("createResendMailer", () => {
  beforeEach(() => {
    send.mockReset();
  });

  it("sends plain text to Samuele, with the visitor as reply-to and an idempotency key", async () => {
    send.mockResolvedValue({ data: { id: "email_1" }, error: null });
    const mailer = createResendMailer({
      apiKey: "re_123",
      from: "noreply@samuelepoma.com",
      to: "contact@samuelepoma.com",
    });

    await mailer.send(message, "contact-key");

    expect(Resend).toHaveBeenCalledWith("re_123");
    expect(send).toHaveBeenCalledWith(
      {
        from: "noreply@samuelepoma.com",
        to: "contact@samuelepoma.com",
        replyTo: "ada@example.com",
        subject: "Portfolio contact from Ada Lovelace",
        text: formatContactEmail(message).text,
      },
      { idempotencyKey: "contact-key" },
    );
  });

  it("throws a MailerError carrying only the provider's error name", async () => {
    send.mockResolvedValue({
      data: null,
      error: { name: "validation_error", message: "Invalid `from` field", statusCode: 422 },
    });
    const mailer = createResendMailer({ apiKey: "re_123", from: "a@b.c", to: "d@e.f" });

    const failure = mailer.send(message, "key");
    await expect(failure).rejects.toBeInstanceOf(MailerError);
    await expect(failure).rejects.toMatchObject({ name: "MailerError", code: "validation_error" });
  });
});

describe("createConsoleMailer", () => {
  it("prints the email instead of sending it", async () => {
    const write = vi.fn();
    await createConsoleMailer(write).send(message, "contact-key");
    expect(write).toHaveBeenCalledOnce();
    expect(write.mock.calls[0]?.[0]).toContain("Portfolio contact from Ada Lovelace");
    expect(write.mock.calls[0]?.[0]).toContain("contact-key");
  });

  it("writes to the console by default", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    await createConsoleMailer().send(message, "key");
    expect(info).toHaveBeenCalledOnce();
    info.mockRestore();
  });
});

describe("consoleLogger", () => {
  it.each([
    ["info", "info"],
    ["warn", "warn"],
    ["error", "error"],
  ] as const)("logs %s entries as one JSON line", (level, method) => {
    const spy = vi.spyOn(console, method).mockImplementation(() => undefined);
    consoleLogger({ level, event: "sent", requestId: "req-1", status: 200 });
    expect(JSON.parse(String(spy.mock.calls[0]?.[0]))).toEqual({
      scope: "contact",
      level,
      event: "sent",
      requestId: "req-1",
      status: 200,
    });
    spy.mockRestore();
  });
});

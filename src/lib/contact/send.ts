import { Resend } from "resend";

import type { ContactMessage, Mailer } from "./ports";

/** The email Samuele receives: plain text, the visitor as reply-to. */
export function formatContactEmail({ name, email, message }: ContactMessage): {
  subject: string;
  text: string;
} {
  return {
    subject: `Portfolio contact from ${name}`,
    text: `${message}\n\nFrom: ${name} <${email}>\nSent with the contact form on the portfolio.`,
  };
}

/** Thrown when the provider refuses a message. Carries the provider's error name only. */
export class MailerError extends Error {
  constructor(readonly code: string) {
    super(`Email provider error: ${code}`);
    this.name = "MailerError";
  }
}

interface ResendConfig {
  apiKey: string;
  from: string;
  to: string;
}

/** Sends through Resend. The idempotency key makes a retried request a no-op. */
export function createResendMailer({ apiKey, from, to }: ResendConfig): Mailer {
  const resend = new Resend(apiKey);

  return {
    async send(message, idempotencyKey) {
      const { subject, text } = formatContactEmail(message);
      const { error } = await resend.emails.send(
        { from, to, replyTo: message.email, subject, text },
        { idempotencyKey },
      );
      if (error) throw new MailerError(error.name);
    },
  };
}

/**
 * Development only: prints the email instead of sending it, so the form can be tried
 * without a Resend account.
 */
export function createConsoleMailer(write: (line: string) => void = console.info): Mailer {
  return {
    send(message, idempotencyKey) {
      const { subject, text } = formatContactEmail(message);
      write(
        `[contact] Email not sent (no RESEND_API_KEY). Key ${idempotencyKey}\n${subject}\n\n${text}`,
      );
      return Promise.resolve();
    },
  };
}

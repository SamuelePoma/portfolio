"use client";

import { CircleCheck, LoaderCircle, TriangleAlert } from "lucide-react";
import Link from "next/link";
import {
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
  type SubmitEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/Button";
import {
  type ContactErrorCode,
  type ContactFieldErrors,
  type ContactFieldName,
  contactFieldNames,
  EMAIL_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  validateContactField,
  validateContactFields,
} from "@/lib/contact/schema";

import { Turnstile, type TurnstileHandle } from "./Turnstile";

type Status = "idle" | "sending" | "sent" | "failed";
/** Why sending failed, as far as the visitor needs to know. */
type Failure = "rate_limited" | "captcha_failed" | "other";
type FieldElement = HTMLInputElement | HTMLTextAreaElement;

const inputClass =
  "w-full rounded-md bg-surface px-4 py-3 text-body text-ink ring-1 ring-hairline ring-inset transition-shadow duration-200 ease-out placeholder:text-ink-tertiary hover:ring-hairline-strong aria-invalid:ring-danger";

interface FieldProps {
  id: string;
  label: string;
  error: string | undefined;
  children: ReactNode;
  aside?: ReactNode;
}

function Field({ id, label, error, children, aside }: Readonly<FieldProps>) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-small font-medium text-ink">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-2 text-caption text-danger">
          <TriangleAlert aria-hidden size={14} strokeWidth={2} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

const failureText: Record<Failure, string> = {
  rate_limited: "You've sent several messages in a short time. Please try again later.",
  captcha_failed: "The spam check didn't go through. Please try again.",
  other: "Your message couldn't be sent. Please try again.",
};

function readField(form: HTMLFormElement, field: ContactFieldName | "company"): string {
  const value = new FormData(form).get(field);
  return typeof value === "string" ? value : "";
}

interface ContactFormProps {
  /** Offered as the alternative when sending fails. */
  email: string;
  /** Cloudflare Turnstile site key. Without one the widget isn't shown. */
  turnstileSiteKey?: string | undefined;
}

/** The API's answer: an error code to explain, or nothing when it doesn't say. */
async function readFailure(response: Response): Promise<ContactErrorCode | undefined> {
  const body = (await response.json().catch(() => null)) as {
    ok?: unknown;
    error?: unknown;
  } | null;
  if (response.ok && body?.ok === true) return undefined;
  return typeof body?.error === "string" ? (body.error as ContactErrorCode) : "server_error";
}

/**
 * Contact form (DESIGN.md §8.12). Validation runs on blur and on submit, never while
 * typing; once a field shows an error, it re-checks as the visitor fixes it so the
 * message disappears as soon as the value is valid.
 *
 * Inputs are uncontrolled: the value lives in the DOM, so text typed before React
 * hydrates is never wiped, and everything is read with FormData on submit.
 */
export function ContactForm({ email, turnstileSiteKey }: Readonly<ContactFormProps>) {
  const id = useId();
  const fieldId = (field: ContactFieldName) => `${id}-${field}`;
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<Failure>("other");
  const [captchaPending, setCaptchaPending] = useState(false);
  const captchaToken = useRef<string | undefined>(undefined);
  const turnstile = useRef<TurnstileHandle>(null);
  const [messageLength, setMessageLength] = useState(0);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Pick up anything typed before hydration.
    setMessageLength(messageRef.current?.value.length ?? 0);
  }, []);

  useEffect(() => {
    if (status === "sent") successHeadingRef.current?.focus();
  }, [status]);

  function handleChange(event: ChangeEvent<FieldElement>) {
    const field = event.target.name as ContactFieldName;
    const { value } = event.target;
    if (field === "message") setMessageLength(value.length);
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: validateContactField(field, value) }));
    }
  }

  function handleBlur(event: FocusEvent<FieldElement>) {
    const field = event.target.name as ContactFieldName;
    const { value } = event.target;
    // An untouched empty field is not an error yet; submitting will say so.
    if (value === "" && !errors[field]) return;
    setErrors((current) => ({ ...current, [field]: validateContactField(field, value) }));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const result = validateContactFields({
      name: readField(form, "name"),
      email: readField(form, "email"),
      message: readField(form, "message"),
    });
    if (!result.success) {
      setErrors(result.errors);
      const firstInvalid = contactFieldNames.find((field) => result.errors[field]);
      if (firstInvalid) document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    // The widget is still checking: sending now would only be refused.
    if (turnstileSiteKey !== undefined && captchaToken.current === undefined) {
      setCaptchaPending(true);
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          turnstileToken: captchaToken.current ?? "",
          company: readField(form, "company"),
          // Time since the page started loading, by the browser's own clock.
          elapsedMs: Math.round(performance.now()),
        }),
      });
      const error = await readFailure(response);
      if (error === undefined) {
        setErrors({});
        setMessageLength(0);
        setStatus("sent");
        return;
      }
      setFailure(error === "rate_limited" || error === "captcha_failed" ? error : "other");
      setStatus("failed");
    } catch {
      setFailure("other");
      setStatus("failed");
    } finally {
      // A token can be verified only once, whatever the outcome.
      turnstile.current?.reset();
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-lg bg-surface p-8 ring-1 ring-hairline ring-inset">
        <CircleCheck aria-hidden size={28} strokeWidth={1.75} className="text-accent" />
        <h3 ref={successHeadingRef} tabIndex={-1} className="text-h3 outline-hidden">
          Message sent.
        </h3>
        <p className="text-small text-ink-secondary">I&apos;ll get back to you soon.</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
          }}
          className="-ml-2 inline-flex h-11 items-center rounded-sm px-2 text-small font-medium text-ink underline decoration-hairline-strong underline-offset-4 hover:decoration-ink"
        >
          Send another message
        </button>
      </div>
    );
  }

  const describedBy = (field: ContactFieldName, extra?: string) =>
    [errors[field] ? `${fieldId(field)}-error` : undefined, extra].filter(Boolean).join(" ") ||
    undefined;

  const fieldProps = (field: ContactFieldName) => ({
    id: fieldId(field),
    name: field,
    required: true,
    onChange: handleChange,
    onBlur: handleBlur,
    "aria-invalid": errors[field] ? true : undefined,
  });

  return (
    <form
      // POST keeps the message out of the URL even if JavaScript never loads.
      method="post"
      action="/api/contact"
      noValidate
      onSubmit={(event) => {
        // preventDefault runs synchronously inside handleSubmit, before its first await.
        void handleSubmit(event);
      }}
      aria-label="Contact form"
      className="flex flex-col gap-6"
    >
      <noscript>
        <p className="rounded-md bg-surface p-4 text-small text-ink-secondary ring-1 ring-hairline ring-inset">
          This form needs JavaScript. You can email me instead at{" "}
          <a href={`mailto:${email}`} className="underline underline-offset-4">
            {email}
          </a>
          .
        </p>
      </noscript>

      <Field id={fieldId("name")} label="Name" error={errors.name}>
        <input
          {...fieldProps("name")}
          type="text"
          autoComplete="name"
          maxLength={NAME_MAX_LENGTH}
          aria-describedby={describedBy("name")}
          className={inputClass}
        />
      </Field>

      <Field id={fieldId("email")} label="Email" error={errors.email}>
        <input
          {...fieldProps("email")}
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          maxLength={EMAIL_MAX_LENGTH}
          aria-describedby={describedBy("email")}
          className={inputClass}
        />
      </Field>

      <Field
        id={fieldId("message")}
        label="Message"
        error={errors.message}
        aside={
          <span
            id={`${fieldId("message")}-count`}
            className="font-mono text-caption text-ink-secondary tabular"
          >
            {messageLength} / {MESSAGE_MAX_LENGTH}
            <span className="sr-only"> characters</span>
          </span>
        }
      >
        <textarea
          {...fieldProps("message")}
          ref={messageRef}
          rows={5}
          maxLength={MESSAGE_MAX_LENGTH}
          aria-describedby={describedBy("message", `${fieldId("message")}-count`)}
          className={`${inputClass} min-h-36 resize-y`}
        />
      </Field>

      {/* The honeypot: hidden from people and assistive tech, irresistible to form-filling bots. */}
      <div aria-hidden className="absolute -left-[10000px] size-px overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {turnstileSiteKey !== undefined && (
        <div className="flex flex-col gap-2">
          <Turnstile
            ref={turnstile}
            siteKey={turnstileSiteKey}
            onToken={(token) => {
              captchaToken.current = token;
              if (token !== undefined) setCaptchaPending(false);
            }}
          />
          <p aria-live="polite" className="text-caption text-ink-secondary">
            {captchaPending
              ? "One moment: the spam check is still running. Send again once it shows a tick."
              : ""}
          </p>
        </div>
      )}

      {status === "failed" && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-md bg-surface p-4 text-small text-ink ring-1 ring-danger ring-inset"
        >
          <TriangleAlert
            aria-hidden
            size={18}
            strokeWidth={1.75}
            className="mt-0.5 shrink-0 text-danger"
          />
          <p>
            {failureText[failure]} You can also email me directly at{" "}
            <a href={`mailto:${email}`} className="underline underline-offset-4">
              {email}
            </a>
            .
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div>
          <Button
            type="submit"
            disabled={status === "sending"}
            {...(status === "sending" ? {} : { icon: "arrow-right" as const })}
          >
            {status === "sending" ? (
              <>
                <LoaderCircle aria-hidden size={16} strokeWidth={2} className="animate-spin" />
                Sending…
              </>
            ) : (
              "Send message"
            )}
          </Button>
        </div>
        <p className="text-caption text-ink-secondary">
          Your message is only used to reply to you. See the{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-ink">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

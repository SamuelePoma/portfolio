import {
  contactErrorCodes,
  contactFieldNames,
  contactRequestSchema,
  MESSAGE_MAX_LENGTH,
  TURNSTILE_TOKEN_MAX_LENGTH,
  validateContactField,
  validateContactFields,
} from "@/lib/contact/schema";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I'd like to talk about a project.",
};

describe("validateContactFields", () => {
  it("accepts valid input and trims it", () => {
    const result = validateContactFields({
      name: "  Ada Lovelace ",
      email: " ada@example.com ",
      message: "  I'd like to talk about a project.  ",
    });
    expect(result).toEqual({ success: true, data: valid });
  });

  it("reports one friendly message per invalid field", () => {
    const result = validateContactFields({ name: "", email: "nope", message: "short" });
    expect(result).toEqual({
      success: false,
      errors: {
        name: "Please enter your name.",
        email: "Please enter a valid email address, like name@example.com.",
        message: "Please write at least 10 characters.",
      },
    });
  });

  it("treats whitespace-only input as empty", () => {
    const result = validateContactFields({ name: "   ", email: "  ", message: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toEqual({
        name: "Please enter your name.",
        email: "Please enter your email address.",
        message: "Please write a message.",
      });
    }
  });

  it("rejects messages over the maximum length", () => {
    const result = validateContactFields({ ...valid, message: "a".repeat(MESSAGE_MAX_LENGTH + 1) });
    expect(result.success).toBe(false);
  });

  it("rejects overlong names and emails", () => {
    expect(validateContactFields({ ...valid, name: "a".repeat(101) }).success).toBe(false);
    expect(
      validateContactFields({ ...valid, email: `${"a".repeat(250)}@example.com` }).success,
    ).toBe(false);
  });
});

describe("validateContactField", () => {
  it("returns undefined for a valid value", () => {
    expect(validateContactField("email", "ada@example.com")).toBeUndefined();
  });

  it("returns the first message for an invalid value", () => {
    expect(validateContactField("name", "A")).toBe("Your name needs at least 2 characters.");
  });
});

describe("contactFieldNames", () => {
  it("lists the fields in form order", () => {
    expect(contactFieldNames).toEqual(["name", "email", "message"]);
  });
});

describe("contactRequestSchema", () => {
  const request = { ...valid, turnstileToken: "token", company: "", elapsedMs: 8000 };

  it("accepts the fields plus the anti-spam signals", () => {
    expect(contactRequestSchema.parse(request)).toEqual(request);
  });

  it.each([
    ["a missing token", { turnstileToken: undefined }],
    ["an overlong token", { turnstileToken: "t".repeat(TURNSTILE_TOKEN_MAX_LENGTH + 1) }],
    ["a missing honeypot", { company: undefined }],
    ["a fractional time", { elapsedMs: 1.5 }],
    ["a negative time", { elapsedMs: -1 }],
    ["a time sent as text", { elapsedMs: "8000" }],
  ])("rejects %s", (_, override) => {
    expect(contactRequestSchema.safeParse({ ...request, ...override }).success).toBe(false);
  });

  it("lists the only error codes the API returns", () => {
    expect(contactErrorCodes).toEqual([
      "invalid_input",
      "rate_limited",
      "captcha_failed",
      "server_error",
    ]);
  });
});

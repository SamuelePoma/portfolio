import {
  countUrls,
  MAX_URLS_IN_MESSAGE,
  sanitizeContactFields,
  sanitizeLine,
  sanitizeMessage,
} from "@/lib/contact/sanitize";

const BELL = String.fromCharCode(7);
const NUL = String.fromCharCode(0);
const DEL = String.fromCharCode(0x7f);

describe("sanitizeLine", () => {
  it("removes every line break, so a value can't inject an email header", () => {
    expect(sanitizeLine("Ada\r\nBcc: victim@example.com")).toBe("Ada Bcc: victim@example.com");
    expect(sanitizeLine("Ada\rLovelace\nKing")).toBe("Ada Lovelace King");
  });

  it("strips control characters and collapses spaces", () => {
    expect(sanitizeLine(`  Ada${BELL}${NUL}   Lovelace${DEL} `)).toBe("Ada Lovelace");
  });

  it("normalises compatibility characters (NFKC)", () => {
    // Fullwidth letters and the "fi" ligature become their plain forms.
    expect(sanitizeLine("\uFF21da \uFB01ne")).toBe("Ada fine");
  });
});

describe("sanitizeMessage", () => {
  it("unifies line endings and keeps single newlines", () => {
    expect(sanitizeMessage("Hello\r\nworld\ragain")).toBe("Hello\nworld\nagain");
  });

  it("collapses runs of blank lines to one", () => {
    expect(sanitizeMessage("Hello\n\n\n\n\nworld")).toBe("Hello\n\nworld");
  });

  it("strips control characters but keeps newlines", () => {
    expect(sanitizeMessage(`Hi${BELL}\nthere${NUL}`)).toBe("Hi\nthere");
  });

  it("drops trailing spaces and tabs on each line, then trims", () => {
    expect(sanitizeMessage("  Hello \t\nworld  \n\n")).toBe("Hello\nworld");
  });
});

describe("countUrls", () => {
  it.each([
    ["no links here", 0],
    ["see https://example.com", 1],
    ["http://a.example and www.b.example", 2],
    ["HTTPS://SHOUT.EXAMPLE/path?x=1", 1],
    ["an email like ada@example.com is not a link", 0],
  ])("%s → %i", (text, expected) => {
    expect(countUrls(text)).toBe(expected);
  });
});

describe("sanitizeContactFields", () => {
  const fields = { name: "Ada", email: "ada@example.com", message: "Hello there, a project." };

  it("cleans every field", () => {
    expect(
      sanitizeContactFields({ ...fields, name: "Ada\n", message: "Hello\r\n\r\n\r\nthere." }),
    ).toEqual({ ok: true, fields: { ...fields, message: "Hello\n\nthere." } });
  });

  it("accepts up to the maximum number of links", () => {
    const message = Array.from(
      { length: MAX_URLS_IN_MESSAGE },
      (_, i) => `https://${String(i)}.example`,
    ).join(" ");
    expect(sanitizeContactFields({ ...fields, message }).ok).toBe(true);
  });

  it("rejects messages with more links than that", () => {
    const message = Array.from(
      { length: MAX_URLS_IN_MESSAGE + 1 },
      (_, i) => `https://${String(i)}.example`,
    ).join(" ");
    expect(sanitizeContactFields({ ...fields, message })).toEqual({
      ok: false,
      reason: "too_many_urls",
    });
  });
});

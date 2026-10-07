/**
 * The site's HTTP security headers and Content-Security-Policy (docs/adr/0003-csp-strategy.md).
 *
 * The policy comes in two parts, and browsers enforce both (a request must pass each):
 * - the **document policy**, a `<meta>` tag that `scripts/csp-hashes.mjs` writes into each
 *   prerendered page after the build. It is the whole policy: where scripts, styles,
 *   images, fonts and connections may come from, with the SHA-256 hash of every inline
 *   script Next.js put in that page. Pages stay static, and no script runs unless it
 *   comes from this origin or is one of those exact scripts;
 * - the **header** (`next.config.ts`, every response): what a `<meta>` tag can't say
 *   (`frame-ancestors`), plus restrictions that hold for every response anyway.
 *
 * Plain TypeScript with no imports, so `next.config.ts`, the post-build script (run by
 * Node with type stripping) and the unit tests all use the same code.
 */

/** Umami Cloud: the script and the endpoints it sends page views to. */
export const UMAMI_SCRIPT_ORIGIN = "https://cloud.umami.is";
const UMAMI_CONNECT = [UMAMI_SCRIPT_ORIGIN, "https://api-gateway.umami.dev"];

type Directives = Record<string, readonly string[]>;

function serialise(directives: Directives, extra: readonly string[] = []): string {
  return [
    ...Object.entries(directives).map(([name, sources]) => `${name} ${sources.join(" ")}`),
    ...extra,
  ].join("; ");
}

interface HeaderPolicyOptions {
  /** Deployed over HTTPS: ask browsers to upgrade any stray http:// request. */
  https: boolean;
}

/**
 * The header half of the policy: only directives that hold for every response and can
 * never get in the way of the document policy. `frame-ancestors` must be here, because
 * browsers ignore it in a `<meta>` tag.
 */
export function headerPolicy({ https }: HeaderPolicyOptions): string {
  return serialise(
    {
      "frame-ancestors": ["'none'"],
      "base-uri": ["'self'"],
      "form-action": ["'self'"],
      "object-src": ["'none'"],
    },
    https ? ["upgrade-insecure-requests"] : [],
  );
}

interface DocumentPolicyOptions {
  /** `sha256-…` sources for the page's inline scripts. */
  hashes: readonly string[];
  /** Umami is allowed only when a website id is configured. */
  analytics: boolean;
}

/**
 * The document half, written into each page as a `<meta>` tag: the whole policy for
 * what the page may load. Inline styles are allowed: React writes `style` attributes,
 * and styles can't run code. `data:` images are the CSS grain texture and the icons.
 */
export function documentPolicy({ hashes, analytics }: DocumentPolicyOptions): string {
  return serialise({
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      ...hashes.map((hash) => `'${hash}'`),
      ...(analytics ? [UMAMI_SCRIPT_ORIGIN] : []),
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:"],
    "font-src": ["'self'"],
    "connect-src": ["'self'", ...(analytics ? UMAMI_CONNECT : [])],
    "frame-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "object-src": ["'none'"],
  });
}

export interface Header {
  key: string;
  value: string;
}

/**
 * Every security header, on every route. `enforce: false` sends the policy as
 * Content-Security-Policy-Report-Only, to check a deployment for violations first.
 */
export function securityHeaders(options: HeaderPolicyOptions & { enforce: boolean }): Header[] {
  return [
    {
      key: options.enforce ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only",
      value: headerPolicy(options),
    },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value:
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()",
    },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  ];
}

/** JavaScript types a browser executes; anything else (JSON-LD, say) is a data block. */
const EXECUTABLE_TYPES = new Set(["", "text/javascript", "module"]);
const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/g;
const MARKER = 'data-csp="document"';

/** The bodies of the inline scripts a browser would run in a page, in order. */
export function inlineScripts(html: string): string[] {
  return [...html.matchAll(INLINE_SCRIPT)]
    .filter(([, attributes = ""]) => {
      const type = /\stype="([^"]*)"/.exec(attributes)?.[1] ?? "";
      return EXECUTABLE_TYPES.has(type.toLowerCase());
    })
    .map(([, , body = ""]) => body);
}

/**
 * Writes the document policy into a page as a `<meta>` tag, right after the charset so
 * it comes before every script. A page that already has one is returned unchanged, so
 * running the post-build step twice is harmless.
 */
export function withDocumentPolicy(html: string, policy: string): string {
  if (html.includes(MARKER)) return html;
  const meta = `<meta http-equiv="Content-Security-Policy" ${MARKER} content="${policy}"/>`;
  const charset = /<meta charSet="utf-8"\/>/i.exec(html);
  if (charset) {
    const end = charset.index + charset[0].length;
    return html.slice(0, end) + meta + html.slice(end);
  }
  if (!html.includes("<head>")) throw new Error("The page has no <head> for its policy");
  return html.replace("<head>", `<head>${meta}`);
}

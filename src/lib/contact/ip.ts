import { createHash } from "node:crypto";

/**
 * The visitor's IP, from the proxy headers Vercel sets. The first entry of
 * `x-forwarded-for` is the client; later ones are proxies. Falls back to "unknown",
 * so every request still gets a rate-limit key.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  return headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * A salted SHA-256 of the IP: enough to rate-limit a visitor, never enough to tell
 * who they are. Only this hash is stored, and only for the rate-limit window.
 */
export function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${ip}${salt}`).digest("hex");
}

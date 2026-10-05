import { getContactDeps } from "@/lib/contact/deps";
import { handleContactRequest } from "@/lib/contact/handler";
import { consoleLogger } from "@/lib/contact/ports";

/** The contact form endpoint: POST only, Node runtime. Other methods get a 405 from Next.js. */
export async function POST(request: Request): Promise<Response> {
  let deps;
  try {
    deps = getContactDeps();
  } catch {
    // A missing or invalid secret. Production builds check them up front (next.config.ts).
    consoleLogger({ level: "error", event: "config_error", requestId: "none", status: 500 });
    return Response.json(
      { ok: false, error: "server_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
  return handleContactRequest(request, deps);
}

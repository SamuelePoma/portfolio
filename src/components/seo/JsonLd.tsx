import { serializeJsonLd } from "@/lib/seo/jsonld";

/** One `<script type="application/ld+json">` per page (schema.org JSON-LD). */
export function JsonLd({ data }: Readonly<{ data: Record<string, unknown> }>) {
  return (
    <script
      type="application/ld+json"
      // The only innerHTML on the site: JSON-LD has to be raw, and serializeJsonLd
      // escapes "<" so the data can't close the script element.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

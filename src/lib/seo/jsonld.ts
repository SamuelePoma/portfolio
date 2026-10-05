import { absoluteUrl, SITE_NAME } from "./metadata";

/** Structured data (schema.org JSON-LD). Never a telephone number. */

type JsonLd = Record<string, unknown>;

interface PersonInput {
  siteUrl: string;
  role: string;
  github: string;
  linkedin: string;
  skills: readonly string[];
}

interface Crumb {
  name: string;
  path: string;
}

interface CaseStudyInput {
  siteUrl: string;
  slug: string;
  title: string;
  description: string;
  start?: string | undefined;
  stack: readonly string[];
  repo?: string | undefined;
}

const personId = (siteUrl: string) => absoluteUrl("/#person", siteUrl);

/** Samuele, referenced by `@id` from every other node. */
export function personJsonLd({ siteUrl, role, github, linkedin, skills }: PersonInput): JsonLd {
  return {
    "@type": "Person",
    "@id": personId(siteUrl),
    name: SITE_NAME,
    url: absoluteUrl("/", siteUrl),
    jobTitle: role,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Middelburg",
      addressCountry: "NL",
    },
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "HZ University of Applied Sciences",
      url: "https://hz.nl/en",
    },
    knowsAbout: [...skills],
    knowsLanguage: ["it", "en"],
    sameAs: [github, linkedin],
  };
}

export function breadcrumbJsonLd(crumbs: readonly Crumb[], siteUrl: string): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path, siteUrl),
    })),
  };
}

/** Home: the website and a profile page whose main entity is the person. */
export function homeJsonLd(person: PersonInput): JsonLd {
  const url = absoluteUrl("/", person.siteUrl);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${url}#website`, url, name: SITE_NAME, inLanguage: "en" },
      {
        "@type": "ProfilePage",
        "@id": `${url}#profile`,
        url,
        name: SITE_NAME,
        isPartOf: { "@id": `${url}#website` },
        mainEntity: { "@id": personId(person.siteUrl) },
      },
      personJsonLd(person),
    ],
  };
}

/**
 * A case study: `SoftwareSourceCode` when the code is public, otherwise
 * `CreativeWork`, authored by the person, plus its breadcrumbs.
 */
export function caseStudyJsonLd(project: CaseStudyInput): JsonLd {
  const path = `/work/${project.slug}`;
  const work: JsonLd = {
    "@type": project.repo ? "SoftwareSourceCode" : "CreativeWork",
    name: project.title,
    description: project.description,
    url: absoluteUrl(path, project.siteUrl),
    image: absoluteUrl(`${path}/opengraph-image`, project.siteUrl),
    author: { "@id": personId(project.siteUrl) },
    ...(project.start ? { dateCreated: project.start } : {}),
    ...(project.stack.length > 0 ? { keywords: project.stack.join(", ") } : {}),
    ...(project.repo ? { codeRepository: project.repo } : {}),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      work,
      breadcrumbJsonLd(
        [
          { name: "Home", path: "/" },
          { name: "Work", path: "/#work" },
          { name: project.title, path },
        ],
        project.siteUrl,
      ),
    ],
  };
}

/** A legal page's breadcrumbs. */
export function legalPageJsonLd(title: string, path: string, siteUrl: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbJsonLd(
        [
          { name: "Home", path: "/" },
          { name: title, path },
        ],
        siteUrl,
      ),
    ],
  };
}

/**
 * JSON for a `<script type="application/ld+json">`. Every `<` is escaped, so no string
 * in the data can close the script element early.
 */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replaceAll("<", "\\" + "u003c");
}

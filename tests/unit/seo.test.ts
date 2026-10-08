import {
  breadcrumbJsonLd,
  caseStudyJsonLd,
  homeJsonLd,
  legalPageJsonLd,
  serializeJsonLd,
} from "@/lib/seo/jsonld";
import {
  absoluteUrl,
  GOOGLE_SITE_VERIFICATION,
  HOME_TITLE,
  isIndexable,
  pageMetadata,
  rootMetadata,
  TITLE_TEMPLATE,
} from "@/lib/seo/metadata";

const SITE = "https://samuelepoma.com";
const person = {
  siteUrl: SITE,
  role: "Software Engineer",
  github: "https://github.com/SamuelePoma",
  linkedin: "https://www.linkedin.com/in/samuele-poma-547120242/",
  skills: ["Go", "TypeScript"],
};

/** Every URL anywhere in a JSON-LD tree. */
function urls(value: unknown): string[] {
  if (typeof value === "string") return /^https?:/.test(value) ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(urls);
  if (value && typeof value === "object") return Object.values(value).flatMap(urls);
  return [];
}

describe("isIndexable", () => {
  it("indexes production only", () => {
    expect(isIndexable("production")).toBe(true);
    expect(isIndexable("preview")).toBe(false);
    expect(isIndexable(undefined)).toBe(false);
  });

  it("reads VERCEL_ENV by default", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isIndexable()).toBe(true);
    vi.unstubAllEnvs();
  });
});

describe("absoluteUrl", () => {
  it("resolves a path against the site URL", () => {
    expect(absoluteUrl("/work/musetrail", SITE)).toBe("https://samuelepoma.com/work/musetrail");
  });
});

describe("rootMetadata", () => {
  it("sets the base URL, the title template and social defaults", () => {
    const metadata = rootMetadata({ siteUrl: SITE, description: "d", indexable: true });
    expect(metadata.metadataBase?.toString()).toBe(`${SITE}/`);
    expect(metadata.title).toEqual({ default: HOME_TITLE, template: TITLE_TEMPLATE });
    expect(metadata.robots).toEqual({ index: true, follow: true });
    expect(metadata.formatDetection).toEqual({ telephone: false, email: false, address: false });
  });

  it("carries the Search Console verification on every page", () => {
    const metadata = rootMetadata({ siteUrl: SITE, description: "d", indexable: true });
    expect(metadata.verification).toEqual({ google: GOOGLE_SITE_VERIFICATION });
  });

  it("keeps previews out of search engines", () => {
    const metadata = rootMetadata({ siteUrl: SITE, description: "d", indexable: false });
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });

  it("keeps the home title within 60 characters", () => {
    expect(HOME_TITLE.length).toBeLessThanOrEqual(60);
  });
});

describe("pageMetadata", () => {
  it("adds the canonical URL and full social cards", () => {
    const metadata = pageMetadata({
      title: "MuseTrail case study",
      description: "A description.",
      path: "/work/musetrail",
      type: "article",
    });
    expect(metadata.title).toBe("MuseTrail case study");
    expect(metadata.alternates).toEqual({ canonical: "/work/musetrail" });
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      url: "/work/musetrail",
      title: "MuseTrail case study | Samuele Poma",
      siteName: "Samuele Poma",
      locale: "en_US",
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("can opt out of the template", () => {
    const metadata = pageMetadata({
      title: HOME_TITLE,
      description: "d",
      path: "/",
      absoluteTitle: true,
    });
    expect(metadata.title).toEqual({ absolute: HOME_TITLE });
    expect(metadata.openGraph).toMatchObject({ title: HOME_TITLE, type: "website" });
  });
});

describe("JSON-LD", () => {
  it("describes the home page as a profile of the person, without a telephone", () => {
    const data = homeJsonLd(person);
    const graph = data["@graph"] as Record<string, unknown>[];
    expect(graph.map((node) => node["@type"])).toEqual(["WebSite", "ProfilePage", "Person"]);
    expect(graph[2]).toMatchObject({
      name: "Samuele Poma",
      jobTitle: "Software Engineer",
      sameAs: [person.github, person.linkedin],
    });
    expect(JSON.stringify(data)).not.toMatch(/telephone/i);
  });

  it("uses only absolute URLs", () => {
    const all = [
      homeJsonLd(person),
      caseStudyJsonLd({ siteUrl: SITE, slug: "x", title: "X", description: "d", stack: [] }),
      legalPageJsonLd("Privacy policy", "/privacy", SITE),
    ].flatMap(urls);
    expect(all.length).toBeGreaterThan(0);
    for (const url of all) expect(url).toMatch(/^https:\/\//);
  });

  it("marks a case study with public code as SoftwareSourceCode", () => {
    const data = caseStudyJsonLd({
      siteUrl: SITE,
      slug: "chess-game-java",
      title: "Chess in the terminal",
      description: "d",
      start: "2024-12",
      stack: ["Java", "OOP"],
      repo: "https://github.com/SamuelePoma/SD_ChessGame",
    });
    const [work, breadcrumbs] = data["@graph"] as Record<string, unknown>[];
    expect(work).toMatchObject({
      "@type": "SoftwareSourceCode",
      codeRepository: "https://github.com/SamuelePoma/SD_ChessGame",
      dateCreated: "2024-12",
      keywords: "Java, OOP",
      author: { "@id": `${SITE}/#person` },
    });
    expect(breadcrumbs?.["@type"]).toBe("BreadcrumbList");
  });

  it("marks a case study without public code as CreativeWork, leaving unknowns out", () => {
    const data = caseStudyJsonLd({
      siteUrl: SITE,
      slug: "x",
      title: "X",
      description: "d",
      stack: [],
    });
    const [work] = data["@graph"] as Record<string, unknown>[];
    expect(work?.["@type"]).toBe("CreativeWork");
    expect(work).not.toHaveProperty("dateCreated");
    expect(work).not.toHaveProperty("keywords");
    expect(work).not.toHaveProperty("codeRepository");
  });

  it("numbers breadcrumbs from one", () => {
    expect(
      breadcrumbJsonLd(
        [
          { name: "Home", path: "/" },
          { name: "Legal notice", path: "/legal" },
        ],
        SITE,
      ),
    ).toEqual({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Legal notice", item: `${SITE}/legal` },
      ],
    });
  });

  it("escapes < so a value can't close the script element", () => {
    const serialized = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual({ name: "</script><script>alert(1)</script>" });
  });
});

/** Copy for the 404 and error pages (DESIGN.md §9.8). */
export const errorPages = {
  notFound: {
    eyebrow: "Error 404",
    title: "This page doesn't exist.",
    lead: "The link may be old, or the address may have a typo. The work is still all here.",
    metaTitle: "Page not found",
    metaDescription: "This page doesn't exist on Samuele Poma's portfolio.",
  },
  error: {
    eyebrow: "Error",
    title: "Something broke.",
    lead: "An unexpected error stopped this page from loading. Trying again usually helps.",
  },
} as const;

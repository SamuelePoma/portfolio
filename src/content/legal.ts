import type { LegalDocument } from "./schema";
import { site } from "./site";

/**
 * The privacy policy and the legal notice (GDPR, the Netherlands). A careful template written
 * for this site's actual set-up, not legal advice.
 */

export const privacyPolicy = {
  slug: "privacy",
  title: "Privacy policy",
  seoDescription:
    "How this site handles personal data: the emails you send me, the server logs and cookieless analytics. No cookies are set, so there is no cookie banner.",
  updated: "2026-10-08",
  intro:
    "This site is a portfolio. It collects as little personal data as it can, sets no cookies and shows no banner, because there is nothing to consent to. This page explains what happens to the data it does handle.",
  sections: [
    {
      id: "controller",
      title: "Who is responsible",
      paragraphs: [
        `${site.name}, based in Middelburg, the Netherlands, is responsible for this website and for the personal data processed through it (the controller under the GDPR). You can reach me at ${site.email}.`,
      ],
    },
    {
      id: "data",
      title: "What data is collected, and why",
      paragraphs: ["Only what each feature needs, and only for that purpose:"],
      items: [
        "Email: if you write to me, I receive your email address and your message, and use them only to reply. The legal basis is taking steps at your request (Art. 6(1)(b) GDPR) and my legitimate interest in answering messages (Art. 6(1)(f)). The site itself has no form and stores nothing you type.",
        "Server logs: the hosting provider records technical data such as your IP address, browser and the time of each request, to keep the site secure and running (legitimate interest).",
        "Analytics: Umami counts page views, referrers, device types and countries in aggregate. It uses no cookies, stores no personal data and respects Do Not Track.",
        "Performance monitoring: Vercel Speed Insights measures page speed in aggregate, without cookies.",
      ],
    },
    {
      id: "retention",
      title: "How long it is kept",
      items: [
        "Emails: deleted 12 months after our conversation ends.",
        "Server logs: as long as the hosting provider's retention policy allows, then deleted.",
        "Analytics: only aggregated figures are kept; they can't identify you.",
      ],
    },
    {
      id: "processors",
      title: "Who else processes data",
      paragraphs: [
        "These services process data on my behalf, each only for the purpose above. Their own policies explain how they handle it.",
      ],
      links: [
        {
          label: "Vercel (hosting, server logs, Speed Insights)",
          href: "https://vercel.com/legal/privacy-policy",
        },
        {
          label: "Google (Gmail, where your emails arrive)",
          href: "https://policies.google.com/privacy",
        },
        { label: "Umami Cloud (analytics)", href: "https://umami.is/privacy" },
      ],
    },
    {
      id: "transfers",
      title: "International transfers",
      paragraphs: [
        "Some of these providers are based in the United States. Transfers rely on the EU-US Data Privacy Framework where the provider is certified, and on the European Commission's Standard Contractual Clauses otherwise.",
      ],
      links: [
        { label: "EU-US Data Privacy Framework", href: "https://www.dataprivacyframework.gov/" },
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      paragraphs: [
        `You can ask to see the personal data I hold about you, and to have it corrected or deleted. You can also object to its use, ask me to restrict it, or ask for a copy to take elsewhere. Email ${site.email}; I reply within one month.`,
        "If you think your data is mishandled, you can complain to the Dutch data protection authority, the Autoriteit Persoonsgegevens.",
      ],
      links: [
        { label: "Autoriteit Persoonsgegevens", href: "https://autoriteitpersoonsgegevens.nl/en" },
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      paragraphs: [
        "This site does not use cookies, and it does not use your browser's storage to track you.",
        'If a tool that sets non-essential cookies or tracks visitors is ever added, it will first come with a consent manager: a separate opt-in for each category, a "reject all" button as prominent as "accept all", and a permanent link to change your choice.',
      ],
    },
    {
      id: "other",
      title: "Other things worth knowing",
      items: [
        "No decision about you is ever made automatically.",
        "Your data is never sold or shared for advertising.",
        "This site is not aimed at children under 16.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paragraphs: [
        "If the way this site handles data changes, this page changes with it, and the date at the top is updated.",
      ],
    },
  ],
} as const satisfies LegalDocument;

export const legalNotice = {
  slug: "legal",
  title: "Legal notice",
  seoDescription:
    "Legal notice for this site: who runs it, the terms of use, copyright, the MIT licence of the source code and credits for the third-party software it uses.",
  updated: "2026-10-07",
  intro:
    "The practical details: who runs this site, what you may do with it and whose work it builds on.",
  sections: [
    {
      id: "owner",
      title: "Site owner",
      paragraphs: [
        `This site is run by ${site.name}, Middelburg, the Netherlands. Contact: ${site.email}.`,
      ],
    },
    {
      id: "terms",
      title: "Terms of use",
      paragraphs: [
        "The content of this site is for information only. I keep it accurate and up to date, but I can't guarantee it is complete or free of errors.",
        "Links to other sites are provided for convenience. I have no control over their content and accept no liability for it.",
      ],
    },
    {
      id: "copyright",
      title: "Copyright",
      paragraphs: [
        `© ${String(new Date().getFullYear())} ${site.name}. The text, images, résumé, name and monogram on this site are mine, and all rights are reserved.`,
        `Screenshots of client and university projects are shown to document my own work on them. If you hold the rights to one and want it removed, email ${site.email} and I will take it down.`,
      ],
    },
    {
      id: "source-code",
      title: "Source code",
      paragraphs: [
        "The site's source code is released under the MIT licence. The content (texts in src/content, images in public/images and the résumé) is not covered by that licence.",
      ],
      links: [{ label: "Source code on GitHub", href: "https://github.com/SamuelePoma/portfolio" }],
    },
    {
      id: "credits",
      title: "Third-party software and credits",
      paragraphs: [
        "This site is built with open-source software. The full list of production dependencies and their licences is in THIRD_PARTY_LICENSES.md in the repository.",
      ],
      items: [
        "Geist and Geist Mono typefaces by Vercel, SIL Open Font License 1.1",
        "Next.js and React, MIT licence",
        "Tailwind CSS, MIT licence",
        "Lucide icons, ISC licence",
        "Simple Icons (the GitHub logo), CC0 1.0",
        "Lenis, Zod and Sonner, MIT licence",
      ],
    },
  ],
} as const satisfies LegalDocument;

export const legalDocuments = [privacyPolicy, legalNotice] as const;

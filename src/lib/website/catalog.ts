import type { GeneratedSite, SitePage, TemplateId } from "./types";

export type { GeneratedSite, SitePage, TemplateId };
export { TEMPLATES } from "./types";

export const COLORS = ["#4f46e5", "#0f172a", "#059669", "#db2777", "#ea580c"];

export const DEFAULT_FEATURES = [
  "Clear value proposition",
  "Fast to publish",
  "Works on any device",
];

export const PAGE_PRESETS = [
  {
    key: "home",
    name: "Home",
    slug: "",
    template: "landing" as TemplateId,
    required: true,
    headline: "Welcome to our site",
    subheadline: "Tell visitors what you do and why they should stay.",
  },
  {
    key: "about",
    name: "About",
    slug: "about",
    template: "portfolio" as TemplateId,
    required: false,
    headline: "Our story",
    subheadline: "Share who you are and what you believe.",
  },
  {
    key: "services",
    name: "Services",
    slug: "services",
    template: "product" as TemplateId,
    required: false,
    headline: "What we offer",
    subheadline: "List the services or products people can get from you.",
  },
  {
    key: "contact",
    name: "Contact",
    slug: "contact",
    template: "landing" as TemplateId,
    required: false,
    headline: "Get in touch",
    subheadline: "Make it easy for people to reach you.",
  },
] as const;

export type PagePresetKey = (typeof PAGE_PRESETS)[number]["key"];

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function pagePath(slug: string) {
  return slug ? `/${slug}` : "/";
}

export function uniqueSlug(
  pages: { id?: string; slug: string }[],
  desired: string,
  ignoreId?: string,
): string {
  const taken = pages
    .filter((page) => page.id !== ignoreId)
    .map((page) => page.slug);

  if (desired === "") {
    return taken.includes("") ? uniqueSlug(pages, "home", ignoreId) : "";
  }

  const base = slugify(desired) || "page";
  let slug = base;
  let n = 2;
  while (taken.includes(slug)) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export function createPageFromPreset(
  preset: (typeof PAGE_PRESETS)[number],
  siteName: string,
): SitePage {
  return {
    id: crypto.randomUUID(),
    name: preset.name,
    slug: preset.slug,
    template: preset.template,
    headline: preset.key === "home" && siteName ? siteName : preset.headline,
    subheadline: preset.subheadline,
    ctaLabel: preset.key === "contact" ? "Send a message" : "Get started",
    ctaUrl: "#",
    features: [...DEFAULT_FEATURES],
  };
}

export function createBlankPage(pages: SitePage[]): SitePage {
  const name = "New page";
  return {
    id: crypto.randomUUID(),
    name,
    slug: uniqueSlug(pages, name),
    template: "landing",
    headline: "New page headline",
    subheadline: "Describe what this page is for.",
    ctaLabel: "Get started",
    ctaUrl: "#",
    features: [...DEFAULT_FEATURES],
  };
}

export function buildSite(input: {
  name: string;
  slug: string;
  tagline: string;
  primaryColor: string;
  pages: SitePage[];
}): GeneratedSite {
  return {
    id: crypto.randomUUID(),
    name: input.name,
    slug: input.slug,
    tagline: input.tagline,
    primaryColor: input.primaryColor,
    pages: input.pages,
    createdAt: new Date().toISOString(),
  };
}

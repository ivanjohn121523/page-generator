export const TEMPLATES = [
  {
    id: "landing",
    name: "Landing",
    description: "Hero, features, and a call to action",
  },
  {
    id: "product",
    name: "Product",
    description: "Highlight a product with benefits",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Show work and a short bio",
  },
  {
    id: "coming-soon",
    name: "Coming soon",
    description: "Tease a launch and collect interest",
  },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];

export const COLORS = ["#4f46e5", "#0f172a", "#059669", "#db2777", "#ea580c"];

export const DEFAULT_FEATURES = [
  "Clear value proposition",
  "Fast to publish",
  "Works on any device",
];

export type SitePage = {
  id: string;
  name: string;
  slug: string;
  template: TemplateId;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaUrl: string;
  features: string[];
};

export type GeneratedSite = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  primaryColor: string;
  pages: SitePage[];
  createdAt: string;
};

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

const STORAGE_KEY = "page-generator:sites";

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

export function loadSites(): GeneratedSite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GeneratedSite[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getSite(id: string): GeneratedSite | null {
  return loadSites().find((site) => site.id === id) ?? null;
}

export function saveSite(site: GeneratedSite) {
  const sites = loadSites().filter((item) => item.id !== site.id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([site, ...sites]));
}

export function upsertSite(site: GeneratedSite) {
  const sites = loadSites();
  const index = sites.findIndex((item) => item.id === site.id);
  if (index === -1) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([site, ...sites]));
    return;
  }
  const next = [...sites];
  next[index] = site;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

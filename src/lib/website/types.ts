import { Database } from "@/src/core/database-schema/database.types";

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

export type WebsitesInsertSchema = Database['public']['Tables']['websites']['Insert'];

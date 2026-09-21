"use client";

import { useMemo } from "react";
import { pagePath, type SitePage } from "@/src/lib/website/catalog";

type PagePreviewProps = {
  siteName: string;
  siteSlug: string;
  primaryColor: string;
  pages: Pick<SitePage, "name" | "slug">[];
  current: Pick<
    SitePage,
    "name" | "slug" | "template" | "headline" | "subheadline" | "ctaLabel" | "features"
  >;
};

export default function PagePreview({
  siteName,
  siteSlug,
  primaryColor,
  pages,
  current,
}: PagePreviewProps) {
  const features = useMemo(
    () => current.features.map((feature) => feature.trim()).filter(Boolean),
    [current.features],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 truncate rounded bg-white px-2 py-0.5 text-[11px] text-gray-500">
          {siteSlug || "preview"}.site{pagePath(current.slug)}
        </span>
      </div>
      <div className="min-h-[28rem] bg-white p-5">
        <PreviewNav
          siteName={siteName}
          pages={pages}
          currentSlug={current.slug}
          color={primaryColor}
          ctaLabel={current.ctaLabel}
        />
        <PreviewBody
          template={current.template}
          headline={current.headline}
          subheadline={current.subheadline}
          ctaLabel={current.ctaLabel}
          primaryColor={primaryColor}
          features={features}
        />
      </div>
    </div>
  );
}

function PreviewNav({
  siteName,
  pages,
  currentSlug,
  color,
  ctaLabel,
}: {
  siteName: string;
  pages: Pick<SitePage, "name" | "slug">[];
  currentSlug: string;
  color: string;
  ctaLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="shrink-0 text-sm font-semibold text-gray-900">{siteName}</span>
      <div className="hidden min-w-0 items-center gap-3 sm:flex">
        {pages.map((page) => (
          <span
            key={page.slug || "home"}
            className={`truncate text-[11px] ${
              page.slug === currentSlug ? "font-semibold text-gray-900" : "text-gray-500"
            }`}
          >
            {page.name}
          </span>
        ))}
      </div>
      <span
        className="shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium text-white"
        style={{ backgroundColor: color }}
      >
        {ctaLabel}
      </span>
    </div>
  );
}

function PreviewBody({
  template,
  headline,
  subheadline,
  ctaLabel,
  primaryColor,
  features,
}: {
  template: SitePage["template"];
  headline: string;
  subheadline: string;
  ctaLabel: string;
  primaryColor: string;
  features: string[];
}) {
  if (template === "coming-soon") {
    return (
      <div className="flex min-h-[22rem] flex-col items-center justify-center text-center">
        <h3 className="mt-3 text-xl font-bold text-gray-900">{headline}</h3>
        <p className="mt-2 max-w-xs text-sm text-gray-500">{subheadline}</p>
        <button
          type="button"
          className="mt-5 rounded-md px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: primaryColor }}
        >
          {ctaLabel}
        </button>
      </div>
    );
  }

  if (template === "portfolio") {
    return (
      <div>
        <h3 className="mt-6 text-lg font-bold text-gray-900">{headline}</h3>
        <p className="mt-2 text-sm text-gray-500">{subheadline}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {(features.length ? features : ["Project"]).slice(0, 4).map((feature) => (
            <div key={feature} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div
                className="mb-3 h-16 rounded-md"
                style={{ backgroundColor: `${primaryColor}22` }}
              />
              <p className="text-xs font-medium text-gray-800">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (template === "product") {
    return (
      <div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{headline}</h3>
            <p className="mt-2 text-sm text-gray-500">{subheadline}</p>
            <button
              type="button"
              className="mt-4 rounded-md px-3 py-1.5 text-xs font-medium text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {ctaLabel}
            </button>
          </div>
          <div
            className="min-h-32 rounded-lg"
            style={{ backgroundColor: `${primaryColor}1a` }}
          />
        </div>
        <ul className="mt-5 space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
              <span
                className="mt-1 inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-8 text-center">
        <h3 className="text-xl font-bold text-gray-900">{headline}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">{subheadline}</p>
        <button
          type="button"
          className="mt-4 rounded-md px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: primaryColor }}
        >
          {ctaLabel}
        </button>
      </div>
      <div className="mt-8 grid gap-3">
        {features.map((feature) => (
          <div
            key={feature}
            className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700"
          >
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
}

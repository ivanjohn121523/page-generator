"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  COLORS,
  createBlankPage,
  getSite,
  pagePath,
  slugify,
  TEMPLATES,
  uniqueSlug,
  upsertSite,
  type GeneratedSite,
  type SitePage,
  type TemplateId,
} from "@/lib/generated-sites";
import { Field, inputClass } from "./form";
import PagePreview from "./PagePreview";

function SiteEditor({ siteId }: { siteId: string }) {
  const [site, setSite] = useState<GeneratedSite | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    const found = getSite(siteId);
    setSite(found);
    setSelectedId(found?.pages[0]?.id ?? null);
    setLoaded(true);
  }, [siteId]);

  useEffect(() => {
    if (!loaded || !site) return;
    upsertSite(site);
    setSavedAt(Date.now());
  }, [loaded, site]);

  const page = useMemo(
    () => site?.pages.find((item) => item.id === selectedId) ?? null,
    [site, selectedId],
  );

  if (!loaded) {
    return (
      <div className="px-4 py-16 text-center text-sm text-gray-500">Loading site…</div>
    );
  }

  if (!site) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Site not found</h1>
        <p className="mt-2 text-sm text-gray-600">
          It may have been removed from this browser.
        </p>
        <Link
          href="/dashboard/sites"
          className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Back to Sites →
        </Link>
      </div>
    );
  }

  const updateSite = (partial: Partial<GeneratedSite>) => {
    setSite((current) => (current ? { ...current, ...partial } : current));
  };

  const updatePage = (pageId: string, partial: Partial<SitePage>) => {
    setSite((current) => {
      if (!current) return current;
      return {
        ...current,
        pages: current.pages.map((item) =>
          item.id === pageId ? { ...item, ...partial } : item,
        ),
      };
    });
  };

  const addPage = () => {
    const next = createBlankPage(site.pages);
    setSite({ ...site, pages: [...site.pages, next] });
    setSelectedId(next.id);
  };

  const removePage = (pageId: string) => {
    if (site.pages.length <= 1) return;
    const pages = site.pages.filter((item) => item.id !== pageId);
    setSite({ ...site, pages });
    if (selectedId === pageId) setSelectedId(pages[0]?.id ?? null);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 pt-8 md:pt-0">
        <Link
          href="/dashboard/sites"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Sites
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {site.name}
            </h1>
            <p className="mt-1 font-mono text-sm text-gray-500">{site.slug}.site</p>
          </div>
          <p className="text-xs text-gray-500">
            {savedAt ? "Saved in this browser" : "Editing"}
          </p>
        </div>
      </div>

      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-900">Site settings</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Site name" htmlFor="edit-site-name">
            <input
              id="edit-site-name"
              value={site.name}
              onChange={(event) => updateSite({ name: event.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Tagline" htmlFor="edit-site-tagline">
            <input
              id="edit-site-tagline"
              value={site.tagline}
              onChange={(event) => updateSite({ tagline: event.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Use ${color}`}
              onClick={() => updateSite({ primaryColor: color })}
              className={`h-8 w-8 rounded-full border-2 ${
                site.primaryColor === color ? "border-gray-900" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
          <label className="ml-2 text-sm text-gray-600">
            Custom
            <input
              type="color"
              value={site.primaryColor}
              onChange={(event) => updateSite({ primaryColor: event.target.value })}
              className="ml-2 h-8 w-8 cursor-pointer rounded border border-gray-300 bg-white p-0"
            />
          </label>
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between px-2 py-1">
            <h2 className="text-sm font-semibold text-gray-900">Pages</h2>
            <button
              type="button"
              onClick={addPage}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Add
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            {site.pages.map((item) => {
              const active = item.id === selectedId;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left ${
                      active
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="truncate text-sm font-medium">{item.name}</span>
                    <span className="ml-2 shrink-0 font-mono text-[11px] text-gray-400">
                      {pagePath(item.slug)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {page ? (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <form
              className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Configure {page.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Edit the copy and layout for this page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removePage(page.id)}
                  disabled={site.pages.length <= 1}
                  className="text-sm font-medium text-gray-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Page name" htmlFor="page-name">
                  <input
                    id="page-name"
                    value={page.name}
                    onChange={(event) =>
                      updatePage(page.id, { name: event.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Path" htmlFor="page-slug">
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                      /
                    </span>
                    <input
                      id="page-slug"
                      value={page.slug}
                      onChange={(event) =>
                        updatePage(page.id, {
                          slug: slugify(event.target.value),
                        })
                      }
                      onBlur={() =>
                        updatePage(page.id, {
                          slug: uniqueSlug(site.pages, page.slug, page.id),
                        })
                      }
                      placeholder="home"
                      className={`${inputClass} rounded-l-none`}
                    />
                  </div>
                </Field>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Template</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {TEMPLATES.map((template) => {
                    const selected = page.template === template.id;
                    return (
                      <label
                        key={template.id}
                        className={`cursor-pointer rounded-lg border p-3 ${
                          selected
                            ? "border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`template-${page.id}`}
                          value={template.id}
                          checked={selected}
                          onChange={() =>
                            updatePage(page.id, {
                              template: template.id as TemplateId,
                            })
                          }
                          className="sr-only"
                        />
                        <span className="block text-sm font-medium text-gray-900">
                          {template.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-gray-500">
                          {template.description}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <Field label="Headline" htmlFor="page-headline">
                <input
                  id="page-headline"
                  value={page.headline}
                  onChange={(event) =>
                    updatePage(page.id, { headline: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Subheadline" htmlFor="page-subheadline">
                <textarea
                  id="page-subheadline"
                  rows={3}
                  value={page.subheadline}
                  onChange={(event) =>
                    updatePage(page.id, { subheadline: event.target.value })
                  }
                  className={`${inputClass} resize-y`}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Button label" htmlFor="page-cta">
                  <input
                    id="page-cta"
                    value={page.ctaLabel}
                    onChange={(event) =>
                      updatePage(page.id, { ctaLabel: event.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Button URL" htmlFor="page-cta-url">
                  <input
                    id="page-cta-url"
                    value={page.ctaUrl}
                    onChange={(event) =>
                      updatePage(page.id, { ctaUrl: event.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Features</p>
                  <button
                    type="button"
                    disabled={page.features.length >= 4}
                    onClick={() =>
                      updatePage(page.id, { features: [...page.features, ""] })
                    }
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {page.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        value={feature}
                        onChange={(event) =>
                          updatePage(page.id, {
                            features: page.features.map((item, i) =>
                              i === index ? event.target.value : item,
                            ),
                          })
                        }
                        className={inputClass}
                      />
                      <button
                        type="button"
                        disabled={page.features.length <= 1}
                        onClick={() =>
                          updatePage(page.id, {
                            features: page.features.filter((_, i) => i !== index),
                          })
                        }
                        className="rounded-md border border-gray-300 px-3 text-sm text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Remove feature"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>

            <aside className="xl:sticky xl:top-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Live preview</h2>
                <span className="text-xs text-gray-500">{pagePath(page.slug)}</span>
              </div>
              <PagePreview
                siteName={site.name}
                siteSlug={site.slug}
                primaryColor={site.primaryColor}
                pages={site.pages}
                current={page}
              />
            </aside>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SiteEditor;

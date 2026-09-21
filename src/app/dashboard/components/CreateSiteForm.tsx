"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import {
  buildSite,
  COLORS,
  createPageFromPreset,
  PAGE_PRESETS,
  pagePath,
  slugify,
  type PagePresetKey,
} from "@/src/lib/website/catalog";
import { useSitesStore } from "@/src/lib/stores/sites";
import { Field, inputClass } from "./form";
import PagePreview from "./PagePreview";
import axios from "axios";
import { API } from "../constants";

const INITIAL_PRESETS: PagePresetKey[] = ["home", "about", "contact"];

function CreateSiteForm() {
  const router = useRouter();
  const addSite = useSitesStore((state) => state.addSite);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [tagline, setTagline] = useState(
    "A simple site for your product, studio, or launch.",
  );
  const [primaryColor, setPrimaryColor] = useState(COLORS[0]);
  const [presetKeys, setPresetKeys] = useState<PagePresetKey[]>(INITIAL_PRESETS);
  const [error, setError] = useState("");

  const selectedPresets = useMemo(
    () => PAGE_PRESETS.filter((preset) => presetKeys.includes(preset.key)),
    [presetKeys],
  );

  const previewPages = selectedPresets.map((preset) => ({
    name: preset.name,
    slug: preset.slug,
  }));

  const homePreset = selectedPresets[0] ?? PAGE_PRESETS[0];
  const previewName = name.trim() || "Untitled site";

  const togglePreset = (key: PagePresetKey, required: boolean) => {
    if (required) return;
    setPresetKeys((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const siteName = name.trim();
    const siteSlug = slugify(slug || name);
    if (!siteName) {
      setError("Give the site a name.");
      return;
    }
    if (!siteSlug) {
      setError("Add a site slug so it can be published.");
      return;
    }
    if (presetKeys.length === 0) {
      setError("Include at least one page.");
      return;
    }

    // const site = buildSite({
    //   name: siteName,
    //   slug: siteSlug,
    //   tagline: tagline.trim() || PAGE_PRESETS[0].subheadline,
    //   primaryColor,
    //   pages: selectedPresets.map((preset) =>
    //     createPageFromPreset(preset, siteName),
    //   ),
    // });
    // site.pages[0].headline = siteName;
    // site.pages[0].subheadline = site.tagline;
    const data = {
      name: siteName,
      slug: siteSlug,
      tagline: tagline.trim() || PAGE_PRESETS[0].subheadline,
      // // theme: primaryColor,
      // // pages: selectedPresets.map((preset) =>
      //   createPageFromPreset(preset, siteName),
      // ),
    }
    axios.post(API.WEBSITE_CREATE, data)
    // addSite(site);
    // router.push(`/dashboard/sites/${site.id}`);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 pt-8 md:pt-0">
        <p className="text-sm font-medium text-indigo-600">New site</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
          Create a site
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Set the brand and choose the pages to include. You can configure each
          page after the site is created.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <form onSubmit={onSubmit} className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">Site details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Site name" htmlFor="site-name">
                <input
                  id="site-name"
                  value={name}
                  onChange={(event) => {
                    const next = event.target.value;
                    setName(next);
                    if (!slugTouched) setSlug(slugify(next));
                  }}
                  placeholder="Acme"
                  className={inputClass}
                />
              </Field>
              <Field label="Site slug" htmlFor="site-slug">
                <div className="flex rounded-md shadow-sm">
                  <input
                    id="site-slug"
                    value={slug}
                    onChange={(event) => {
                      setSlugTouched(true);
                      setSlug(slugify(event.target.value));
                    }}
                    placeholder="acme"
                    className={`${inputClass} rounded-r-none`}
                  />
                  <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                    .site
                  </span>
                </div>
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Tagline" htmlFor="site-tagline">
                <textarea
                  id="site-tagline"
                  rows={2}
                  value={tagline}
                  onChange={(event) => setTagline(event.target.value)}
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">Brand color</h2>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Use ${color}`}
                  onClick={() => setPrimaryColor(color)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    primaryColor === color ? "border-gray-900" : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <label className="ml-2 text-sm text-gray-600">
                Custom
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(event) => setPrimaryColor(event.target.value)}
                  className="ml-2 h-8 w-8 cursor-pointer rounded border border-gray-300 bg-white p-0"
                />
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">Pages</h2>
            <p className="mt-1 text-sm text-gray-500">
              Start with a sitemap. You can add, remove, and edit pages next.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PAGE_PRESETS.map((preset) => {
                const selected = presetKeys.includes(preset.key);
                return (
                  <label
                    key={preset.key}
                    className={`rounded-lg border p-4 ${
                      preset.required ? "cursor-default" : "cursor-pointer"
                    } ${
                      selected
                        ? "border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={preset.required}
                      onChange={() => togglePreset(preset.key, preset.required)}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {preset.name}
                      </span>
                      <span className="font-mono text-xs text-gray-500">
                        {pagePath(preset.slug)}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      {preset.required ? "Included with every site" : preset.subheadline}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md border border-black bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-none"
          >
            Create site
          </button>
        </form>

        <aside className="lg:sticky lg:top-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Site preview</h2>
            <span className="text-xs text-gray-500">
              {selectedPresets.length} {selectedPresets.length === 1 ? "page" : "pages"}
            </span>
          </div>
          <PagePreview
            siteName={previewName}
            siteSlug={slug || "untitled"}
            primaryColor={primaryColor}
            pages={previewPages}
            current={{
              name: homePreset.name,
              slug: homePreset.slug,
              template: homePreset.template,
              headline: previewName,
              subheadline: tagline,
              ctaLabel: "Get started",
              features: [
                "Home plus the pages you select",
                "Shared brand color across the site",
                "Edit copy for each page after create",
              ],
            }}
          />
        </aside>
      </div>
    </div>
  );
}

export default CreateSiteForm;

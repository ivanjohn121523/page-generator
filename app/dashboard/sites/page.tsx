"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadSites, pagePath, type GeneratedSite } from "@/lib/generated-sites";

export default function Sites() {
  const [sites, setSites] = useState<GeneratedSite[]>([]);

  useEffect(() => {
    setSites(loadSites());
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4 pt-8 md:pt-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sites</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sites you have generated. Open one to configure its pages.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-md border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Create site
        </Link>
      </div>

      {sites.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <p className="text-sm font-medium text-gray-900">No sites yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Create a site, then add and configure its pages.
          </p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Create a site →
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {sites.map((site) => (
            <li key={site.id}>
              <Link
                href={`/dashboard/sites/${site.id}`}
                className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-gray-300"
              >
                <div
                  className="mb-4 h-20 rounded-lg"
                  style={{ backgroundColor: `${site.primaryColor}22` }}
                />
                <p className="text-sm font-semibold text-gray-900">{site.name}</p>
                <p className="mt-1 font-mono text-xs text-gray-500">{site.slug}.site</p>
                <p className="mt-3 text-sm text-gray-600">
                  {site.pages.length} {site.pages.length === 1 ? "page" : "pages"}
                  {site.pages[0]
                    ? ` · Home ${pagePath(site.pages[0].slug)}`
                    : ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

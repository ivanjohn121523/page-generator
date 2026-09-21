"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { createBlankPage } from "@/src/lib/website/catalog";
import type { GeneratedSite, SitePage } from "@/src/lib/website/types";

const STORAGE_KEY = "page-generator:sites";

type SitesState = {
  sites: GeneratedSite[];
  hasHydrated: boolean;
  addSite: (site: GeneratedSite) => void;
  patchSite: (siteId: string, partial: Partial<GeneratedSite>) => void;
  patchPage: (siteId: string, pageId: string, partial: Partial<SitePage>) => void;
  addPage: (siteId: string) => string | null;
  removePage: (siteId: string, pageId: string) => void;
};

const sitesStorage: StateStorage = {
  getItem: (name) => {
    const raw = localStorage.getItem(name);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return JSON.stringify({ state: { sites: parsed }, version: 0 });
      }
      return raw;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useSitesStore = create<SitesState>()(
  persist(
    (set, get) => ({
      sites: [],
      hasHydrated: false,
      addSite: (site) =>
        set({
          sites: [site, ...get().sites.filter((item) => item.id !== site.id)],
        }),
      patchSite: (siteId, partial) =>
        set({
          sites: get().sites.map((site) =>
            site.id === siteId ? { ...site, ...partial } : site,
          ),
        }),
      patchPage: (siteId, pageId, partial) =>
        set({
          sites: get().sites.map((site) => {
            if (site.id !== siteId) return site;
            return {
              ...site,
              pages: site.pages.map((page) =>
                page.id === pageId ? { ...page, ...partial } : page,
              ),
            };
          }),
        }),
      addPage: (siteId) => {
        let pageId: string | null = null;
        set({
          sites: get().sites.map((site) => {
            if (site.id !== siteId) return site;
            const page = createBlankPage(site.pages);
            pageId = page.id;
            return { ...site, pages: [...site.pages, page] };
          }),
        });
        return pageId;
      },
      removePage: (siteId, pageId) =>
        set({
          sites: get().sites.map((site) => {
            if (site.id !== siteId || site.pages.length <= 1) return site;
            return {
              ...site,
              pages: site.pages.filter((page) => page.id !== pageId),
            };
          }),
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => sitesStorage),
      partialize: (state) => ({ sites: state.sites }),
      skipHydration: true,
      onRehydrateStorage: () => () => {
        useSitesStore.setState({ hasHydrated: true });
      },
    },
  ),
);

export function selectSiteById(siteId: string) {
  return (state: SitesState) =>
    state.sites.find((site) => site.id === siteId) ?? null;
}

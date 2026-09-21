"use client";

import { useEffect, type ReactNode } from "react";
import { useSitesStore } from "./sites";

export function ClientStoresProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void Promise.resolve(useSitesStore.persist.rehydrate()).finally(() => {
      useSitesStore.setState({ hasHydrated: true });
    });
  }, []);

  return children;
}

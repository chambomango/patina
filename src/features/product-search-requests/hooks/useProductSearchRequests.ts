"use client";

import { useCallback, useSyncExternalStore } from "react";
import type {
  ProductSearchRequest,
  SavedProductSearchRequest,
} from "@/features/product-search-requests/types/productSearchRequest";

// Temporary client-side persistence (Task 1.2.3) so the dashboard run modal and the
// /search-requests editor share one request list across navigations and reloads.
// Replaced by DB-backed server data in Task 1.4.6 — delete this module-level store
// and the localStorage helpers at that point.

const STORAGE_KEY = "patina.productSearchRequests.v1";

const EMPTY: SavedProductSearchRequest[] = [];
let store: SavedProductSearchRequest[] = EMPTY;
let initialized = false;
const listeners = new Set<() => void>();

function load(): SavedProductSearchRequest[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as SavedProductSearchRequest[];
      }
    }
  } catch {
    // Corrupt or unavailable localStorage: start with an empty list.
  }
  return EMPTY;
}

function persist(next: SavedProductSearchRequest[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota or privacy-mode errors are non-fatal for transient UI state.
  }
}

function update(next: SavedProductSearchRequest[]) {
  store = next;
  persist(next);
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void) {
  if (!initialized && typeof window !== "undefined") {
    store = load();
    initialized = true;
  }
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  return store;
}

function getServerSnapshot() {
  return EMPTY;
}

export function useProductSearchRequests() {
  const requests = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const createRequest = useCallback((input: ProductSearchRequest) => {
    update([...store, { ...input, id: crypto.randomUUID() }]);
  }, []);

  const updateRequest = useCallback(
    (id: string, input: ProductSearchRequest) => {
      update(
        store.map((request) =>
          request.id === id ? { ...input, id } : request,
        ),
      );
    },
    [],
  );

  const deleteRequest = useCallback((id: string) => {
    update(store.filter((request) => request.id !== id));
  }, []);

  return { requests, createRequest, updateRequest, deleteRequest };
}

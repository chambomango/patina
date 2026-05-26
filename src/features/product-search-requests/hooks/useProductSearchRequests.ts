"use client";

import { useCallback, useState } from "react";
import type {
  ProductSearchRequest,
  SavedProductSearchRequest,
} from "@/features/product-search-requests/types/productSearchRequest";

// In-memory store for saved search requests during MVP 1 UI work. State resets on reload;
// durable persistence arrives with the database in Feature 1.4.
export function useProductSearchRequests() {
  const [requests, setRequests] = useState<SavedProductSearchRequest[]>([]);

  const createRequest = useCallback((input: ProductSearchRequest) => {
    setRequests((current) => [...current, { ...input, id: crypto.randomUUID() }]);
  }, []);

  const updateRequest = useCallback((id: string, input: ProductSearchRequest) => {
    setRequests((current) =>
      current.map((request) => (request.id === id ? { ...input, id } : request)),
    );
  }, []);

  const deleteRequest = useCallback((id: string) => {
    setRequests((current) => current.filter((request) => request.id !== id));
  }, []);

  return { requests, createRequest, updateRequest, deleteRequest };
}

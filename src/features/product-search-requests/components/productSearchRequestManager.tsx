"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ProductSearchRequestCard } from "@/features/product-search-requests/components/productSearchRequestCard";
import { ProductSearchRequestDialog } from "@/features/product-search-requests/components/productSearchRequestDialog";
import { useProductSearchRequests } from "@/features/product-search-requests/hooks/useProductSearchRequests";
import type {
  ProductSearchRequest,
  SavedProductSearchRequest,
} from "@/features/product-search-requests/types/productSearchRequest";

export function ProductSearchRequestManager() {
  const { requests, createRequest, updateRequest, deleteRequest } =
    useProductSearchRequests();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SavedProductSearchRequest | null>(
    null,
  );

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(request: SavedProductSearchRequest) {
    setEditing(request);
    setDialogOpen(true);
  }

  function handleSubmit(value: ProductSearchRequest) {
    if (editing) {
      updateRequest(editing.id, value);
    } else {
      createRequest(value);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-4">
        <Button onClick={openCreate}>New</Button>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Create your first product search request to get started.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <ProductSearchRequestCard
              key={request.id}
              request={request}
              onEdit={openEdit}
              onDelete={deleteRequest}
            />
          ))}
        </div>
      )}

      <ProductSearchRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={editing ? "edit" : "create"}
        initialValue={editing ?? undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

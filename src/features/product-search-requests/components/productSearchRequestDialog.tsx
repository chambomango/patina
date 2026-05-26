"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductSearchRequestForm } from "@/features/product-search-requests/components/product-search-request-form";
import type { ProductSearchRequest } from "@/features/product-search-requests/types/product-search-request";

type ProductSearchRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initialValue?: ProductSearchRequest;
  onSubmit: (value: ProductSearchRequest) => void;
};

export function ProductSearchRequestDialog({
  open,
  onOpenChange,
  mode,
  initialValue,
  onSubmit,
}: ProductSearchRequestDialogProps) {
  const isEdit = mode === "edit";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit search request" : "New search request"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update product search."
              : "Define a product search to run later."}
          </DialogDescription>
        </DialogHeader>
        <ProductSearchRequestForm
          initialValue={initialValue}
          submitLabel={isEdit ? "Save" : "Create"}
          onSubmit={(value) => {
            onSubmit(value);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

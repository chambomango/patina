"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { RunRequestsDialog } from "@/features/product-search-requests/components/runRequestsDialog";
import { useProductSearchRequests } from "@/features/product-search-requests/hooks/useProductSearchRequests";

export function RunSearchesButton() {
  const { requests } = useProductSearchRequests();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={requests.length === 0}>
        Run searches
      </Button>
      <RunRequestsDialog
        open={open}
        onOpenChange={setOpen}
        requests={requests}
      />
    </>
  );
}

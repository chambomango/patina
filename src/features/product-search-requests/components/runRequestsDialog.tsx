"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { runProductSearchRequest } from "@/features/product-search-requests/runtime/runRequest";
import type { SavedProductSearchRequest } from "@/features/product-search-requests/types/productSearchRequest";

type RunStatus = "idle" | "running" | "completed" | "failed";

type RunRequestsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requests: SavedProductSearchRequest[];
};

export function RunRequestsDialog({
  open,
  onOpenChange,
  requests,
}: RunRequestsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-dvh max-w-full flex-col rounded-none sm:h-auto sm:max-w-lg sm:rounded-xl">
        {/* Body mounts on open, unmounts on close — selection and statuses reset per open. */}
        <RunRequestsBody
          requests={requests}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

type RunRequestsBodyProps = {
  requests: SavedProductSearchRequest[];
  onClose: () => void;
};

function RunRequestsBody({ requests, onClose }: RunRequestsBodyProps) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(requests.map((request) => request.id)),
  );
  const [statuses, setStatuses] = useState<Record<string, RunStatus>>({});
  const running = Object.values(statuses).some((s) => s === "running");

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function runIds(ids: string[]) {
    setStatuses((prev) => {
      const next = { ...prev };
      for (const id of ids) {
        next[id] = "running";
      }
      return next;
    });

    await Promise.all(
      ids.map(async (id) => {
        try {
          const result = await runProductSearchRequest();
          setStatuses((prev) => ({
            ...prev,
            [id]: result.status === "failed" ? "failed" : "completed",
          }));
        } catch {
          setStatuses((prev) => ({ ...prev, [id]: "failed" }));
        }
      }),
    );
  }

  const selectedIds = requests
    .filter((request) => selected.has(request.id))
    .map((request) => request.id);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Run searches</DialogTitle>
        <DialogDescription>
          Pick searches to run. eBay collection is wired in a later step — runs
          complete without collecting products for now.
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto">
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No saved searches yet. Create one on the Manage searches page.
          </p>
        ) : (
          <ul className="flex flex-col divide-y">
            {requests.map((request) => {
              const status = statuses[request.id] ?? "idle";
              return (
                <li key={request.id} className="flex items-center gap-3 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(request.id)}
                    onChange={() => toggle(request.id)}
                    disabled={running}
                    aria-label={`Select ${request.name}`}
                    className="size-4 accent-foreground"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {request.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      “{request.query}”
                    </p>
                  </div>
                  <RunStatusBadge status={status} />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" disabled={running} onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={running || selectedIds.length === 0}
          onClick={() => runIds(selectedIds)}
        >
          Run selected
        </Button>
        <Button
          disabled={running || requests.length === 0}
          onClick={() => runIds(requests.map((request) => request.id))}
        >
          Run all
        </Button>
      </DialogFooter>
    </>
  );
}

function RunStatusBadge({ status }: { status: RunStatus }) {
  if (status === "running") {
    return <span className="text-xs text-muted-foreground">Running…</span>;
  }
  if (status === "completed") {
    return (
      <span className="text-xs text-muted-foreground">Done (no products)</span>
    );
  }
  if (status === "failed") {
    return <span className="text-xs text-destructive">Failed</span>;
  }
  return null;
}

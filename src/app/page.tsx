import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/themeToggle";
import { ProductResults } from "@/features/products/components/productResults";
import { seedProducts } from "@/features/products/seed/seedProducts";
import { RunSearchesButton } from "@/features/product-search-requests/components/runSearchesButton";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-tight">Patina</span>
            <span className="text-xs text-muted-foreground">
              Product dashboard
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold tracking-tight">Products</h1>
              <p className="text-sm text-muted-foreground">
                Products collected from your saved searches.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <RunSearchesButton />
              <Button variant="outline" asChild>
                <Link href="/search-requests">Manage searches</Link>
              </Button>
            </div>
          </section>

          <section>
            {/* Seed Products from Task 1.2.1a (preview only; removed when DB-backed Products land in Task 1.4.4). */}
            <ProductResults products={seedProducts} />
          </section>
        </div>
      </main>
    </div>
  );
}

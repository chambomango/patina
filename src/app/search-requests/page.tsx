import { ProductSearchRequestManager } from "@/features/product-search-requests/components/product-search-request-manager";

export default function SearchRequestsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Searches</h1>
        <p className="text-sm text-muted-foreground">
          Run searches to find your favorite products
        </p>
      </header>
      <ProductSearchRequestManager />
    </main>
  );
}

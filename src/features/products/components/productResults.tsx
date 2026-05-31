import type { Product } from "@/features/products/types/product";

type ProductResultsProps = {
  products: Product[];
};

export function ProductResults({ products }: ProductResultsProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center">
        <p className="text-sm font-medium">No products collected yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Run a search to start collecting products.
        </p>
      </div>
    );
  }

  // Product cards arrive in Task 1.2.4; until then, summarize what would render.
  return (
    <p className="text-sm text-muted-foreground">
      {products.length} product{products.length === 1 ? "" : "s"} collected.
    </p>
  );
}

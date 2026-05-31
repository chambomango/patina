import { ProductCard } from "@/features/products/components/productCard";
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

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.sourceProductId ?? product.sourceUrl}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

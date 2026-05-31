import Image from "next/image";

import type { Product } from "@/features/products/types/product";
import { formatPrice } from "@/lib/formatting/formatPrice";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10">
      <div className="relative h-48 shrink-0 bg-muted">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug">
          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {product.title}
          </a>
        </h3>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <Price product={product} />
          {product.condition ? (
            <span className="text-xs text-muted-foreground">
              {product.condition}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
          {product.location ? (
            <span className="truncate">{product.location}</span>
          ) : (
            <span className="truncate">No Location</span>
          )}
          <span className="shrink-0">{product.source}</span>
        </div>
      </div>
    </article>
  );
}

function Price({ product }: { product: Product }) {
  if (product.price === undefined) {
    return (
      <span className="text-sm font-semibold text-muted-foreground">
        No price
      </span>
    );
  }
  return (
    <span className="text-sm font-semibold">
      {formatPrice(product.price, product.currency)}
    </span>
  );
}


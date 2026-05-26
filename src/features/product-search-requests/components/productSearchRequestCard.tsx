import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BUYING_OPTION_LABELS,
  CONDITION_LABELS,
} from "@/features/product-search-requests/labels";
import type { SavedProductSearchRequest } from "@/features/product-search-requests/types/product-search-request";

type ProductSearchRequestCardProps = {
  request: SavedProductSearchRequest;
  onEdit: (request: SavedProductSearchRequest) => void;
  onDelete: (id: string) => void;
};

function describeFilters(
  request: SavedProductSearchRequest,
): { label: string; value: string }[] {
  const filters: { label: string; value: string }[] = [];
  if (request.minPrice !== undefined) {
    filters.push({ label: "Min", value: `$${request.minPrice}` });
  }
  if (request.maxPrice !== undefined) {
    filters.push({ label: "Max", value: `$${request.maxPrice}` });
  }
  if (request.condition) {
    filters.push({ label: "Condition", value: CONDITION_LABELS[request.condition] });
  }
  if (request.buyingOption) {
    filters.push({
      label: "Buying",
      value: BUYING_OPTION_LABELS[request.buyingOption],
    });
  }
  return filters;
}

export function ProductSearchRequestCard({
  request,
  onEdit,
  onDelete,
}: ProductSearchRequestCardProps) {
  const filters = describeFilters(request);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{request.name}</CardTitle>
        <CardDescription>“{request.query}”</CardDescription>
      </CardHeader>
      <CardContent>
        {filters.length > 0 ? (
          <dl className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
            {filters.map((filter) => (
              <div key={filter.label} className="flex gap-1">
                <dt>{filter.label}:</dt>
                <dd className="text-foreground">{filter.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-muted-foreground">No filters</p>
        )}
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(request)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(request.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

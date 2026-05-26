"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BUYING_OPTION_LABELS,
  CONDITION_LABELS,
} from "@/features/product-search-requests/labels";
import type {
  BuyingOption,
  ProductCondition,
  ProductSearchRequest,
} from "@/features/product-search-requests/types/productSearchRequest";

// Sentinel for the "no filter" option
const ANY = "any";
type ConditionValue = ProductCondition | typeof ANY;
type BuyingOptionValue = BuyingOption | typeof ANY;

type FormValues = {
  name: string;
  query: string;
  minPrice: string;
  maxPrice: string;
  condition: ConditionValue;
  buyingOption: BuyingOptionValue;
};

type FieldErrors = Partial<
  Record<"name" | "query" | "minPrice" | "maxPrice", string>
>;

type ProductSearchRequestFormProps = {
  initialValue?: ProductSearchRequest;
  submitLabel: string;
  onSubmit: (value: ProductSearchRequest) => void;
  onCancel: () => void;
};

function toFormValues(initial?: ProductSearchRequest): FormValues {
  return {
    name: initial?.name ?? "",
    query: initial?.query ?? "",
    minPrice: initial?.minPrice?.toString() ?? "",
    maxPrice: initial?.maxPrice?.toString() ?? "",
    condition: initial?.condition ?? ANY,
    buyingOption: initial?.buyingOption ?? ANY,
  };
}

function parsePrice(raw: string): number | undefined | "invalid" {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0) return "invalid";
  return parsed;
}

export function ProductSearchRequestForm({
  initialValue,
  submitLabel,
  onSubmit,
  onCancel,
}: ProductSearchRequestFormProps) {
  const [values, setValues] = useState<FormValues>(() =>
    toFormValues(initialValue),
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  function setField<K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    const name = values.name.trim();
    const query = values.query.trim();

    // Required identity/query fields are distinguished from the optional filters below.
    if (!name) nextErrors.name = "Name is required.";
    if (!query) nextErrors.query = "Search query is required.";

    const minPrice = parsePrice(values.minPrice);
    if (minPrice === "invalid") nextErrors.minPrice = "Enter a number ≥ 0.";
    const maxPrice = parsePrice(values.maxPrice);
    if (maxPrice === "invalid") nextErrors.maxPrice = "Enter a number ≥ 0.";

    if (
      typeof minPrice === "number" &&
      typeof maxPrice === "number" &&
      maxPrice < minPrice
    ) {
      nextErrors.maxPrice = "Max price must be ≥ min price.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      name,
      query,
      minPrice: minPrice === "invalid" ? undefined : minPrice,
      maxPrice: maxPrice === "invalid" ? undefined : maxPrice,
      condition: values.condition === ANY ? undefined : values.condition,
      buyingOption:
        values.buyingOption === ANY ? undefined : values.buyingOption,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={values.name}
          onChange={(event) => setField("name", event.target.value)}
          placeholder="e.g. Vintage cameras"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="query">Search query</Label>
        <Input
          id="query"
          value={values.query}
          onChange={(event) => setField("query", event.target.value)}
          placeholder="e.g. pentax k1000"
          aria-invalid={Boolean(errors.query)}
        />
        {errors.query && (
          <p className="text-sm text-destructive">{errors.query}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="minPrice">Min price</Label>
          <Input
            id="minPrice"
            type="number"
            min="0"
            inputMode="decimal"
            value={values.minPrice}
            onChange={(event) => setField("minPrice", event.target.value)}
            placeholder="Any"
            aria-invalid={Boolean(errors.minPrice)}
          />
          {errors.minPrice && (
            <p className="text-sm text-destructive">{errors.minPrice}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="maxPrice">Max price</Label>
          <Input
            id="maxPrice"
            type="number"
            min="0"
            inputMode="decimal"
            value={values.maxPrice}
            onChange={(event) => setField("maxPrice", event.target.value)}
            placeholder="Any"
            aria-invalid={Boolean(errors.maxPrice)}
          />
          {errors.maxPrice && (
            <p className="text-sm text-destructive">{errors.maxPrice}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="condition">Condition</Label>
          <Select
            value={values.condition}
            onValueChange={(value) =>
              setField("condition", value as ConditionValue)
            }
          >
            <SelectTrigger id="condition" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Any</SelectItem>
              {(
                Object.entries(CONDITION_LABELS) as [ProductCondition, string][]
              ).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="buyingOption">Buying option</Label>
          <Select
            value={values.buyingOption}
            onValueChange={(value) =>
              setField("buyingOption", value as BuyingOptionValue)
            }
          >
            <SelectTrigger id="buyingOption" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Any</SelectItem>
              {(
                Object.entries(BUYING_OPTION_LABELS) as [BuyingOption, string][]
              ).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

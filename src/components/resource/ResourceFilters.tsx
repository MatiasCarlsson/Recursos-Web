"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PriceModelOption, SearchCategoryOption, SearchTagOption } from "@/api/api";

type ResourceFiltersProps = {
  categories: SearchCategoryOption[];
  tags: SearchTagOption[];
  priceModels: PriceModelOption[];
  selectedCategoryIds: number[];
  selectedTagIds: number[];
  selectedPriceModelIds: number[];
  search?: string;
};

type FilterState = {
  categoryIds: number[];
  tagIds: number[];
  priceModelIds: number[];
};

const EMPTY_FILTERS: FilterState = {
  categoryIds: [],
  tagIds: [],
  priceModelIds: [],
};

function toggleId(ids: number[], value: number) {
  return ids.includes(value) ? ids.filter((id) => id !== value) : [...ids, value];
}

function toUniqueSorted(values: number[]) {
  return [...new Set(values)].sort((a, b) => a - b);
}

function areSameIds(a: number[], b: number[]) {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((value, index) => value === b[index]);
}

function areSameFilters(a: FilterState, b: FilterState) {
  return (
    areSameIds(a.categoryIds, b.categoryIds) &&
    areSameIds(a.tagIds, b.tagIds) &&
    areSameIds(a.priceModelIds, b.priceModelIds)
  );
}

export default function ResourceFilters({
  categories,
  tags,
  priceModels,
  selectedCategoryIds,
  selectedTagIds,
  selectedPriceModelIds,
  search,
}: ResourceFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const activeFilters = useMemo<FilterState>(
    () => ({
      categoryIds: toUniqueSorted(selectedCategoryIds),
      tagIds: toUniqueSorted(selectedTagIds),
      priceModelIds: toUniqueSorted(selectedPriceModelIds),
    }),
    [selectedCategoryIds, selectedTagIds, selectedPriceModelIds],
  );

  const [draftFilters, setDraftFilters] = useState<FilterState>(activeFilters);

  useEffect(() => {
    setDraftFilters(activeFilters);
  }, [activeFilters]);

  function pushFilters(next: FilterState) {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    if (next.categoryIds.length) {
      query.set("categoryIds", next.categoryIds.join(","));
    }

    if (next.tagIds.length) {
      query.set("tagIds", next.tagIds.join(","));
    }

    if (next.priceModelIds.length) {
      query.set("priceModelIds", next.priceModelIds.join(","));
    }

    const queryString = query.toString();
    const target = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(target, { scroll: false });
    });
  }

  function toggleDraftFilter(type: keyof FilterState, id: number) {
    setDraftFilters((current) => ({
      ...current,
      [type]: toUniqueSorted(toggleId(current[type], id)),
    }));
  }

  function clearFilters() {
    setDraftFilters(EMPTY_FILTERS);

    if (!areSameFilters(activeFilters, EMPTY_FILTERS)) {
      pushFilters(EMPTY_FILTERS);
    }
  }

  function applyFilters() {
    pushFilters(draftFilters);
  }

  const hasChanges = !areSameFilters(draftFilters, activeFilters);
  const selectedCount =
    draftFilters.categoryIds.length +
    draftFilters.tagIds.length +
    draftFilters.priceModelIds.length;

  return (
    <aside className="rounded-2xl border border-border/70 bg-cardBackground/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-textSecondary">
            Filtros
          </h2>
          <p className="text-xs text-textSecondary/80">{selectedCount} seleccionados</p>
          <p className="text-[11px] text-textSecondary/70">Se combinan entre si</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearFilters}
            disabled={isPending}
            className="text-xs font-medium text-textSecondary underline underline-offset-4 hover:text-textPrimary"
          >
            Limpiar
          </button>

          <button
            type="button"
            onClick={() => setIsMobileOpen((current) => !current)}
            className="rounded-md border border-border/80 px-2 py-1 text-xs text-textSecondary lg:hidden"
          >
            {isMobileOpen ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      </div>

      <div className={`${isMobileOpen ? "block" : "hidden"} space-y-4 lg:block`}>
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-textSecondary">
            Categorias
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isChecked = draftFilters.categoryIds.includes(category.id);

              return (
                <button
                  type="button"
                  key={category.id}
                  onClick={() => toggleDraftFilter("categoryIds", category.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    isChecked
                      ? "border-buttonColor/80 bg-buttonColor/20 text-textPrimary"
                      : "border-border/80 text-textSecondary hover:border-buttonColor/50 hover:text-textPrimary"
                  }`}
                  aria-pressed={isChecked}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-textSecondary">
            Etiquetas
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isChecked = draftFilters.tagIds.includes(tag.id);

              return (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => toggleDraftFilter("tagIds", tag.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    isChecked
                      ? "border-buttonColor/80 bg-buttonColor/20 text-textPrimary"
                      : "border-border/80 text-textSecondary hover:border-buttonColor/50 hover:text-textPrimary"
                  }`}
                  aria-pressed={isChecked}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-textSecondary">
            Modelo de precio
          </p>
          <div className="flex flex-wrap gap-2">
            {priceModels.map((priceModel) => {
              const isChecked = draftFilters.priceModelIds.includes(priceModel.id);

              return (
                <button
                  type="button"
                  key={priceModel.id}
                  onClick={() => toggleDraftFilter("priceModelIds", priceModel.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    isChecked
                      ? "border-buttonColor/80 bg-buttonColor/20 text-textPrimary"
                      : "border-border/80 text-textSecondary hover:border-buttonColor/50 hover:text-textPrimary"
                  }`}
                  aria-pressed={isChecked}
                >
                  {priceModel.label}
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex items-center gap-2 border-t border-border/70 pt-3">
          <button
            type="button"
            onClick={applyFilters}
            disabled={!hasChanges || isPending}
            className="rounded-lg bg-buttonColor px-3 py-2 text-sm font-semibold text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Aplicando..." : "Aplicar filtros"}
          </button>
          <button
            type="button"
            onClick={() => setDraftFilters(activeFilters)}
            disabled={!hasChanges || isPending}
            className="rounded-lg border border-border/80 px-3 py-2 text-sm text-textSecondary transition hover:border-buttonColor/50 hover:text-textPrimary disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      </div>
    </aside>
  );
}

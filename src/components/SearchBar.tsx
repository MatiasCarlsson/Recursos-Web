"use client";

import type { SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import useSearch, { SearchCategory, SearchTag } from "@/components/Hooks/useSearch";

interface SearchBarProps {
  categories: SearchCategory[];
  tags?: SearchTag[];
}

function SearchBar({ categories, tags = [] }: SearchBarProps) {
  const router = useRouter();

  const {
    query,
    setQuery,
    isPanelOpen,
    openPanel,
    closePanel,
    categories: allCategories,
    tags: allTags,
    filteredCategories,
    filteredTags,
    selectedCategoryId,
    selectedTagIds,
    selectCategory,
    toggleTag,
  } = useSearch({ categories, tags });

  function buildResourceUrl(next: {
    search?: string;
    categoryId?: number | null;
    tagIds?: number[];
  }) {
    const params = new URLSearchParams();

    const searchText = next.search?.trim();
    if (searchText) {
      params.set("search", searchText);
    }

    if (next.categoryId) {
      params.set("categoryId", String(next.categoryId));
    }

    if (next.tagIds?.length) {
      params.set("tagIds", next.tagIds.join(","));
    }

    const query = params.toString();
    return query ? `/resource?${query}` : "/resource";
  }

  function handleCategoryClick(category: SearchCategory) {
    selectCategory(category);
    router.push(
      buildResourceUrl({
        search: query,
        categoryId: category.id,
        tagIds: selectedTagIds,
      }),
    );
  }

  function handleTagClick(tag: SearchTag) {
    const nextTagIds = selectedTagIds.includes(tag.id)
      ? selectedTagIds.filter((id) => id !== tag.id)
      : [...selectedTagIds, tag.id];

    toggleTag(tag);
    router.push(
      buildResourceUrl({
        search: query,
        categoryId: selectedCategoryId,
        tagIds: nextTagIds,
      }),
    );
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    router.push(
      buildResourceUrl({
        search: trimmedQuery,
        categoryId: selectedCategoryId,
        tagIds: selectedTagIds,
      }),
    );
  }

  return (
    <div
      className="relative w-full max-w-4xl"
      onFocusCapture={openPanel}
      onBlurCapture={(event) => {
        // Cerramos solo cuando el foco sale completamente del contenedor.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          closePanel();
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <label htmlFor="resource-search" className="sr-only">
          Buscar recursos
        </label>

        <input
          id="resource-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar recursos, temas o etiquetas... "
          className="w-full rounded-xl border border-buttonColor/70 bg-cardBackground/80 pl-12 pr-4 py-2.5 text-textPrimary placeholder:text-textSecondary/80 shadow-[0_0_14px_rgba(191,0,255,0.25)] outline-none transition-all focus:border-buttonColor focus:shadow-[0_0_20px_rgba(191,0,255,0.45)] select-none"
        />
        <span className="absolute inset-y-1 left-4 flex items-center justify-start pointer-events-none text-textSecondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-6"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607"
            />
          </svg>
        </span>
      </form>

      {isPanelOpen ? (
        <section className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[70vh] overflow-hidden rounded-xl border border-buttonColor/40 bg-cardBackground/90 shadow-[0_0_22px_rgba(191,0,255,0.25)] backdrop-blur-sm">
          <div className="grid gap-4 p-4 md:grid-cols-3">
            <div className="min-w-0 md:col-span-1">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-textSecondary">
                Categorias principales
              </p>
              <div className="max-h-44 overflow-y-auto pr-1">
                <div className="flex flex-wrap gap-2">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => {
                      const isSelected = selectedCategoryId === category.id;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategoryClick(category)}
                          className={`rounded-full border px-3 py-1.5 text-sm transition-all cursor-pointer ${isSelected ? "border-buttonColor/80 bg-buttonColor/20 text-textPrimary shadow-[0_0_12px_rgba(191,0,255,0.3)]" : "border-border/80 text-textSecondary hover:border-buttonColor/50 hover:bg-buttonColor/10 hover:text-textPrimary"}`}
                        >
                          {category.label}
                        </button>
                      );
                    })
                  ) : allCategories.length > 0 ? (
                    <p className="rounded-lg border border-dashed border-buttonColor/40 px-3 py-2 text-sm text-textSecondary">
                      No hay categorias para &quot;{query.trim()}&quot;.
                    </p>
                  ) : (
                    <p className="rounded-lg border border-dashed border-buttonColor/40 px-3 py-2 text-sm text-textSecondary">
                      No hay categorias disponibles.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {allTags.length > 0 ? (
              <div className="min-w-0 border-t border-buttonColor/20 pt-3 md:col-span-2 md:border-l md:border-t-0 md:pl-4 md:pt-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-textSecondary">
                  Etiquetas
                </p>
                <div className="max-h-44 overflow-y-auto pr-1">
                  <div className="flex flex-wrap gap-2">
                    {filteredTags.length > 0 ? (
                      filteredTags.map((tag) => {
                        const isSelected = selectedTagIds.includes(tag.id);

                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleTagClick(tag)}
                            className={`rounded-full border px-3 py-1.5 text-sm transition-all cursor-pointer ${isSelected ? "border-buttonColor/80 bg-buttonColor/20 text-textPrimary shadow-[0_0_12px_rgba(191,0,255,0.3)]" : "border-border/80 text-textSecondary hover:border-buttonColor/50 hover:bg-buttonColor/10 hover:text-textPrimary"}`}
                          >
                            {tag.label}
                          </button>
                        );
                      })
                    ) : (
                      <p className="rounded-lg border border-dashed border-buttonColor/40 px-3 py-2 text-sm text-textSecondary">
                        No hay etiquetas para &quot;{query.trim()}&quot;.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default SearchBar;

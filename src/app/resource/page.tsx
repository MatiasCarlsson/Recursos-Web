import { loadResourceFilters } from "@/api/api";
import ClientCard from "@/components/card/ClientCard";
import SearchBar from "@/components/SearchBar";
import ResourceFilters from "@/components/resource/ResourceFilters";

interface ResourcesPageProps {
  searchParams?: Promise<{
    categoryIds?: string;
    categoryId?: string;
    tagIds?: string;
    tagId?: string;
    priceModelIds?: string;
    priceModelId?: string;
    search?: string;
    page?: string;
  }>;
}

function parseIdList(raw?: string): number[] {
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value) && value > 0);
}

function toUnique(values: number[]): number[] {
  return [...new Set(values)];
}

function buildClientCardKey({
  categoryIds,
  tagIds,
  priceModelIds,
  search,
  page,
}: {
  categoryIds: number[];
  tagIds: number[];
  priceModelIds: number[];
  search?: string;
  page: number;
}) {
  const params = new URLSearchParams();

  if (search?.trim()) params.set("search", search.trim());
  if (categoryIds.length) params.set("categoryIds", categoryIds.join(","));
  if (tagIds.length) params.set("tagIds", tagIds.join(","));
  if (priceModelIds.length) params.set("priceModelIds", priceModelIds.join(","));
  if (page > 1) params.set("page", String(page));

  return params.toString() || "default";
}

export default async function Resources({ searchParams }: ResourcesPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const categoryIdsParam = params?.categoryIds;
  const categoryIdParam = params?.categoryId;
  const tagIdsParam = params?.tagIds;
  const tagIdParam = params?.tagId;
  const priceModelIdsParam = params?.priceModelIds;
  const priceModelIdParam = params?.priceModelId;
  const searchParam = params?.search?.trim();
  const pageParam = params?.page;

  const filters = await loadResourceFilters();

  const selectedCategoryIds = toUnique([
    ...parseIdList(categoryIdsParam),
    ...(categoryIdParam && Number.isInteger(Number(categoryIdParam)) && Number(categoryIdParam) > 0
      ? [Number(categoryIdParam)]
      : []),
  ]);
  const selectedTagIds = toUnique([
    ...parseIdList(tagIdsParam),
    ...(tagIdParam && Number.isInteger(Number(tagIdParam)) && Number(tagIdParam) > 0
      ? [Number(tagIdParam)]
      : []),
  ]);
  const selectedPriceModelIds = toUnique([
    ...parseIdList(priceModelIdsParam),
    ...(priceModelIdParam &&
    Number.isInteger(Number(priceModelIdParam)) &&
    Number(priceModelIdParam) > 0
      ? [Number(priceModelIdParam)]
      : []),
  ]);
  const currentPage = pageParam && Number.isInteger(Number(pageParam)) ? Number(pageParam) : 1;
  const clientCardKey = buildClientCardKey({
    categoryIds: selectedCategoryIds,
    tagIds: selectedTagIds,
    priceModelIds: selectedPriceModelIds,
    search: searchParam,
    page: currentPage,
  });

  return (
    <main>
      <h1 className="text-3xl mt-10 text-center font-bold w-full">Recursos</h1>
      <section className="flex justify-center mt-6">
        <SearchBar categories={filters.categories} tags={filters.tags} />
      </section>

      <section className="mt-8 grid gap-6 px-4 lg:grid-cols-[280px_1fr] lg:px-6">
        <div className="lg:sticky lg:top-4 lg:h-fit">
          <ResourceFilters
            categories={filters.categories}
            tags={filters.tags}
            priceModels={filters.priceModels}
            selectedCategoryIds={selectedCategoryIds}
            selectedTagIds={selectedTagIds}
            selectedPriceModelIds={selectedPriceModelIds}
            search={searchParam}
          />
        </div>

        <ClientCard
          key={clientCardKey}
          categoryIds={selectedCategoryIds.length ? selectedCategoryIds : undefined}
          tagIds={selectedTagIds.length ? selectedTagIds : undefined}
          priceModelIds={selectedPriceModelIds.length ? selectedPriceModelIds : undefined}
          search={searchParam}
          page={currentPage}
        />
      </section>
    </main>
  );
}

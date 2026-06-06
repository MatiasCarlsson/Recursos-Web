import { useEffect, useMemo, useState } from "react";

export interface SearchCategory {
  id: number;
  label: string;
  description?: string;
}

export interface SearchTag {
  id: number;
  label: string;
  description?: string;
}

interface UseSearchOptions {
  categories?: SearchCategory[];
  tags?: SearchTag[];
  fetchCategories?: boolean;
  fetchTags?: boolean;
  categoriesEndpoint?: string;
  tagsEndpoint?: string;
}

function useSearch(options: UseSearchOptions) {
  const [query, setQuery] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [categoriesState, setCategoriesState] = useState<SearchCategory[]>(
    options.categories ?? [],
  );
  const [tagsState, setTagsState] = useState<SearchTag[]>(options.tags ?? []);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [filtersError, setFiltersError] = useState<string | null>(null);

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) {
      return categoriesState;
    }

    return categoriesState.filter((category) => {
      const label = category.label.toLowerCase();
      const description = category.description?.toLowerCase() ?? "";

      return label.includes(normalizedQuery) || description.includes(normalizedQuery);
    });
  }, [categoriesState, normalizedQuery]);

  const filteredTags = useMemo(() => {
    if (!normalizedQuery) {
      return tagsState;
    }

    return tagsState.filter((tag) => {
      const label = tag.label.toLowerCase();
      const description = tag.description?.toLowerCase() ?? "";

      return label.includes(normalizedQuery) || description.includes(normalizedQuery);
    });
  }, [normalizedQuery, tagsState]);

  const shouldFetchFilters = Boolean(options.fetchCategories || options.fetchTags);
  const categoriesEndpoint =
    options.categoriesEndpoint ?? "/api/categories?limit=100&sortBy=nombre&sort=asc";
  const tagsEndpoint = options.tagsEndpoint ?? "/api/tags?limit=100&sortBy=nombre&sort=asc";

  function sortTagsWithOtraLast(input: SearchTag[]) {
    const normalized = input.map((tag) => ({
      ...tag,
      normalizedLabel: tag.label.trim().toLowerCase(),
    }));

    normalized.sort((a, b) => {
      const aIsOtra = a.normalizedLabel === "otra";
      const bIsOtra = b.normalizedLabel === "otra";

      if (aIsOtra && !bIsOtra) return 1;
      if (!aIsOtra && bIsOtra) return -1;
      return a.label.localeCompare(b.label, "es", { sensitivity: "base" });
    });

    return normalized.map((tag) => ({
      id: tag.id,
      label: tag.label,
      description: tag.description,
    }));
  }

  useEffect(() => {
    setCategoriesState(options.categories ?? []);
  }, [options.categories]);

  useEffect(() => {
    setTagsState(sortTagsWithOtraLast(options.tags ?? []));
  }, [options.tags]);

  useEffect(() => {
    if (!shouldFetchFilters) {
      return;
    }

    let isMounted = true;

    async function fetchFilters() {
      setIsLoadingFilters(true);
      setFiltersError(null);

      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          options.fetchCategories ? fetch(categoriesEndpoint) : Promise.resolve(null),
          options.fetchTags ? fetch(tagsEndpoint) : Promise.resolve(null),
        ]);

        if (!isMounted) {
          return;
        }

        if (categoriesResponse && !categoriesResponse.ok) {
          throw new Error("No se pudieron cargar las categorias.");
        }

        if (tagsResponse && !tagsResponse.ok) {
          throw new Error("No se pudieron cargar las etiquetas.");
        }

        if (categoriesResponse) {
          const categoriesPayload = (await categoriesResponse.json()) as {
            data?: Array<{
              id_categoria: number;
              nombre: string | null;
              descripcion?: string | null;
            }>;
          };

          const mappedCategories = (categoriesPayload.data ?? [])
            .filter((item) => Boolean(item.nombre))
            .map((item) => ({
              id: item.id_categoria,
              label: item.nombre as string,
              description: item.descripcion ?? undefined,
            }));

          setCategoriesState(mappedCategories);
        }

        if (tagsResponse) {
          const tagsPayload = (await tagsResponse.json()) as {
            data?: Array<{
              id_etiqueta: number;
              nombre: string | null;
              descripcion?: string | null;
            }>;
          };

          const mappedTags = (tagsPayload.data ?? [])
            .filter((item) => Boolean(item.nombre))
            .map((item) => ({
              id: item.id_etiqueta,
              label: item.nombre as string,
              description: item.descripcion ?? undefined,
            }));

          setTagsState(sortTagsWithOtraLast(mappedTags));
        }
      } catch (error) {
        if (isMounted) {
          setFiltersError(error instanceof Error ? error.message : "Error cargando filtros.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingFilters(false);
        }
      }
    }

    void fetchFilters();

    return () => {
      isMounted = false;
    };
  }, [
    categoriesEndpoint,
    options.fetchCategories,
    options.fetchTags,
    shouldFetchFilters,
    tagsEndpoint,
  ]);

  function openPanel() {
    setIsPanelOpen(true);
  }

  function closePanel() {
    setIsPanelOpen(false);
  }

  function selectCategory(category: SearchCategory) {
    setSelectedCategoryId((previous) => (previous === category.id ? null : category.id));
    setIsPanelOpen(false);
  }

  function clearCategory() {
    setSelectedCategoryId(null);
  }

  function toggleTag(tag: SearchTag) {
    setSelectedTagIds((prev) =>
      prev.includes(tag.id) ? prev.filter((tagId) => tagId !== tag.id) : [...prev, tag.id],
    );
  }

  const selectedTags = useMemo(
    () => tagsState.filter((tag) => selectedTagIds.includes(tag.id)),
    [selectedTagIds, tagsState],
  );

  return {
    query,
    setQuery,
    isPanelOpen,
    openPanel,
    closePanel,
    selectedCategoryId,
    selectedTagIds,
    categories: categoriesState,
    tags: tagsState,
    filteredCategories,
    filteredTags,
    selectedTags,
    isLoadingFilters,
    filtersError,
    selectCategory,
    clearCategory,
    toggleTag,
  };
}

export default useSearch;

import { ResourceService } from "@/modules/resources/resource.service";
import { Resource } from "@/types/resource";
import { resolveResourcePreviewImage } from "@/lib/resource-preview-cache";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const service = new ResourceService();

export interface SearchCategoryOption {
  id: number;
  label: string;
}

export interface SearchTagOption {
  id: number;
  label: string;
}

export interface PriceModelOption {
  id: number;
  label: string;
}

export interface ResourceFilterOptions {
  categories: SearchCategoryOption[];
  tags: SearchTagOption[];
  priceModels: PriceModelOption[];
}

export interface HomeMetrics {
  resourceCount: number;
  categoryCount: number;
  tagCount: number;
}

interface LoadResourcesFilters {
  categoryIds?: number[];
  tagIds?: number[];
  priceModelIds?: number[];
  search?: string;
}

export interface PaginatedResources {
  data: Resource[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

async function mapResourcesToViewModel(
  resources: Awaited<ReturnType<ResourceService["getAllResource"]>>,
): Promise<Resource[]> {
  return await Promise.all(
    resources.map(async (item) => {
      const title = item.nombre ?? `Recurso #${item.id_recurso}`;
      const preview = await resolveResourcePreviewImage({
        resourceId: item.id_recurso,
        rawUrl: item.url,
        title,
      });

      return {
        id: item.id_recurso,
        title,
        url: preview.resourceUrl,
        content: item.descripcion ?? "Sin descripción",
        image: preview.imageUrl,
        categoryId: item.id_categoria ?? null,
        category: item.categoria?.nombre ?? "Sin categoría",
        isFeatured: item.destacado,
        createdAt: item.creado?.toISOString(),
        tags:
          item.recurso_etiqueta
            ?.map((relation) => relation.etiqueta?.nombre)
            .filter((name): name is string => Boolean(name)) ?? [],
      };
    }),
  );
}

async function fetchResources(filters?: LoadResourcesFilters): Promise<Resource[]> {
  const normalizedSearch = filters?.search?.trim();
  const hasSearch = Boolean(normalizedSearch);
  const hasCategory = Boolean(filters?.categoryIds?.length);
  const hasTag = Boolean(filters?.tagIds?.length);
  const hasPriceModel = Boolean(filters?.priceModelIds?.length);

  if (hasSearch || hasCategory || hasTag || hasPriceModel) {
    const result = await service.getResourcesPaginated({
      page: 1,
      limit: 200,
      search: normalizedSearch,
      categoriaIds: filters?.categoryIds,
      etiquetaIds: filters?.tagIds,
      modeloPrecioIds: filters?.priceModelIds,
      sortBy: "creado",
      sort: "desc",
    });

    return await mapResourcesToViewModel(result.data);
  }

  const resources = await service.getAllResource();

  return await mapResourcesToViewModel(resources);
}

export async function loadResourcesPaginated(
  filters?: LoadResourcesFilters & { page?: number; limit?: number },
): Promise<PaginatedResources> {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 15;

  const normalizedSearch = filters?.search?.trim();
  const hasSearch = Boolean(normalizedSearch);
  const hasCategory = Boolean(filters?.categoryIds?.length);
  const hasTag = Boolean(filters?.tagIds?.length);
  const hasPriceModel = Boolean(filters?.priceModelIds?.length);

  if (hasSearch || hasCategory || hasTag || hasPriceModel) {
    const result = await service.getResourcesPaginated({
      page,
      limit,
      search: normalizedSearch,
      categoriaIds: filters?.categoryIds,
      etiquetaIds: filters?.tagIds,
      modeloPrecioIds: filters?.priceModelIds,
      sortBy: "creado",
      sort: "desc",
    });

    const data = await mapResourcesToViewModel(result.data);
    return { data, pagination: result.pagination };
  }

  const result = await service.getResourcesPaginated({
    page,
    limit,
    sortBy: "creado",
    sort: "desc",
  });
  const data = await mapResourcesToViewModel(result.data);
  return { data, pagination: result.pagination };
}

const loadResourcesCached = unstable_cache(fetchResources, ["resources:list:v2"], {
  revalidate: 60 * 10,
  tags: ["resources"],
});

export async function loadResources(filters?: LoadResourcesFilters): Promise<Resource[]> {
  if (
    filters?.search?.trim() ||
    filters?.categoryIds?.length ||
    filters?.tagIds?.length ||
    filters?.priceModelIds?.length
  ) {
    return fetchResources(filters);
  }

  return loadResourcesCached();
}

async function fetchSearchCategories(): Promise<SearchCategoryOption[]> {
  const categories = await prisma.categoria.findMany({
    where: {
      recursos: {
        some: {},
      },
    },
    orderBy: {
      nombre: "asc",
    },
    select: {
      id_categoria: true,
      nombre: true,
    },
  });

  return categories
    .filter((category) => Boolean(category.nombre))
    .map((category) => ({
      id: category.id_categoria,
      label: category.nombre as string,
    }));
}

const loadSearchCategoriesCached = unstable_cache(fetchSearchCategories, ["categories:search"], {
  revalidate: 60 * 10,
  tags: ["categories"],
});

export async function loadSearchCategories(): Promise<SearchCategoryOption[]> {
  return loadSearchCategoriesCached();
}

async function fetchResourceFilters(): Promise<ResourceFilterOptions> {
  const [categories, tags, priceModels] = await Promise.all([
    prisma.categoria.findMany({
      where: {
        recursos: {
          some: {},
        },
      },
      orderBy: {
        nombre: "asc",
      },
      select: {
        id_categoria: true,
        nombre: true,
      },
    }),
    prisma.etiqueta.findMany({
      where: {
        recurso_etiqueta: {
          some: {},
        },
      },
      orderBy: {
        nombre: "asc",
      },
      select: {
        id_etiqueta: true,
        nombre: true,
      },
    }),
    prisma.modeloPrecio.findMany({
      orderBy: {
        nombre: "asc",
      },
      select: {
        id_modelo_precio: true,
        nombre: true,
      },
    }),
  ]);

  return {
    categories: categories
      .filter((category) => Boolean(category.nombre))
      .map((category) => ({
        id: category.id_categoria,
        label: category.nombre as string,
      })),
    tags: tags
      .filter((tag) => Boolean(tag.nombre))
      .map((tag) => ({
        id: tag.id_etiqueta,
        label: tag.nombre as string,
      })),
    priceModels: priceModels
      .filter((priceModel) => Boolean(priceModel.nombre))
      .map((priceModel) => ({
        id: priceModel.id_modelo_precio,
        label: priceModel.nombre as string,
      })),
  };
}

const loadResourceFiltersCached = unstable_cache(fetchResourceFilters, ["resources:filters:v1"], {
  revalidate: 60 * 10,
  tags: ["categories", "tags", "price-models"],
});

export async function loadResourceFilters(): Promise<ResourceFilterOptions> {
  return loadResourceFiltersCached();
}

function getCurrentWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = (day + 6) % 7;

  const start = new Date(now);
  start.setDate(now.getDate() - diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

async function fetchHomeMetrics(): Promise<HomeMetrics> {
  const [resourceCount, categoryCount, tagCount] = await Promise.all([
    prisma.recurso.count(),
    prisma.categoria.count(),
    prisma.etiqueta.count(),
  ]);

  return {
    resourceCount,
    categoryCount,
    tagCount,
  };
}

const loadHomeMetricsCached = unstable_cache(fetchHomeMetrics, ["home:metrics:v1"], {
  revalidate: 60 * 10,
  tags: ["resources", "categories", "tags"],
});

export async function loadHomeMetrics(): Promise<HomeMetrics> {
  return loadHomeMetricsCached();
}

async function fetchFeaturedResources(): Promise<Resource[]> {
  const featured = await service.getFeaturedResources(6);

  if (featured.length) {
    return await mapResourcesToViewModel(featured);
  }

  const fallback = await service.getLatestResources(6);
  return await mapResourcesToViewModel(fallback);
}

const loadFeaturedResourcesCached = unstable_cache(fetchFeaturedResources, ["home:featured:v1"], {
  revalidate: 60 * 10,
  tags: ["resources"],
});

export async function loadFeaturedResources(): Promise<Resource[]> {
  return loadFeaturedResourcesCached();
}

async function fetchRecentWeeklyResources(): Promise<Resource[]> {
  const { start, end } = getCurrentWeekRange();
  const weekly = await service.getRecentResourcesInRange(start, end, 7);

  if (weekly.length >= 7) {
    return await mapResourcesToViewModel(weekly.slice(0, 7));
  }

  const weeklyIds = weekly.map((item) => item.id_recurso);
  const needed = 7 - weekly.length;
  const fallback = await service.getLatestResources(needed, weeklyIds);
  const merged = [...weekly, ...fallback].slice(0, 7);

  return await mapResourcesToViewModel(merged);
}

const loadRecentWeeklyResourcesCached = unstable_cache(
  fetchRecentWeeklyResources,
  ["home:recent-weekly:v1"],
  {
    revalidate: 60 * 5,
    tags: ["resources"],
  },
);

export async function loadRecentWeeklyResources(): Promise<Resource[]> {
  return loadRecentWeeklyResourcesCached();
}

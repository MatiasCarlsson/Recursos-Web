"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ResourceCard from "./ResourceCard";
import type { PaginatedResources } from "@/api/api";
import type { Resource } from "@/types/resource";

interface ClientCardProps {
  categoryIds?: number[];
  tagIds?: number[];
  priceModelIds?: number[];
  search?: string;
  page?: number;
}

type ResourcesCacheEntry = {
  resources: Resource[];
  pagination: PaginatedResources["pagination"] | null;
  cachedAt: number;
};

const CACHE_PREFIX = "resources:list-cache:v1";

function buildCacheKey({ categoryIds, tagIds, priceModelIds, search, page }: ClientCardProps) {
  const params = new URLSearchParams();

  if (search?.trim()) params.set("search", search.trim());
  if (categoryIds?.length) params.set("categoryIds", categoryIds.join(","));
  if (tagIds?.length) params.set("tagIds", tagIds.join(","));
  if (priceModelIds?.length) params.set("priceModelIds", priceModelIds.join(","));
  if (page && page > 1) params.set("page", String(page));

  return `${CACHE_PREFIX}:${params.toString() || "default"}`;
}

function readCachedResources(cacheKey: string): ResourcesCacheEntry | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(cacheKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ResourcesCacheEntry;
    if (!parsed || !Array.isArray(parsed.resources)) return null;

    return parsed;
  } catch {
    return null;
  }
}

function writeCachedResources(cacheKey: string, value: ResourcesCacheEntry) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(cacheKey, JSON.stringify(value));
  } catch {
    // Ignore quota or serialization failures.
  }
}

function buildQuery({ categoryIds, tagIds, priceModelIds, search, page }: ClientCardProps) {
  const q = new URLSearchParams();
  if (search) q.set("search", search);
  if (categoryIds && categoryIds.length) q.set("categoryIds", categoryIds.join(","));
  if (tagIds && tagIds.length) q.set("tagIds", tagIds.join(","));
  if (priceModelIds && priceModelIds.length) q.set("priceModelIds", priceModelIds.join(","));
  if (page && page > 1) q.set("page", String(page));
  const s = q.toString();
  return s ? `/resource?${s}` : "/resource";
}

export default function ClientCard({
  categoryIds,
  tagIds,
  priceModelIds,
  search,
  page = 1,
}: ClientCardProps) {
  const cacheKey = buildCacheKey({ categoryIds, tagIds, priceModelIds, search, page });
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [pagination, setPagination] = useState<PaginatedResources["pagination"] | null>(null);
  const preloadedImagesRef = useRef(new Set<string>());
  const hasCachedDataRef = useRef(false);
  const hasActiveFilters =
    Boolean(search?.trim()) ||
    Boolean(categoryIds?.length) ||
    Boolean(tagIds?.length) ||
    Boolean(priceModelIds?.length);
  const categoryIdsKey = categoryIds?.join(",") ?? "";
  const tagIdsKey = tagIds?.join(",") ?? "";
  const priceModelIdsKey = priceModelIds?.join(",") ?? "";

  useEffect(() => {
    let mounted = true;
    const cachedResources = readCachedResources(cacheKey);
    hasCachedDataRef.current = Boolean(cachedResources?.resources.length);

    const hydrateFromCache = () => {
      if (!mounted || !cachedResources) return;

      setResources(cachedResources.resources);
      setPagination(cachedResources.pagination ?? null);
      setLoading(false);
    };

    const hydrateTimerId = window.setTimeout(hydrateFromCache, 0);

    const runFetch = () => {
      const q = new URLSearchParams();
      q.set("limit", "18");
      q.set("page", String(page ?? 1));
      if (search) q.set("search", String(search));
      if (categoryIds && categoryIds.length) q.set("categoryIds", categoryIds.join(","));
      if (tagIds && tagIds.length) q.set("tagIds", tagIds.join(","));
      if (priceModelIds && priceModelIds.length) q.set("priceModelIds", priceModelIds.join(","));

      fetch(`/api/resources?${q.toString()}`)
        .then((res) => res.json() as Promise<Resource[] | PaginatedResources>)
        .then((payload) => {
          if (!mounted) return;

          const nextResources = Array.isArray(payload) ? payload : payload.data || [];
          const nextPagination = Array.isArray(payload) ? null : payload.pagination || null;

          setResources(nextResources);
          setPagination(nextPagination);
          writeCachedResources(cacheKey, {
            resources: nextResources,
            pagination: nextPagination,
            cachedAt: Date.now(),
          });

          // Precargar la siguiente página en segundo plano para que al
          // avanzar ya esté en cache y la transición sea inmediata.
          prefetchNextPage(nextPagination);
        })
        .catch(() => {
          if (!mounted) return;
          if (!hasCachedDataRef.current) {
            setResources([]);
            setPagination(null);
          }
        })
        .finally(() => {
          if (!mounted) return;
          setLoading(false);
        });
    };

    const prefetchNextPage = (currentPagination: PaginatedResources["pagination"] | null) => {
      if (!currentPagination?.hasNextPage) return;

      const nextPage = (currentPagination.currentPage || page || 1) + 1;
      const nextCacheKey = buildCacheKey({
        categoryIds,
        tagIds,
        priceModelIds,
        search,
        page: nextPage,
      });

      // Si ya la tenemos cacheada, solo precargamos sus imágenes.
      const cached = readCachedResources(nextCacheKey);
      if (cached?.resources.length) {
        preloadImages(cached.resources);
        return;
      }

      const q = new URLSearchParams();
      q.set("limit", "18");
      q.set("page", String(nextPage));
      if (search) q.set("search", String(search));
      if (categoryIds && categoryIds.length) q.set("categoryIds", categoryIds.join(","));
      if (tagIds && tagIds.length) q.set("tagIds", tagIds.join(","));
      if (priceModelIds && priceModelIds.length) q.set("priceModelIds", priceModelIds.join(","));

      fetch(`/api/resources?${q.toString()}`)
        .then((res) => res.json() as Promise<Resource[] | PaginatedResources>)
        .then((payload) => {
          const nextResources = Array.isArray(payload) ? payload : payload.data || [];
          const nextPagination = Array.isArray(payload) ? null : payload.pagination || null;

          writeCachedResources(nextCacheKey, {
            resources: nextResources,
            pagination: nextPagination,
            cachedAt: Date.now(),
          });
          preloadImages(nextResources);
        })
        .catch(() => {
          // Falla silenciosa: se reintentará al navegar.
        });
    };

    const preloadImages = (items: Resource[]) => {
      const urls = items
        .map((resource) => resource?.image)
        .filter((image): image is string => typeof image === "string" && image.trim().length > 0)
        .slice(0, 12);

      const queue = urls.filter((image) => {
        if (preloadedImagesRef.current.has(image)) return false;
        preloadedImagesRef.current.add(image);
        return true;
      });

      queue.forEach((imageUrl) => {
        const image = new window.Image();
        image.decoding = "async";
        image.loading = "eager";
        image.src = imageUrl;
      });
    };

    const cancel =
      typeof window.requestIdleCallback === "function"
        ? (() => {
            const idleId = window.requestIdleCallback(runFetch);
            return () => {
              if (typeof window.cancelIdleCallback === "function") {
                window.cancelIdleCallback(idleId);
              }
            };
          })()
        : (() => {
            const timeoutId = window.setTimeout(runFetch, 120);
            return () => window.clearTimeout(timeoutId);
          })();

    return () => {
      mounted = false;
      window.clearTimeout(hydrateTimerId);
      cancel();
    };
  }, [
    cacheKey,
    categoryIds,
    categoryIdsKey,
    tagIds,
    tagIdsKey,
    priceModelIds,
    priceModelIdsKey,
    search,
    page,
  ]);

  if (loading) {
    return (
      <section className="w-full">
        <article className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 18 }).map((_, index) => (
            <div
              key={index}
              className="h-72 rounded-2xl border border-slate-800 bg-slate-900/60 animate-pulse"
            />
          ))}
        </article>
      </section>
    );
  }

  if (!resources.length) {
    return (
      <section className="w-full">
        <article className="mt-4 rounded-2xl border border-border/70 bg-cardBackground/70 p-6 text-center">
          <h2 className="text-lg font-semibold text-textPrimary">
            No hay resultados para esos filtros
          </h2>
          <p className="mt-2 text-sm text-textSecondary">
            Prueba con otra combinacion de categoria y etiqueta o limpia algunos filtros.
          </p>
          {hasActiveFilters ? (
            <a
              href="/resource"
              className="mt-4 inline-flex rounded-lg border border-border/80 px-3 py-2 text-sm text-textSecondary transition hover:border-buttonColor/50 hover:text-textPrimary"
            >
              Ver todos los recursos
            </a>
          ) : null}
        </article>
      </section>
    );
  }

  return (
    <section className="w-full">
      <article className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {resources.map((resource, index) => (
          <ResourceCard
            key={resource.id ?? `resource-${index}`}
            resource={resource}
            prioritizeImage={index < 6}
          />
        ))}
      </article>

      {pagination ? (
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            href={buildQuery({
              categoryIds,
              tagIds,
              priceModelIds,
              search,
              page: (pagination.currentPage || page || 1) - 1,
            })}
            className={`bg-buttonColor text-buttonText px-3 py-2 rounded-lg border ${pagination.hasPreviousPage ? "" : "opacity-40 pointer-events-none"}`}
          >
            Anterior
          </Link>

          <span className="px-3 py-2 text-sm text-textSecondary">
            Página {pagination.currentPage || page || 1} / {pagination.totalPages}
          </span>

          <Link
            href={buildQuery({
              categoryIds,
              tagIds,
              priceModelIds,
              search,
              page: (pagination.currentPage || page || 1) + 1,
            })}
            className={`bg-buttonColor text-buttonText px-3 py-2 rounded-lg border ${pagination.hasNextPage ? "" : "opacity-40 pointer-events-none"}`}
          >
            Siguiente
          </Link>
        </div>
      ) : null}
    </section>
  );
}

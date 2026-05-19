"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ResourceCard from "./ResourceCard";

interface ClientCardProps {
  categoryIds?: number[];
  tagIds?: number[];
  priceModelIds?: number[];
  search?: string;
  page?: number;
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
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any | null>(null);
  const preloadedImagesRef = useRef(new Set<string>());
  const hasActiveFilters =
    Boolean(search?.trim()) ||
    Boolean(categoryIds?.length) ||
    Boolean(tagIds?.length) ||
    Boolean(priceModelIds?.length);

  useEffect(() => {
    if (hasActiveFilters) {
      setShouldLoad(true);
      return;
    }

    let idleId: number | null = null;

    function onLoad() {
      // Prefer requestIdleCallback to avoid blocking with heavy fetches
      if (typeof (window as any).requestIdleCallback === "function") {
        idleId = (window as any).requestIdleCallback(() => setShouldLoad(true));
      } else {
        // Fallback small delay
        idleId = window.setTimeout(() => setShouldLoad(true), 200);
      }
    }

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      if (idleId !== null) {
        if (typeof (window as any).cancelIdleCallback === "function") {
          (window as any).cancelIdleCallback(idleId);
        } else {
          clearTimeout(idleId);
        }
      }
      window.removeEventListener("load", onLoad);
    };
  }, [hasActiveFilters]);

  useEffect(() => {
    if (!shouldLoad) return;

    let mounted = true;
    setLoading(true);

    const q = new URLSearchParams();
    q.set("limit", "15");
    q.set("page", String(page ?? 1));
    if (search) q.set("search", String(search));
    if (categoryIds && categoryIds.length) q.set("categoryIds", categoryIds.join(","));
    if (tagIds && tagIds.length) q.set("tagIds", tagIds.join(","));
    if (priceModelIds && priceModelIds.length) q.set("priceModelIds", priceModelIds.join(","));

    fetch(`/api/resources?${q.toString()}`)
      .then((res) => res.json())
      .then((payload) => {
        if (!mounted) return;
        // Accept both { data, pagination } and legacy arrays
        if (Array.isArray(payload)) {
          setResources(payload);
          setPagination(null);
        } else if (payload && payload.data) {
          setResources(payload.data || []);
          setPagination(payload.pagination || null);
        } else {
          setResources([]);
          setPagination(null);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setResources([]);
        setPagination(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [
    shouldLoad,
    categoryIds?.join(","),
    tagIds?.join(","),
    priceModelIds?.join(","),
    search,
    page,
  ]);

  useEffect(() => {
    if (!shouldLoad || !resources.length) return;

    const urlsToPreload = resources
      .map((resource) => resource?.image)
      .filter((image): image is string => typeof image === "string" && image.trim().length > 0)
      .slice(0, 12);

    if (!urlsToPreload.length) return;

    const preloadQueue = urlsToPreload.filter((image) => {
      if (preloadedImagesRef.current.has(image)) {
        return false;
      }

      preloadedImagesRef.current.add(image);
      return true;
    });

    if (!preloadQueue.length) return;

    const preload = () => {
      preloadQueue.forEach((imageUrl) => {
        const image = new window.Image();
        image.decoding = "async";
        image.loading = "eager";
        image.src = imageUrl;
      });
    };

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(preload);
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(preload, 0);
    return () => window.clearTimeout(timeoutId);
  }, [resources, shouldLoad]);

  if (!shouldLoad || loading) {
    return (
      <section className="w-full">
        <article className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
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
      <article className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
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

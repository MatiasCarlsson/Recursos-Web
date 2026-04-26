import ResourceCard from "./ResourceCard";
import { loadResourcesPaginated } from "@/api/api";

interface CardProps {
  categoryIds?: number[];
  tagIds?: number[];
  priceModelIds?: number[];
  search?: string;
  page?: number;
}

function buildQuery({ categoryIds, tagIds, priceModelIds, search, page }: CardProps) {
  const q = new URLSearchParams();
  if (search) q.set("search", search);
  if (categoryIds && categoryIds.length) q.set("categoryIds", categoryIds.join(","));
  if (tagIds && tagIds.length) q.set("tagIds", tagIds.join(","));
  if (priceModelIds && priceModelIds.length) q.set("priceModelIds", priceModelIds.join(","));
  if (page && page > 1) q.set("page", String(page));
  const s = q.toString();
  return s ? `/resource?${s}` : "/resource";
}

export default async function Card({
  categoryIds,
  tagIds,
  priceModelIds,
  search,
  page = 1,
}: CardProps) {
  const result = await loadResourcesPaginated({
    categoryIds,
    tagIds,
    priceModelIds,
    search,
    page,
    limit: 15,
  });
  const resources = result.data;
  const pagination = result.pagination;
  const hasActiveFilters =
    Boolean(search?.trim()) ||
    Boolean(categoryIds?.length) ||
    Boolean(tagIds?.length) ||
    Boolean(priceModelIds?.length);

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
          <ResourceCard key={resource.id} resource={resource} prioritizeImage={index < 6} />
        ))}
      </article>

      <div className="mt-6 flex items-center justify-center gap-4">
        <a
          href={buildQuery({
            categoryIds,
            tagIds,
            priceModelIds,
            search,
            page: pagination.currentPage - 1,
          })}
          className={`bg-buttonColor text-buttonText px-3 py-2 rounded-lg border ${pagination.hasPreviousPage ? "" : "opacity-40 pointer-events-none"}`}
        >
          Anterior
        </a>

        <span className="px-3 py-2 text-sm text-textSecondary">
          Página {pagination.currentPage} / {pagination.totalPages}
        </span>

        <a
          href={buildQuery({
            categoryIds,
            tagIds,
            priceModelIds,
            search,
            page: pagination.currentPage + 1,
          })}
          className={`bg-buttonColor text-buttonText px-3 py-2 rounded-lg border ${pagination.hasNextPage ? "" : "opacity-40 pointer-events-none"}`}
        >
          Siguiente
        </a>
      </div>
    </section>
  );
}

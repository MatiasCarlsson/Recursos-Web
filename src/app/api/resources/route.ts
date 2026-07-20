import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { resourcesQuerySchema } from "@/modules/resources/schemas/resource.query.schema";
import { toErrorResponse } from "@/lib/api-error-response";
import { loadResourcesPaginated } from "@/api/api";

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

// Get all resources (GET /api/resources)
export async function GET(request: Request) {
  try {
    const rawQuery = Object.fromEntries(new URL(request.url).searchParams.entries());
    const query = resourcesQuerySchema.parse(rawQuery);

    const categoryIds = toUnique([
      ...parseIdList(rawQuery.categoryIds),
      ...(query.categoriaId ? [query.categoriaId] : []),
    ]);
    const tagIds = toUnique([
      ...parseIdList(rawQuery.tagIds),
      ...(query.etiquetaId ? [query.etiquetaId] : []),
    ]);
    const priceModelIds = toUnique([
      ...parseIdList(rawQuery.priceModelIds),
      ...(query.modeloPrecioId ? [query.modeloPrecioId] : []),
    ]);

    const result = await loadResourcesPaginated({
      page: query.page,
      limit: query.limit,
      search: query.search,
      categoryIds: categoryIds.length ? categoryIds : undefined,
      tagIds: tagIds.length ? tagIds : undefined,
      priceModelIds: priceModelIds.length ? priceModelIds : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

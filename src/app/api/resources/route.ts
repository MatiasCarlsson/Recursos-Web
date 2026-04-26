import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { ResourceService } from "@/modules/resources/resource.service";
import { createResourceSchema } from "@/modules/resources/schemas/resource.create.schema";
import { resourcesQuerySchema } from "@/modules/resources/schemas/resource.query.schema";
import { toErrorResponse } from "@/lib/api-error-response";
import { requireAdmin } from "@/lib/require-admin";

const service = new ResourceService();

// Get all resources (GET /api/resources)
export async function GET(request: Request) {
  try {
    const rawQuery = Object.fromEntries(new URL(request.url).searchParams.entries());
    const query = resourcesQuerySchema.parse(rawQuery);

    const result = await service.getResourcesPaginated({
      page: query.page,
      limit: query.limit,
      search: query.search,
      destacado: query.destacado,
      categoriaId: query.categoriaId,
      modeloPrecioId: query.modeloPrecioId,
      etiquetaId: query.etiquetaId,
      sortBy: query.sortBy,
      sort: query.sort,
    });

    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

// Post a new resource (POST /api/resources)
export async function POST(request: Request) {
  try {
    // Solo un admin autenticado puede crear recursos.
    await requireAdmin();

    const body = await request.json();
    const data = createResourceSchema.parse(body);
    const resource = await service.createResource(data);
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

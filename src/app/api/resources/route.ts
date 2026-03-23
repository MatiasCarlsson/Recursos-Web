import { NextResponse } from "next/server";
import { ResourceService } from "@/modules/resources/resource.service";
import { createResourceSchema } from "@/modules/resources/schemas/resource.create.schema";
import { ZodError } from "zod";

const service = new ResourceService();

// Get all resources (GET /api/resources)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 10;
    const search = searchParams.get("search") || undefined;
    const categoriaId = searchParams.get("categoriaId")
      ? Number(searchParams.get("categoriaId"))
      : undefined;
    const modeloPrecioId = searchParams.get("modeloPrecioId")
      ? Number(searchParams.get("modeloPrecioId"))
      : undefined;
    const sortBy = (searchParams.get("sortBy") || "creado") as
      | "nombre"
      | "creado"
      | "actualizacion";
    const sort = (searchParams.get("sort") || "desc") as "asc" | "desc";

    // Validar parámetros
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json({ error: "Invalid pagination parameters" }, { status: 400 });
    }

    const result = await service.getResourcesPaginated({
      page,
      limit,
      search,
      categoriaId,
      modeloPrecioId,
      sortBy,
      sort,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: `Error fetching resources: ${message}` }, { status: 500 });
  }
}

// Post a new resource (POST /api/resources)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createResourceSchema.parse(body);
    const resource = await service.createResource(data);
    return NextResponse.json(resource, { status: 201 });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: "Invalid payload", details: e.issues }, { status: 400 });
    }

    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: `Error creating resource: ${message}` }, { status: 500 });
  }
}

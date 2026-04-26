import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { ResourceService } from "@/modules/resources/resource.service";
import { updateResourceSchema } from "@/modules/resources/schemas/resource.update.schema";
import { BadRequestError } from "@/lib/errors";
import { toErrorResponse } from "@/lib/api-error-response";
import { requireAdmin } from "@/lib/require-admin";

const service = new ResourceService();

function parseId(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestError("Invalid resource id");
  }

  return id;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Next entrega params como Promise en handlers dinámicos.
    const { id: rawId } = await params;
    const id = parseId(rawId);
    const recurso = await service.getResourceById(id);
    return NextResponse.json(recurso);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Solo un admin autenticado puede actualizar recursos.
    await requireAdmin();

    // Se valida el id de la URL y luego el body con Zod.
    const { id: rawId } = await params;
    const id = parseId(rawId);
    const body = await request.json();
    const data = updateResourceSchema.parse(body);
    const recurso = await service.updateResource(id, data);
    return NextResponse.json(recurso);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Solo un admin autenticado puede eliminar recursos.
    await requireAdmin();

    // Si el id es válido, se elimina y se devuelve 204 sin contenido.
    const { id: rawId } = await params;
    const id = parseId(rawId);
    await service.deleteResource(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

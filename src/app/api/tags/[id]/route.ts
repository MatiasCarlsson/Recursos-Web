import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api-error-response";
import { BadRequestError } from "@/lib/errors";
import { TagService } from "@/modules/tags/tags.service";
import { updateTagSchema } from "@/modules/tags/schemas/tag.update.schema";
import { requireAdmin } from "@/lib/require-admin";

const service = new TagService();

function parseId(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestError("Invalid tag id");
  }

  return id;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = parseId(rawId);
    const tag = await service.getTagById(id);

    return NextResponse.json(tag);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Solo un admin autenticado puede actualizar etiquetas.
    await requireAdmin();

    const { id: rawId } = await params;
    const id = parseId(rawId);
    const body = await request.json();
    const data = updateTagSchema.parse(body);
    const tag = await service.updateTag(id, data);

    return NextResponse.json(tag);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Solo un admin autenticado puede eliminar etiquetas.
    await requireAdmin();

    const { id: rawId } = await params;
    const id = parseId(rawId);
    await service.deleteTag(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

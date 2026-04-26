import { NextResponse } from "next/server";
import { CategoryService } from "@/modules/categories/categories.service";
import { updateCategorySchema } from "@/modules/categories/schemas/categories.update.schema";
import { BadRequestError } from "@/lib/errors";
import { toErrorResponse } from "@/lib/api-error-response";
import { requireAdmin } from "@/lib/require-admin";

const service = new CategoryService();

function parseId(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestError("Invalid category id");
  }

  return id;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = parseId(rawId);
    const category = await service.getCategoryById(id);
    return NextResponse.json(category);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Solo un admin autenticado puede actualizar categorías.
    await requireAdmin();

    const { id: rawId } = await params;
    const id = parseId(rawId);
    const body = await request.json();
    const data = updateCategorySchema.parse(body);
    const category = await service.updateCategory(id, data);
    return NextResponse.json(category);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Solo un admin autenticado puede eliminar categorías.
    await requireAdmin();

    const { id: rawId } = await params;
    const id = parseId(rawId);
    await service.deleteCategory(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

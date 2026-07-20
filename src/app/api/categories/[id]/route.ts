import { NextResponse } from "next/server";
import { CategoryService } from "@/modules/categories/categories.service";
import { BadRequestError } from "@/lib/errors";
import { toErrorResponse } from "@/lib/api-error-response";

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

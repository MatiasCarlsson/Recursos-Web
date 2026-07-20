import { NextResponse } from "next/server";
export const runtime = "nodejs";
import { ResourceService } from "@/modules/resources/resource.service";
import { BadRequestError } from "@/lib/errors";
import { toErrorResponse } from "@/lib/api-error-response";

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

import { NextResponse } from "next/server";
import { ResourceService } from "@/modules/resources/resource.service";
import { updateResourceSchema } from "@/modules/resources/schemas/resource.update.schema";
import { BadRequestError } from "@/lib/errors";
import { toErrorResponse } from "@/lib/api-error-response";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

const service = new ResourceService();

function parseId(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestError("Invalid resource id");
  }

  return id;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const { id: rawId } = await params;
    const resource = await service.getResourceById(parseId(rawId));

    return NextResponse.json(resource);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const { id: rawId } = await params;
    const body = await request.json();
    const data = updateResourceSchema.parse(body);
    const resource = await service.updateResource(parseId(rawId), data);

    return NextResponse.json(resource);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const { id: rawId } = await params;
    await service.deleteResource(parseId(rawId));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

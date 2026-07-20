import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api-error-response";
import { BadRequestError } from "@/lib/errors";
import { TagService } from "@/modules/tags/tags.service";

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

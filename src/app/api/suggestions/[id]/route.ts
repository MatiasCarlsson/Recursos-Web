import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api-error-response";
import { BadRequestError } from "@/lib/errors";
import { SuggestionService } from "@/modules/suggestions/suggestions.service";

const service = new SuggestionService();

function parseId(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestError("Invalid suggestion id");
  }

  return id;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = parseId(rawId);
    const suggestion = await service.getSuggestionById(id);

    return NextResponse.json(suggestion);
  } catch (error) {
    return toErrorResponse(error);
  }
}

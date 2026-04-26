import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api-error-response";
import { BadRequestError } from "@/lib/errors";
import { SuggestionService } from "@/modules/suggestions/suggestions.service";
import { updateSuggestionSchema } from "@/modules/suggestions/schemas/suggestion.update.schema";
import { requireAdmin } from "@/lib/require-admin";

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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Solo un admin autenticado puede actualizar sugerencias.
    await requireAdmin();

    const { id: rawId } = await params;
    const id = parseId(rawId);
    const body = await request.json();
    const data = updateSuggestionSchema.parse(body);
    const suggestion = await service.updateSuggestion(id, data);

    return NextResponse.json(suggestion);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Solo un admin autenticado puede eliminar sugerencias.
    await requireAdmin();

    const { id: rawId } = await params;
    const id = parseId(rawId);
    await service.deleteSuggestion(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

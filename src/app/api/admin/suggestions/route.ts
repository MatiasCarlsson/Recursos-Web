import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api-error-response";
import { SuggestionService } from "@/modules/suggestions/suggestions.service";
import { suggestionsQuerySchema } from "@/modules/suggestions/schemas/suggestion.query.schema";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

const service = new SuggestionService();

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const rawQuery = Object.fromEntries(new URL(request.url).searchParams.entries());
    const query = suggestionsQuerySchema.parse(rawQuery);
    const suggestions = await service.getSuggestionsPaginated(query);

    return NextResponse.json(suggestions);
  } catch (error) {
    return toErrorResponse(error);
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { toErrorResponse } from "@/lib/api-error-response";
import { SuggestionService } from "@/modules/suggestions/suggestions.service";
import { createSuggestionSchema } from "@/modules/suggestions/schemas/suggestion.create.schema";
import { suggestionsQuerySchema } from "@/modules/suggestions/schemas/suggestion.query.schema";
import { authOptions } from "@/lib/auth";
import { BadRequestError } from "@/lib/errors";
import { enforceSuggestionRateLimit } from "@/lib/suggestion-rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

const service = new SuggestionService();

export async function GET(request: Request) {
  try {
    const rawQuery = Object.fromEntries(new URL(request.url).searchParams.entries());
    const query = suggestionsQuerySchema.parse(rawQuery);
    const suggestions = await service.getSuggestionsPaginated(query);

    return NextResponse.json(suggestions);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = createSuggestionSchema.parse(body);

    // Honeypot anti-bot: si viene relleno, se rechaza como spam.
    if (data.website) {
      throw new BadRequestError("Solicitud invalida.");
    }

    const session = await getServerSession(authOptions);
    const isAdmin = Boolean(session?.user?.active && session.user.role === "admin");

    // Admin puede seguir creando sugerencias arbitrarias desde el panel.
    if (isAdmin) {
      const suggestion = await service.createSuggestion(data);
      return NextResponse.json(suggestion, { status: 201 });
    }

    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip");

    await verifyTurnstileToken({
      token: data.turnstileToken,
      remoteIp: clientIp,
    });

    enforceSuggestionRateLimit({
      ip: clientIp,
      email: data.emailContacto,
    });

    const suggestion = await service.createPublicSuggestion(data);

    return NextResponse.json(suggestion, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

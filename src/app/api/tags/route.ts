import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/api-error-response";
import { TagService } from "@/modules/tags/tags.service";
import { createTagSchema } from "@/modules/tags/schemas/tag.create.schema";
import { tagsQuerySchema } from "@/modules/tags/schemas/tag.query.schema";
import { requireAdmin } from "@/lib/require-admin";

const service = new TagService();

export async function GET(request: Request) {
  try {
    const rawQuery = Object.fromEntries(new URL(request.url).searchParams.entries());
    const query = tagsQuerySchema.parse(rawQuery);
    const result = await service.getTagsPaginated(query);

    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    // Solo un admin autenticado puede crear etiquetas.
    await requireAdmin();

    const body = await request.json();
    const data = createTagSchema.parse(body);
    const tag = await service.createTag(data);

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

import { NextResponse } from "next/server";
import { CategoryService } from "@/modules/categories/categories.service";
import { createCategorySchema } from "@/modules/categories/schemas/categories.create.schema";
import { categoriesQuerySchema } from "@/modules/categories/schemas/categories.query.schema";
import { toErrorResponse } from "@/lib/api-error-response";
import { requireAdmin } from "@/lib/require-admin";

const service = new CategoryService();

export async function GET(request: Request) {
  try {
    const rawQuery = Object.fromEntries(new URL(request.url).searchParams.entries());
    const query = categoriesQuerySchema.parse(rawQuery);

    const categories = await service.getCategoriesPaginated(query);
    return NextResponse.json(categories);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    // Solo un admin autenticado puede crear categorías.
    await requireAdmin();

    const body = await request.json();
    const data = createCategorySchema.parse(body);
    const category = await service.createCategory(data);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

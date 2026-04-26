import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { toErrorResponse } from "@/lib/api-error-response";
import { BadRequestError } from "@/lib/errors";
import { requireAdmin } from "@/lib/require-admin";

function parseNombre(value: unknown) {
  if (typeof value !== "string") {
    throw new BadRequestError("Invalid nombre");
  }

  const nombre = value.trim();
  if (!nombre) {
    throw new BadRequestError("nombre is required");
  }

  return nombre;
}

export async function GET() {
  try {
    const data = await prisma.modeloPrecio.findMany({
      orderBy: { nombre: "asc" },
      select: {
        id_modelo_precio: true,
        nombre: true,
      },
    });

    return NextResponse.json({ data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    // Solo un admin autenticado puede crear modelos de precio.
    await requireAdmin();

    const body = (await request.json()) as { nombre?: unknown };
    const nombre = parseNombre(body.nombre);

    const model = await prisma.modeloPrecio.create({
      data: { nombre },
      select: {
        id_modelo_precio: true,
        nombre: true,
      },
    });

    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { toErrorResponse } from "@/lib/api-error-response";
import { BadRequestError } from "@/lib/errors";
import { requireAdmin } from "@/lib/require-admin";

function parseId(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestError("Invalid price model id");
  }

  return id;
}

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

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params;
    const id = parseId(rawId);

    const model = await prisma.modeloPrecio.findUniqueOrThrow({
      where: { id_modelo_precio: id },
      select: {
        id_modelo_precio: true,
        nombre: true,
      },
    });

    return NextResponse.json(model);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const { id: rawId } = await params;
    const id = parseId(rawId);
    const body = (await request.json()) as { nombre?: unknown };
    const nombre = parseNombre(body.nombre);

    const model = await prisma.modeloPrecio.update({
      where: { id_modelo_precio: id },
      data: { nombre },
      select: {
        id_modelo_precio: true,
        nombre: true,
      },
    });

    return NextResponse.json(model);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const { id: rawId } = await params;
    const id = parseId(rawId);

    await prisma.modeloPrecio.delete({
      where: { id_modelo_precio: id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

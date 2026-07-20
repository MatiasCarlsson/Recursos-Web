import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { toErrorResponse } from "@/lib/api-error-response";
import { BadRequestError } from "@/lib/errors";

function parseId(idParam: string) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestError("Invalid price model id");
  }

  return id;
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

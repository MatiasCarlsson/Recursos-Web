import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { toErrorResponse } from "@/lib/api-error-response";

export async function GET() {
  try {
    const data = await prisma.estadoSugerencia.findMany({
      orderBy: { nombre: "asc" },
      select: {
        id_estado_sugerencia: true,
        nombre: true,
      },
    });

    return NextResponse.json({ data });
  } catch (error) {
    return toErrorResponse(error);
  }
}

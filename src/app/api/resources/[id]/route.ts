import { NextResponse } from "next/server";
import { ResourceService } from "@/modules/resources/resource.service";
import { updateResourceSchema } from "@/modules/resources/schemas/resource.update.schema";
import { ZodError } from "zod";

const service = new ResourceService();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid resource id" }, { status: 400 });
    }

    const recurso = await service.getResourceById(id);
    return NextResponse.json(recurso);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Resource not found";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid resource id" }, { status: 400 });
    }

    const body = await request.json();
    const data = updateResourceSchema.parse(body);
    const recurso = await service.updateResource(id, data);
    return NextResponse.json(recurso);
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: "Invalid payload", details: e.issues }, { status: 400 });
    }

    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: `Error updating resource: ${message}` }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: "Invalid resource id" }, { status: 400 });
    }

    await service.deleteResource(id);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Resource not found";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

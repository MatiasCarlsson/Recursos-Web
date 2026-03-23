// src/modules/resources/resource.service.ts

import { ResourceRepository } from "@/modules/resources/resource.repository";
import { CreateResource } from "@/modules/resources/schemas/resource.create.schema";
import { UpdateResource } from "@/modules/resources/schemas/resource.update.schema";

import { PaginationParams, PaginatedResult } from "@/modules/resources/resource.repository";
import { Recurso } from "@prisma/client";

// En la clase ResourceService, agrega:

const repository = new ResourceRepository();

export class ResourceService {
  async getResourcesPaginated(params: PaginationParams): Promise<PaginatedResult<Recurso>> {
    return await repository.findPaginated(params);
  }
  async getAllResource() {
    return await repository.findAll();
  }

  async getResourceById(id: number) {
    const resource = await repository.findById(id);
    if (!resource) throw new Error("Resource not found: " + id);
    return resource;
  }

  async createResource(data: CreateResource) {
    return await repository.create({
      nombre: data.nombre,
      descripcion: data.descripcion,
      url: data.url,
      id_categoria: data.categoriaId,
      id_modelo_precio: data.modeloPrecioId,
    });
  }

  async updateResource(id: number, data: UpdateResource) {
    await this.getResourceById(id); // Verificar que el recurso existe antes de actualizar
    const updateData: Partial<Recurso> = {};
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.categoriaId !== undefined) updateData.id_categoria = data.categoriaId;
    if (data.modeloPrecioId !== undefined) updateData.id_modelo_precio = data.modeloPrecioId;
    return await repository.update(id, updateData);
  }

  async deleteResource(id: number) {
    await this.getResourceById(id); // Verificar que el recurso existe antes de eliminar
    return await repository.delete(id);
  }
}

// src/modules/resources/resource.service.ts

import { ResourceRepository, ResourceWithRelations } from "@/modules/resources/resource.repository";
import { CreateResource } from "@/modules/resources/schemas/resource.create.schema";
import { UpdateResource } from "@/modules/resources/schemas/resource.update.schema";

import { PaginationParams, PaginatedResult } from "@/modules/resources/resource.repository";
import { Prisma } from "@prisma/client";
import { NotFoundError } from "@/lib/errors";

// En la clase ResourceService, agrega:

const repository = new ResourceRepository();

export class ResourceService {
  async getResourcesPaginated(
    params: PaginationParams,
  ): Promise<PaginatedResult<ResourceWithRelations>> {
    return await repository.findPaginated(params);
  }

  async getFeaturedResources(limit: number): Promise<ResourceWithRelations[]> {
    return await repository.findFeatured(limit);
  }

  async getRecentResourcesInRange(
    start: Date,
    end: Date,
    limit: number,
  ): Promise<ResourceWithRelations[]> {
    return await repository.findRecentInRange(start, end, limit);
  }

  async getLatestResources(
    limit: number,
    excludeIds: number[] = [],
  ): Promise<ResourceWithRelations[]> {
    return await repository.findLatest(limit, excludeIds);
  }

  async getAllResource(): Promise<ResourceWithRelations[]> {
    return await repository.findAll();
  }

  async getResourceById(id: number): Promise<ResourceWithRelations> {
    const resource = await repository.findById(id);
    if (!resource) throw new NotFoundError("Resource", id);
    return resource;
  }

  async createResource(data: CreateResource) {
    const etiquetas = data.etiquetas?.filter((id, index, arr) => arr.indexOf(id) === index) ?? [];

    const createData: Prisma.RecursoCreateInput = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      url: data.url,
      destacado: data.destacado ?? false,
      ...(data.categoriaId
        ? {
            categoria: {
              connect: { id_categoria: data.categoriaId },
            },
          }
        : {}),
      ...(data.modeloPrecioId
        ? {
            modelo_precio: {
              connect: { id_modelo_precio: data.modeloPrecioId },
            },
          }
        : {}),
      ...(etiquetas.length
        ? {
            recurso_etiqueta: {
              create: etiquetas.map((idEtiqueta) => ({
                etiqueta: {
                  connect: { id_etiqueta: idEtiqueta },
                },
              })),
            },
          }
        : {}),
    };

    return await repository.create(createData);
  }

  async updateResource(id: number, data: UpdateResource) {
    await this.getResourceById(id);

    const updateData: Prisma.RecursoUpdateInput = {};
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.destacado !== undefined) updateData.destacado = data.destacado;

    if (data.categoriaId !== undefined) {
      updateData.categoria = data.categoriaId
        ? { connect: { id_categoria: data.categoriaId } }
        : { disconnect: true };
    }

    if (data.modeloPrecioId !== undefined) {
      updateData.modelo_precio = data.modeloPrecioId
        ? { connect: { id_modelo_precio: data.modeloPrecioId } }
        : { disconnect: true };
    }

    if (data.etiquetas !== undefined) {
      const etiquetas = data.etiquetas.filter(
        (idEtiqueta, index, arr) => arr.indexOf(idEtiqueta) === index,
      );
      updateData.recurso_etiqueta = {
        deleteMany: {},
        create: etiquetas.map((idEtiqueta) => ({
          etiqueta: {
            connect: { id_etiqueta: idEtiqueta },
          },
        })),
      };
    }

    return await repository.update(id, updateData);
  }

  async deleteResource(id: number) {
    await this.getResourceById(id);
    return await repository.delete(id);
  }
}

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class ResourceRepository {
  async findAll() {
    return await prisma.recurso.findMany({
      include: {
        categoria: true,
        modelo_precio: true,
        recurso_etiqueta: {
          include: {
            etiqueta: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return await prisma.recurso.findUnique({
      where: { id_recurso: id },
      include: {
        categoria: true,
        modelo_precio: true,
        recurso_etiqueta: {
          include: { etiqueta: true },
        },
      },
    });
  }

  async create(data: Prisma.RecursoUncheckedCreateInput) {
    return await prisma.recurso.create({ data });
  }

  async update(id: number, data: Prisma.RecursoUncheckedUpdateInput) {
    return await prisma.recurso.update({
      where: { id_recurso: id },
      data,
    });
  }

  async delete(id: number) {
    return await prisma.recurso.delete({
      where: { id_recurso: id },
    });
  }

  async findPaginated(params: PaginationParams) {
    const {
      page = 1,
      limit = 10,
      search,
      categoriaId,
      modeloPrecioId,
      sortBy = "creado",
      sort = "desc",
    } = params;

    const skip = (page - 1) * limit;

    // Construir where clause dinámico
    const where: Prisma.RecursoWhereInput = {};

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: "insensitive" } },
        { descripcion: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoriaId) {
      where.id_categoria = categoriaId;
    }

    if (modeloPrecioId) {
      where.id_modelo_precio = modeloPrecioId;
    }

    // Obtener total de registros
    const total = await prisma.recurso.count({ where });

    // Obtener registros paginados
    const data = await prisma.recurso.findMany({
      where,
      include: {
        categoria: true,
        modelo_precio: true,
        recurso_etiqueta: {
          include: { etiqueta: true },
        },
      },
      orderBy: {
        [sortBy]: sort,
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}

export type PaginationParams = {
  page: number;
  limit: number;
  search?: string;
  categoriaId?: number;
  modeloPrecioId?: number;
  sortBy?: "nombre" | "creado" | "actualizacion";
  sort?: "asc" | "desc";
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

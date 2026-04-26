import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

function isMissingFeaturedFieldError(error: unknown) {
  return error instanceof Error && error.message.includes("Unknown argument `destacado`");
}

// Definimos un tipo para el Recurso con todas sus relaciones incluidas
export type ResourceWithRelations = Prisma.RecursoGetPayload<{
  include: {
    categoria: true;
    modelo_precio: true;
    recurso_etiqueta: {
      include: {
        etiqueta: true;
      };
    };
  };
}>;

export class ResourceRepository {
  async findAll(): Promise<ResourceWithRelations[]> {
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

  async findById(id: number): Promise<ResourceWithRelations | null> {
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

  async create(data: Prisma.RecursoCreateInput) {
    return await prisma.recurso.create({ data });
  }

  async update(id: number, data: Prisma.RecursoUpdateInput) {
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

  async findPaginated(params: PaginationParams): Promise<PaginatedResult<ResourceWithRelations>> {
    const {
      page = 1,
      limit = 10,
      search,
      destacado,
      categoriaId,
      categoriaIds,
      modeloPrecioId,
      modeloPrecioIds,
      etiquetaId,
      etiquetaIds,
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
        {
          categoria: {
            nombre: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          recurso_etiqueta: {
            some: {
              etiqueta: {
                nombre: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      ];
    }

    if (typeof destacado === "boolean") {
      where.destacado = destacado;
    }

    if (categoriaId) {
      where.id_categoria = categoriaId;
    }

    const normalizedCategoryIds = [categoriaId, ...(categoriaIds ?? [])].filter(
      (id): id is number => typeof id === "number" && Number.isInteger(id) && id > 0,
    );
    if (normalizedCategoryIds.length) {
      where.id_categoria = { in: [...new Set(normalizedCategoryIds)] };
    }

    if (modeloPrecioId) {
      where.id_modelo_precio = modeloPrecioId;
    }

    const normalizedPriceModelIds = [modeloPrecioId, ...(modeloPrecioIds ?? [])].filter(
      (id): id is number => typeof id === "number" && Number.isInteger(id) && id > 0,
    );
    if (normalizedPriceModelIds.length) {
      where.id_modelo_precio = { in: [...new Set(normalizedPriceModelIds)] };
    }

    if (etiquetaId) {
      where.recurso_etiqueta = {
        some: {
          id_etiqueta: etiquetaId,
        },
      };
    }

    const normalizedTagIds = [etiquetaId, ...(etiquetaIds ?? [])].filter(
      (id): id is number => typeof id === "number" && Number.isInteger(id) && id > 0,
    );
    if (normalizedTagIds.length) {
      where.recurso_etiqueta = {
        some: {
          id_etiqueta: { in: [...new Set(normalizedTagIds)] },
        },
      };
    }

    // Si el cliente Prisma aún no fue regenerado en caliente, toleramos que no exista el campo
    // `destacado` y repetimos la consulta sin ese filtro para no romper la UI.
    let total: number;
    let data: ResourceWithRelations[];

    try {
      total = await prisma.recurso.count({ where });
      data = await prisma.recurso.findMany({
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
    } catch (error) {
      if (!(typeof destacado === "boolean" && isMissingFeaturedFieldError(error))) {
        throw error;
      }

      const fallbackWhere = { ...where };
      delete fallbackWhere.destacado;

      total = await prisma.recurso.count({ where: fallbackWhere });
      data = await prisma.recurso.findMany({
        where: fallbackWhere,
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
    }

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

  async findFeatured(limit: number): Promise<ResourceWithRelations[]> {
    try {
      return await prisma.recurso.findMany({
        where: { destacado: true },
        include: {
          categoria: true,
          modelo_precio: true,
          recurso_etiqueta: {
            include: { etiqueta: true },
          },
        },
        orderBy: [{ actualizacion: "desc" }, { creado: "desc" }],
        take: limit,
      });
    } catch (error) {
      if (!isMissingFeaturedFieldError(error)) {
        throw error;
      }

      return await prisma.recurso.findMany({
        include: {
          categoria: true,
          modelo_precio: true,
          recurso_etiqueta: {
            include: { etiqueta: true },
          },
        },
        orderBy: [{ actualizacion: "desc" }, { creado: "desc" }],
        take: limit,
      });
    }
  }

  async findRecentInRange(start: Date, end: Date, limit: number): Promise<ResourceWithRelations[]> {
    return await prisma.recurso.findMany({
      where: {
        creado: {
          gte: start,
          lte: end,
        },
      },
      include: {
        categoria: true,
        modelo_precio: true,
        recurso_etiqueta: {
          include: { etiqueta: true },
        },
      },
      orderBy: [{ creado: "desc" }, { id_recurso: "desc" }],
      take: limit,
    });
  }

  async findLatest(limit: number, excludeIds: number[] = []): Promise<ResourceWithRelations[]> {
    return await prisma.recurso.findMany({
      where: excludeIds.length
        ? {
            id_recurso: {
              notIn: excludeIds,
            },
          }
        : undefined,
      include: {
        categoria: true,
        modelo_precio: true,
        recurso_etiqueta: {
          include: { etiqueta: true },
        },
      },
      orderBy: [{ creado: "desc" }, { id_recurso: "desc" }],
      take: limit,
    });
  }
}

export type PaginationParams = {
  page: number;
  limit: number;
  search?: string;
  destacado?: boolean;
  categoriaId?: number;
  categoriaIds?: number[];
  modeloPrecioId?: number;
  modeloPrecioIds?: number[];
  etiquetaId?: number;
  etiquetaIds?: number[];
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

import prisma from "@/lib/prisma";
import { Prisma, Sugerencia } from "@prisma/client";

export type SuggestionPaginationParams = {
  page: number;
  limit: number;
  search?: string;
  categoriaId?: number;
  estadoSugerenciaId?: number;
  sortBy?: "titulo" | "creado";
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

export class SuggestionRepository {
  async findPendingStatusId(): Promise<number | null> {
    const pendingStatus = await prisma.estadoSugerencia.findFirst({
      where: {
        nombre: {
          equals: "pendiente",
          mode: "insensitive",
        },
      },
      select: {
        id_estado_sugerencia: true,
      },
    });

    return pendingStatus?.id_estado_sugerencia ?? null;
  }

  async existsRecentDuplicate(params: {
    titulo: string;
    url?: string;
    withinMinutes: number;
  }): Promise<boolean> {
    const createdAfter = new Date(Date.now() - params.withinMinutes * 60 * 1000);
    const duplicateCriteria: Prisma.SugerenciaWhereInput[] = [
      {
        titulo: {
          equals: params.titulo,
          mode: "insensitive",
        },
      },
    ];

    if (params.url) {
      duplicateCriteria.push({
        url: {
          equals: params.url,
          mode: "insensitive",
        },
      });
    }

    const duplicateCount = await prisma.sugerencia.count({
      where: {
        creado: {
          gte: createdAfter,
        },
        OR: duplicateCriteria,
      },
    });

    return duplicateCount > 0;
  }

  async findAll() {
    return await prisma.sugerencia.findMany({
      include: {
        categoria: true,
        estado_sugerencia: true,
      },
      orderBy: { creado: "desc" },
    });
  }

  async findPaginated(params: SuggestionPaginationParams): Promise<PaginatedResult<Sugerencia>> {
    const {
      page = 1,
      limit = 10,
      search,
      categoriaId,
      estadoSugerenciaId,
      sortBy = "creado",
      sort = "desc",
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.SugerenciaWhereInput = {};
    if (search) {
      where.OR = [
        { titulo: { contains: search, mode: "insensitive" } },
        { descripcion: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoriaId) {
      where.id_categoria = categoriaId;
    }

    if (estadoSugerenciaId) {
      where.id_estado_sugerencia = estadoSugerenciaId;
    }

    const total = await prisma.sugerencia.count({ where });

    const data = await prisma.sugerencia.findMany({
      where,
      include: {
        categoria: true,
        estado_sugerencia: true,
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

  async findById(id: number) {
    return await prisma.sugerencia.findUnique({
      where: { id_sugerencia: id },
      include: {
        categoria: true,
        estado_sugerencia: true,
      },
    });
  }

  async create(data: Prisma.SugerenciaUncheckedCreateInput) {
    return await prisma.sugerencia.create({ data });
  }

  async update(id: number, data: Prisma.SugerenciaUncheckedUpdateInput) {
    return await prisma.sugerencia.update({
      where: { id_sugerencia: id },
      data,
    });
  }

  async delete(id: number) {
    return await prisma.sugerencia.delete({
      where: { id_sugerencia: id },
    });
  }
}

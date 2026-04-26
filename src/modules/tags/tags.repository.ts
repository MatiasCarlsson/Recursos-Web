import prisma from "@/lib/prisma";
import { Etiqueta, Prisma } from "@prisma/client";

export type TagPaginationParams = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: "nombre" | "slug";
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

export class TagRepository {
  async findAll() {
    return await prisma.etiqueta.findMany({
      include: {
        _count: {
          select: {
            recurso_etiqueta: true,
          },
        },
      },
      orderBy: { nombre: "asc" },
    });
  }

  async findPaginated(params: TagPaginationParams): Promise<PaginatedResult<Etiqueta>> {
    const { page = 1, limit = 10, search, sortBy = "nombre", sort = "asc" } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.EtiquetaWhereInput = {};
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await prisma.etiqueta.count({ where });

    const data = await prisma.etiqueta.findMany({
      where,
      include: {
        _count: {
          select: {
            recurso_etiqueta: true,
          },
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

  async findById(id: number) {
    return await prisma.etiqueta.findUnique({
      where: { id_etiqueta: id },
      include: {
        recurso_etiqueta: {
          include: {
            recurso: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string): Promise<Etiqueta | null> {
    return await prisma.etiqueta.findFirst({
      where: { slug },
    });
  }

  async create(data: Prisma.EtiquetaUncheckedCreateInput) {
    return await prisma.etiqueta.create({ data });
  }

  async update(id: number, data: Prisma.EtiquetaUncheckedUpdateInput) {
    return await prisma.etiqueta.update({
      where: { id_etiqueta: id },
      data,
    });
  }

  async delete(id: number) {
    return await prisma.etiqueta.delete({
      where: { id_etiqueta: id },
    });
  }
}

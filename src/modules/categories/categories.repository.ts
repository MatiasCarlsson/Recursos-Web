import prisma from "@/lib/prisma";
import { Categoria, Prisma } from "@prisma/client";

export type CategoryPaginationParams = {
  page: number;
  limit: number;
  search?: string;
  includeResources?: boolean;
  sortBy?: "nombre" | "creado";
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

export class CategoryRepository {
  async findAllBasic() {
    return await prisma.categoria.findMany({
      select: {
        id_categoria: true,
        nombre: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });
  }

  async findAll() {
    return await prisma.categoria.findMany({
      include: {
        recursos: {
          include: {
            modelo_precio: true,
            recurso_etiqueta: {
              include: {
                etiqueta: true,
              },
            },
          },
        },
      },
    });
  }

  async findPaginated(params: CategoryPaginationParams) {
    const {
      page = 1,
      limit = 10,
      search,
      includeResources = false,
      sortBy = "creado",
      sort = "desc",
    } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.CategoriaWhereInput = {};
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await prisma.categoria.count({ where });

    const data = await prisma.categoria.findMany({
      where,
      include: includeResources
        ? {
            recursos: {
              include: {
                modelo_precio: true,
                recurso_etiqueta: {
                  include: {
                    etiqueta: true,
                  },
                },
              },
            },
          }
        : undefined,
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
    return await prisma.categoria.findUnique({
      where: { id_categoria: id },
      include: {
        recursos: {
          include: {
            modelo_precio: true,
            recurso_etiqueta: {
              include: {
                etiqueta: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: Prisma.CategoriaCreateInput) {
    return await prisma.categoria.create({ data });
  }

  async findBySlug(slug: string): Promise<Categoria | null> {
    return await prisma.categoria.findUnique({
      where: { slug },
    });
  }

  async update(id: number, data: Prisma.CategoriaUpdateInput) {
    return await prisma.categoria.update({
      where: { id_categoria: id },
      data,
    });
  }

  async delete(id: number) {
    return await prisma.categoria.delete({
      where: { id_categoria: id },
    });
  }
}

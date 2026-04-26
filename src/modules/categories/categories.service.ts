import { CreateCategory } from "./schemas/categories.create.schema";
import { UpdateCategory } from "./schemas/categories.update.schema";
import { CategoryRepository } from "./categories.repository";
import { Categoria } from "@prisma/client";
import { generateSlug } from "@/lib/slug-generator";
import { ConflictError, NotFoundError } from "@/lib/errors";
import {
  CategoryPaginationParams,
  PaginatedResult,
} from "@/modules/categories/categories.repository";

const repository = new CategoryRepository();

export class CategoryService {
  async getCategoriesPaginated(
    params: CategoryPaginationParams,
  ): Promise<PaginatedResult<Categoria>> {
    return await repository.findPaginated(params);
  }

  async getAllCategories(): Promise<Categoria[]> {
    return await repository.findAll();
  }

  async getAllCategoriesBasic(): Promise<Array<{ id_categoria: number; nombre: string | null }>> {
    return await repository.findAllBasic();
  }

  async getCategoryById(id: number): Promise<Categoria | null> {
    const category = await repository.findById(id);
    if (!category) throw new NotFoundError("Category", id);
    return category;
  }

  async createCategory(data: CreateCategory): Promise<Categoria> {
    // Si no viene slug, generarlo
    const slug = data.slug || generateSlug(data.nombre);

    const existingCategory = await repository.findBySlug(slug);
    if (existingCategory) {
      throw new ConflictError(`Category with slug "${slug}" already exists`);
    }

    return await repository.create({
      ...data,
      slug,
    });
  }

  async updateCategory(id: number, data: UpdateCategory): Promise<Categoria> {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError("Category", id);
    }

    let slug = data.slug;
    if (!slug && data.nombre) {
      slug = generateSlug(data.nombre);
    }

    if (slug && slug !== existing.slug) {
      const duplicate = await repository.findBySlug(slug);
      if (duplicate) {
        throw new ConflictError(`Category with slug "${slug}" already exists`);
      }
    }

    return await repository.update(id, {
      ...data,
      ...(slug ? { slug } : {}),
    });
  }

  async deleteCategory(id: number): Promise<Categoria> {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError("Category", id);
    }

    return await repository.delete(id);
  }
}

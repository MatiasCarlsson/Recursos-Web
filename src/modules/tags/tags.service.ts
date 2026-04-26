import { ConflictError, NotFoundError } from "@/lib/errors";
import { generateSlug } from "@/lib/slug-generator";
import { Etiqueta } from "@prisma/client";
import {
  PaginatedResult,
  TagPaginationParams,
  TagRepository,
} from "@/modules/tags/tags.repository";
import { CreateTag } from "@/modules/tags/schemas/tag.create.schema";
import { UpdateTag } from "@/modules/tags/schemas/tag.update.schema";

const repository = new TagRepository();

export class TagService {
  async getAllTags() {
    return await repository.findAll();
  }

  async getTagsPaginated(params: TagPaginationParams): Promise<PaginatedResult<Etiqueta>> {
    return await repository.findPaginated(params);
  }

  async getTagById(id: number) {
    const tag = await repository.findById(id);
    if (!tag) {
      throw new NotFoundError("Tag", id);
    }

    return tag;
  }

  async createTag(data: CreateTag) {
    const slug = data.slug || generateSlug(data.nombre);

    const existingTag = await repository.findBySlug(slug);
    if (existingTag) {
      throw new ConflictError(`Tag with slug "${slug}" already exists`);
    }

    return await repository.create({
      nombre: data.nombre,
      descripcion: data.descripcion,
      slug,
    });
  }

  async updateTag(id: number, data: UpdateTag) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError("Tag", id);
    }

    let slug = data.slug;
    if (!slug && data.nombre) {
      slug = generateSlug(data.nombre);
    }

    if (slug && slug !== existing.slug) {
      const duplicate = await repository.findBySlug(slug);
      if (duplicate && duplicate.id_etiqueta !== id) {
        throw new ConflictError(`Tag with slug "${slug}" already exists`);
      }
    }

    return await repository.update(id, {
      ...data,
      ...(slug ? { slug } : {}),
    });
  }

  async deleteTag(id: number) {
    const existing = await repository.findById(id);
    if (!existing) {
      throw new NotFoundError("Tag", id);
    }

    return await repository.delete(id);
  }
}

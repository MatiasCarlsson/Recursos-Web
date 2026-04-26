import { NotFoundError } from "@/lib/errors";
import { Sugerencia } from "@prisma/client";
import {
  PaginatedResult,
  SuggestionPaginationParams,
  SuggestionRepository,
} from "@/modules/suggestions/suggestions.repository";
import { CreateSuggestion } from "@/modules/suggestions/schemas/suggestion.create.schema";
import { UpdateSuggestion } from "@/modules/suggestions/schemas/suggestion.update.schema";
import { AppError, BadRequestError } from "@/lib/errors";

const repository = new SuggestionRepository();

export class SuggestionService {
  async getAllSuggestions() {
    return await repository.findAll();
  }

  async getSuggestionsPaginated(
    params: SuggestionPaginationParams,
  ): Promise<PaginatedResult<Sugerencia>> {
    return await repository.findPaginated(params);
  }

  async getSuggestionById(id: number) {
    const suggestion = await repository.findById(id);
    if (!suggestion) {
      throw new NotFoundError("Suggestion", id);
    }

    return suggestion;
  }

  async createSuggestion(data: CreateSuggestion) {
    return await repository.create({
      titulo: data.titulo,
      descripcion: data.descripcion,
      url: data.url,
      id_categoria: data.categoriaId,
      id_estado_sugerencia: data.estadoSugerenciaId,
      categoria_sugerida: data.categoriaSugerida,
      email_contacto: data.emailContacto,
    });
  }

  async createPublicSuggestion(data: CreateSuggestion) {
    const pendingStatusId = await repository.findPendingStatusId();
    if (!pendingStatusId) {
      throw new AppError(
        "No existe el estado 'pendiente'. Crea ese estado para habilitar sugerencias publicas.",
        500,
        "PENDING_STATUS_NOT_FOUND",
      );
    }

    const normalizedTitle = data.titulo.trim();
    const normalizedUrl = data.url?.trim();

    const isDuplicate = await repository.existsRecentDuplicate({
      titulo: normalizedTitle,
      url: normalizedUrl,
      withinMinutes: 30,
    });

    if (isDuplicate) {
      throw new BadRequestError(
        "Ya existe una sugerencia similar enviada recientemente. Intenta mas tarde.",
      );
    }

    return await repository.create({
      titulo: normalizedTitle,
      descripcion: data.descripcion?.trim(),
      url: normalizedUrl,
      id_categoria: data.categoriaId,
      id_estado_sugerencia: pendingStatusId,
      categoria_sugerida: data.categoriaSugerida?.trim(),
      email_contacto: data.emailContacto?.trim().toLowerCase(),
    });
  }

  async updateSuggestion(id: number, data: UpdateSuggestion) {
    await this.getSuggestionById(id);

    return await repository.update(id, {
      titulo: data.titulo,
      descripcion: data.descripcion,
      url: data.url,
      id_categoria: data.categoriaId,
      id_estado_sugerencia: data.estadoSugerenciaId,
      categoria_sugerida: data.categoriaSugerida,
      email_contacto: data.emailContacto,
    });
  }

  async deleteSuggestion(id: number) {
    await this.getSuggestionById(id);
    return await repository.delete(id);
  }
}

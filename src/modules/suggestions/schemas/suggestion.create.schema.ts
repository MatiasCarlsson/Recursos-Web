import { z } from "zod";

export const createSuggestionSchema = z.object({
  titulo: z.string().trim().min(1, "El título es obligatorio").max(255),
  descripcion: z.string().trim().optional(),
  url: z.string().url().optional(),
  categoriaId: z.coerce.number().int().positive().optional(),
  estadoSugerenciaId: z.coerce.number().int().positive().optional(),
  // Campo libre para usuarios cuando la categoria no existe aun en la BD.
  categoriaSugerida: z.string().trim().max(120).optional(),
  // Se usa para soporte y para rate limiting por email.
  emailContacto: z.string().trim().email().max(255).optional(),
  turnstileToken: z.string().trim().min(1).optional(),
  // Honeypot simple anti-bots: debe permanecer vacio.
  website: z.string().trim().max(0).optional(),
});

export type CreateSuggestion = z.infer<typeof createSuggestionSchema>;

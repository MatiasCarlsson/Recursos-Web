import { z } from "zod";

export const suggestionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  categoriaId: z.coerce.number().int().positive().optional(),
  estadoSugerenciaId: z.coerce.number().int().positive().optional(),
  sortBy: z.enum(["titulo", "creado"]).default("creado"),
  sort: z.enum(["asc", "desc"]).default("desc"),
});

export type SuggestionsQuery = z.infer<typeof suggestionsQuerySchema>;

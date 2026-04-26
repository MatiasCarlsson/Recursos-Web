import { z } from "zod";

export const resourcesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  destacado: z.coerce.boolean().optional(),
  categoriaId: z.coerce.number().int().positive().optional(),
  modeloPrecioId: z.coerce.number().int().positive().optional(),
  etiquetaId: z.coerce.number().int().positive().optional(),
  sortBy: z.enum(["nombre", "creado", "actualizacion"]).default("creado"),
  sort: z.enum(["asc", "desc"]).default("desc"),
});

export type ResourcesQuery = z.infer<typeof resourcesQuerySchema>;

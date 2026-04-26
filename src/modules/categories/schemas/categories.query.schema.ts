import { z } from "zod";

export const categoriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  includeResources: z.coerce.boolean().default(false),
  sortBy: z.enum(["nombre", "creado"]).default("creado"),
  sort: z.enum(["asc", "desc"]).default("desc"),
});

export type CategoriesQuery = z.infer<typeof categoriesQuerySchema>;

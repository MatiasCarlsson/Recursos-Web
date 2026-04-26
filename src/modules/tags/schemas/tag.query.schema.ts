import { z } from "zod";

export const tagsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  sortBy: z.enum(["nombre", "slug"]).default("nombre"),
  sort: z.enum(["asc", "desc"]).default("asc"),
});

export type TagsQuery = z.infer<typeof tagsQuerySchema>;

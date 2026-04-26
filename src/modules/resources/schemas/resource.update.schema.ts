import { z } from "zod";
import { createResourceSchema } from "./resource.create.schema";

export const updateResourceSchema = createResourceSchema.partial().extend({
  destacado: z.boolean().optional(),
  categoriaId: z.number().nullable().optional(),
  modeloPrecioId: z.number().nullable().optional(),
  etiquetas: z.array(z.number()).optional(),
});
export type UpdateResource = z.infer<typeof updateResourceSchema>;

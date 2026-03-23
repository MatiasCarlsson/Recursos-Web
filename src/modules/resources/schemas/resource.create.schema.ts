import { z } from "zod";

export const createResourceSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string(),
  url: z.string().url(),
  categoriaId: z.number().optional(),
  modeloPrecioId: z.number().optional(),
  etiquetas: z.array(z.number()).optional(),
});

export type CreateResource = z.infer<typeof createResourceSchema>;

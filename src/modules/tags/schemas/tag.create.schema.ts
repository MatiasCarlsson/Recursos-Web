import { z } from "zod";

export const createTagSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(255),
  descripcion: z
    .string()
    .trim()
    .max(500, "La descripción no puede superar 500 caracteres")
    .optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^[a-z0-9-]+$/, "El slug solo permite minúsculas, números y guiones")
    .optional(),
});

export type CreateTag = z.infer<typeof createTagSchema>;

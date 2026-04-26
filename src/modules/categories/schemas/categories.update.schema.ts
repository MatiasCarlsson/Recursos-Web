import { createCategorySchema } from "./categories.create.schema";
import { z } from "zod";

export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategory = z.infer<typeof updateCategorySchema>;

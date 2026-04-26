import { z } from "zod";
import { createTagSchema } from "./tag.create.schema";

export const updateTagSchema = createTagSchema.partial();
export type UpdateTag = z.infer<typeof updateTagSchema>;

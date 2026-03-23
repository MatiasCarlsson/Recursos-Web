import { z } from "zod";
import { createResourceSchema } from "./resource.create.schema";

export const updateResourceSchema = createResourceSchema.partial();
export type UpdateResource = z.infer<typeof updateResourceSchema>;

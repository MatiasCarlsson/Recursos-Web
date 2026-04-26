import { z } from "zod";
import { createSuggestionSchema } from "./suggestion.create.schema";

export const updateSuggestionSchema = createSuggestionSchema.partial();
export type UpdateSuggestion = z.infer<typeof updateSuggestionSchema>;

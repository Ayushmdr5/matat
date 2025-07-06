// validators/commonParamsSchema.ts
import { z } from "zod";

export const idParamsSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "ID must be a valid positive number",
    }),
  }),
});

export type IdParamsSchema = z.infer<typeof idParamsSchema>;

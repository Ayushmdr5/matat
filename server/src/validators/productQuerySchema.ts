import { z, TypeOf } from "zod";

export const productQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default("1")
      .refine((val) => !isNaN(+val), {
        message: "Page must be a number",
      }),
    limit: z
      .string()
      .optional()
      .default("10")
      .refine((val) => !isNaN(+val), {
        message: "Limit must be a number",
      }),
    search: z.string().optional().default(""),
    sortBy: z.enum(["name", "price"]).optional().default("name"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  }),
});

export type ProductQuerySchema = TypeOf<typeof productQuerySchema>;

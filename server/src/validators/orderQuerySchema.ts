import { TypeOf, z } from "zod";

export const orderQuerySchema = z.object({
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
    sortBy: z
      .enum(["date_created", "total"])
      .optional()
      .default("date_created"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    search: z.string().optional().default(""),
    status: z
      .enum([
        "pending",
        "processing",
        "on-hold",
        "completed",
        "cancelled",
        "refunded",
        "failed",
        "trash",
      ])
      .optional(),
    productId: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(+val), {
        message: "Product ID must be a number",
      }),
  }),
});

export type OrderQuerySchema = TypeOf<typeof orderQuerySchema>;


import { z } from "zod";
export const JsonSchema: z.ZodType<
  string | number | boolean | null | { [key: string]: any } | any[]
> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JsonSchema),
    z.object(JsonSchema),
  ])
);

export const WebsiteCreateValidation = z.object({
  // Optional system fields
  owner_id: z.string(),
  name: z.string(),
  slug: z.string(),
  tagline: z.string().optional(),
  theme: JsonSchema.transform((val) => val ? JSON.stringify(val) : val).optional().nullable(),
  metadata: JsonSchema.transform((val) => val ? JSON.stringify(val) : val).optional().nullable(),
});

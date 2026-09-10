import { z } from "zod";

export const roomSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().min(10, "Description is too short").max(2000),
  basePrice: z.coerce.number().positive("Price must be greater than 0"),
  capacity: z.coerce.number().int().positive("Capacity must be at least 1"),
  totalUnits: z.coerce.number().int().positive("Must have at least 1 unit"),
});

export type RoomInput = z.infer<typeof roomSchema>;
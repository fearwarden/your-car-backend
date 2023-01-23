import { z } from "zod";

export const createPostDto = z.object({
  description: z.string(),
  country: z.string(),
  year: z.number(),
  mileage: z.string(),
  price: z.string(),
  currency: z.string(),
  fixed: z.boolean(),
  imagePaths: z.array(z.string()),
  brand: z.string(),
  model: z.string(),
  used: z.boolean(),
  bodyType: z.string(),
  drivetrain: z.string(),
  engine: z.string(),
  horsePower: z.number(),
  transmission: z.string(),
  fuelType: z.string(),
  exteriorColor: z.string(),
  interiorColor: z.string(),
});

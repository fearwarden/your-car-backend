import { z } from "zod";

export const updateDto = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  address: z.string(),
});

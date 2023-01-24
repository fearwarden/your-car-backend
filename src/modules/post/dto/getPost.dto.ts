import { z } from "zod";

export const getPostDto = z.object({
  postId: z.string().uuid(),
});

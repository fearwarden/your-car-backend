import { z } from "zod";

export const resetPasswordDto = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    forgotPassId: z.string().uuid(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match.",
      });
    }
  });

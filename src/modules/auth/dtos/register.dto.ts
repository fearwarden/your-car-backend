import { z } from "zod";
const MAX_FILE_SIZE: number = 500000;
const ACCEPTED_IMAGE_TYPES: Array<string> = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const RegisterDto = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string(),
    address: z.string(),
    /*profilePicture: z
      .any()
      .refine((file) => file?.size <= MAX_FILE_SIZE, "Max image size is 5MB.")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported."
      ),*/
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match.",
      });
    }
  });

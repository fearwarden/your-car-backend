import prisma from "../config/client";
import { User } from "@prisma/client";

export async function createUser(user: User) {
  return await prisma.user.create({
    data: user,
  });
}

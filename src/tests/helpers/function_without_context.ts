import prisma from "../config/client";
import { UpdateUser, CreateUser } from "../interfaces/user.interface";

export async function createUser(user: CreateUser) {
  return await prisma.user.create({
    data: user,
  });
}

export async function updateUser(user: UpdateUser) {
  return await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      phone: user.phone,
      address: user.address,
      profilePicture: user.profilePicture
    },
  })
}

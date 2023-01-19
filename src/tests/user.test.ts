import { createUser, updateUser } from "./helpers/testFunctions";
import { prismaMock } from "./config/singleton";
import { User } from "@prisma/client";

test("should create new user", async () => {
  const user: User = {
    id: 1,
    email: "test@prisma.io",
    password: "test1234",
    firstName: "Test",
    lastName: "Test",
    phone: "123456789",
    address: "test 14",
    profilePicture: "test",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  prismaMock.user.create.mockResolvedValue(user);

  await expect(createUser(user)).resolves.toEqual(user);
});

test("should update the user", async () => {
  const user = {
    id: 1,
    email: "test@prisma.io",
    password: "test1234",
    firstName: "Test",
    lastName: "Test",
    phone: "123456789",
    address: "test 14",
    profilePicture: "test",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  prismaMock.user.update.mockResolvedValue(user);

  await expect(updateUser(user)).resolves.toEqual(user);
})

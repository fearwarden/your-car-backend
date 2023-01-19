import { prismaMock } from "./config/singleton";
import { User } from "@prisma/client";
import { AuthController } from "../modules/auth/auth.controller";
import { Request, Response } from "express";

const mockRequest = (body: any): Request => {
  return {
    body: body,
  } as Request;
};

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

describe("register", () => {
  test("should return 201 if user is registered", async () => {
    const mockDataRegister: any = {
      id: 5,
      email: "fake@fake.com",
      password: "fake12345",
      firstName: "Fake",
      lastName: "Fake",
      phone: "123123",
      address: "Fake 17",
      profilePicture: "Fake",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const user: any = {
      email: "fake@fake.com",
      password: "fake12345",
      confirmPassword: "fake12345",
      firstName: "Fake",
      lastName: "Fake",
      phone: "123123",
      address: "Fake 17",
      profilePicture: "Fake",
    };
    const req = mockRequest(user);
    const res = mockResponse();
    prismaMock.user.create.mockResolvedValue(mockDataRegister);
    await AuthController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    //expect(res.send).toHaveBeenCalledWith({});
  });
  test("should return 401 if data in not set", async () => {
    const req = mockRequest({});
    const res = mockResponse();
    await AuthController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

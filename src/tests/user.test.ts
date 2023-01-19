import request from "supertest";
import express, { Express } from "express";
import prisma from "./config/client";
import { User } from "@prisma/client";
import { AuthController } from "../modules/auth/auth.controller";
import { Request, Response } from "express";
import { hashPassword } from "../utils/helperFunctions";
import app from "../server";

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

/*describe("register", () => {
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
});*/

describe("register endpoint", () => {
  it("should return 201 and create a new user", async () => {
    const payload = {
      email: "test@example.com",
      password: "testpassword",
      confirmPassword: "testpassword",
      firstName: "Test",
      lastName: "User",
      phone: "1234567890",
      address: "123 Test St.",
    };
    const hashedPassword = await hashPassword(payload.password);

    // mock the prisma.user.findUnique method to return null
    jest.mock("@prisma/client", () => {
      return {
        user: {
          findUnique: jest.fn(() => Promise.resolve(null)),
          create: jest.fn(() =>
            Promise.resolve({
              email: payload.email,
              password: hashedPassword,
              firstName: payload.firstName,
              lastName: payload.lastName,
              phone: payload.phone,
              address: payload.address,
              profilePicture: "/uploads/profiles/avatar.webp",
            })
          ),
        },
      };
    });

    const res = await request("http://localhost:3000")
      .post("/api/v1/register")
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      success: true,
      message: "Ok.",
      data: {},
    });
  });
});

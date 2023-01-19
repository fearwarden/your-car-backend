import { prismaMock } from "./config/singleton";
import { User } from "@prisma/client";
import { AuthController } from "../modules/auth/auth.controller";
import { Request, Response } from "express";

const mockRequest = (body: any): Request => {
  return {
    body: { data: body },
  } as Request;
};

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("register", () => {
  test("should return 401 if data in not set", async () => {
    const req = mockRequest({});
    const res = mockResponse();
    await AuthController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

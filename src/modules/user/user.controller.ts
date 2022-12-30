import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import RESTResponse from "../../utils/RESTResponse";

export class UserController {
  static prisma: PrismaClient = new PrismaClient();

  static async register(req: Request, res: Response) {}
}

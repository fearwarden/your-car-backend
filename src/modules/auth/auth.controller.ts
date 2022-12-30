import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export class AuthController {
  static prisma: PrismaClient = new PrismaClient();

  static async register(req: Request, res: Response) {}
}

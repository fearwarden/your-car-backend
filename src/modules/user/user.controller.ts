import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import RESTResponse from "../../utils/RESTResponse";

export class UserController {
  static prisma: PrismaClient = new PrismaClient();

  static async personalInfo(req: Request, res: Response): Promise<Response> {
    return res.send(req.user);
  }
}

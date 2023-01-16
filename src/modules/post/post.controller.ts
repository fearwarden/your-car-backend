// Packges
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export class PostController {
  static prisma: PrismaClient = new PrismaClient();
}

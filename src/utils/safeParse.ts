import { Request, Response, NextFunction } from "express";
import prisma from "../tests/config/client";

export const safeParse =
  (controller: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, prisma);
    } catch (error) {
      return next(error);
    }
  };

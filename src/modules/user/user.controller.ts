import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import RESTResponse from "../../utils/RESTResponse";
import { HTTPResponses } from "../../constants/HTTPResponses";

export class UserController {
  static prisma: PrismaClient = new PrismaClient();

  /**
   * Returns the user's personal information.
   * @param {Request} req - Request 
   * @param {Response} res - Response
   * @returns The user's personal information.
   */
  static async personalInfo(req: Request, res: Response): Promise<Response> {
    const user: any = req.user;
    let payload: any;
    try {
      payload = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send(
          RESTResponse.createResponse(
            false,
            HTTPResponses.INTERNAL_SERVER_ERROR,
            {}
          )
        );
    }
    return res.status(201).send(
      RESTResponse.createResponse(true, HTTPResponses.OK, {
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
        address: payload.address,
      })
    );
  }
}

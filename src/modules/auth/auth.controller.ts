import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { RegisterDto } from "./dtos/register.dto";
import RESTResponse from "../../utils/RESTResponse";
import { HTTPResponses } from "../../constants/HTTPResponses";
import { hashPassword } from "../../utils/helperFunctions";

export class AuthController {
  static prisma: PrismaClient = new PrismaClient();

  /**
   * It takes a payload with user credentials and creates a user.
   * @param {Request} req - Request - The request object with email, password, confirmPassword, firstName, lastName
   * @param {Response} res - Response - the response object w
   * @returns The response is being returned.
   */
  static async register(req: Request, res: Response): Promise<Response> {
    const payload = req.body;
    try {
      RegisterDto.parse(payload);
    } catch (error) {
      return res
        .status(401)
        .send(
          RESTResponse.createResponse(false, HTTPResponses.INVALID_DATA, {})
        );
    }

    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });
      if (user) {
        return res
          .status(409)
          .send(
            RESTResponse.createResponse(false, HTTPResponses.USER_EXIST, {})
          );
      }
    } catch (error) {
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
    const hashedPassword = await hashPassword(payload.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: payload.email,
          password: hashedPassword,
          firstName: payload.firstName,
          lastName: payload.lastName,
        },
      });
    } catch (error) {
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
    return res
      .status(201)
      .send(RESTResponse.createResponse(true, HTTPResponses.OK, {}));
  }

  static async logout(req: Request, res: Response) {
    req.logout((error) => {
      if (error)
        return res
          .status(401)
          .send(
            RESTResponse.createResponse(false, HTTPResponses.BAD_REQUEST, {})
          );
      return res
        .status(201)
        .send(RESTResponse.createResponse(true, HTTPResponses.OK, {}));
    });
  }
}

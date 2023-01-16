// Packages
import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
// DTOs
import { RegisterDto } from "./dtos/register.dto";
// Helpers
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
      const user: User | null = await this.prisma.user.findUnique({
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
    let profilePicture: string;
    if (!payload.profilePicture) {
      profilePicture = "/uploads/profiles/avatar.webp";
    } else {
      profilePicture = payload.profilePicture;
    }
    try {
      const createdUser: User | null = await this.prisma.user.create({
        data: {
          email: payload.email,
          password: hashedPassword,
          firstName: payload.firstName,
          lastName: payload.lastName,
          phone: payload.phone,
          address: payload.address,
          profilePicture: profilePicture,
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

  /**
   * It logs out the user
   * @param {Request} req - Request - The request object
   * @param {Response} res - Response - The response object that will be sent back to the client
   */
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

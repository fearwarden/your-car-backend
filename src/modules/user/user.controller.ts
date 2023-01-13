import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import RESTResponse from "../../utils/RESTResponse";
import { HTTPResponses } from "../../constants/HTTPResponses";
import { changePasswordDto } from "./dtos/changePassword.dto";
import * as bcrypt from "bcrypt";
import { hashPassword } from "../../utils/helperFunctions";

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

  /**
   * It takes a request, checks if the data is valid, checks if the current password is correct, hashes
   * the new password, and updates the user's password
   * @param {Request} req - Request - the request object
   * @param {Response} res - Response - the response object
   * @returns The response is being returned.
   */
  static async changePassword(req: Request, res: Response): Promise<Response> {
    const payload = req.body;
    const userId: any = req.user;
    let user: any;
    try {
      changePasswordDto.parse(payload);
    } catch (error) {
      return res
        .status(401)
        .send(
          RESTResponse.createResponse(false, HTTPResponses.INVALID_DATA, {})
        );
    }
    try {
      user = await this.prisma.user.findUnique({
        where: {
          id: userId.id,
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
    const passMatch = await bcrypt.compare(
      payload.currentPassword,
      user.password
    );
    if (!passMatch) {
      return res
        .status(401)
        .send(
          RESTResponse.createResponse(
            false,
            HTTPResponses.INCORRECT_PASSWORD,
            {}
          )
        );
    }
    const hashedPassword = await hashPassword(payload.password);
    try {
      const changedPassword = await this.prisma.user.update({
        where: {
          id: userId.id,
        },
        data: {
          password: hashedPassword,
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
}

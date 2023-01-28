// Packges
import { Request, Response } from "express";
import { PrismaClient, User, ForgotPassword } from "@prisma/client";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
// DTOs
import { changePasswordDto } from "./dtos/changePassword.dto";
import { resetPasswordDto } from "./dtos/resetPassword.dto";
import { hashPassword } from "../../utils/helperFunctions";
import { forgotPasswordDto } from "./dtos/forgotPassword.dto";
import { updateDto } from "./dtos/updateUser.dto";
//Helpers
import RESTResponse from "../../utils/RESTResponse";
import { HTTPResponses } from "../../constants/HTTPResponses";
import { sendMail } from "../../mailSystem/mailer";
import { generateLink } from "../../utils/helperFunctions";
import prisma from "../../database/client";
import { AppError } from "../../utils/AppError";
import { HTTPCodeStatus } from "../../constants/HTTPCodeStatus";

export class UserController {

  /**
   * It updates a user's profile
   * @param {Request} req - Request - The request object
   * @param {Response} res - Response - The response object
   * @returns The user object is being returned.
   */
  static async update(req: Request, res: Response): Promise<Response> {
    const payload = req.body;
    const userId: any = req.user;

    const validation = updateDto.safeParse(payload);
    if (!validation.success) throw validation.error;
    const user: User | null = await prisma.user.update({
      where: {
        id: userId.id,
      },
      data: payload,
    });
    return res
      .status(202)
      .send(RESTResponse.createResponse(true, HTTPResponses.OK, { user }));
  }

  /**
   * It deletes a user from the database
   * @param {Request} req - Request - The request object
   * @param {Response} res - Response - The response object
   * @returns The response object is being returned.
   */
  static async remove(req: Request, res: Response): Promise<Response> {
    const userId: any = req.user;
    const deletedUser: User | null = await prisma.user.delete({
      where: {
        id: userId.id,
      },
    });
    return res
      .status(202)
      .send(RESTResponse.createResponse(true, HTTPResponses.OK, {}));
  }

  /**
   * Returns the user's personal information.
   * @param {Request} req - Request
   * @param {Response} res - Response
   * @returns The user's personal information.
   */
  static async personalInfo(req: Request, res: Response): Promise<Response> {
    const payload: any = req.user;
    let user: User | null;
    try {
      user = await prisma.user.findUnique({
        where: {
          id: payload.id,
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
        email: user!.email,
        firstName: user!.firstName,
        lastName: user!.lastName,
        phone: user!.phone,
        address: user!.address,
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
    let user: User | null;
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
      user = await prisma.user.findUnique({
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
      user!.password
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
      const changedPassword = await prisma.user.update({
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

  /**
   * It takes an email, checks if it exists in the database, generates a link, and sends email to user
   * with link where user can change his password
   * @param {Request} req - Request -&gt; The request object
   * @param {Response} res - Response
   * @returns A response object.
   */
  static async forgotPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;
    try {
      forgotPasswordDto.parse({ email });
    } catch (error) {
      return res
        .status(401)
        .send(
          RESTResponse.createResponse(false, HTTPResponses.INVALID_DATA, {})
        );
    }
    let user: User | null;
    try {
      user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res
          .status(404)
          .send(
            RESTResponse.createResponse(
              false,
              HTTPResponses.USER_DOES_NOT_EXIST,
              {}
            )
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
    const forgotPasswordId = randomUUID();
    const link = generateLink(forgotPasswordId, "forgot-password");
    try {
      const forgotPass = await prisma.forgotPassword.create({
        data: {
          id: forgotPasswordId,
          userId: user.id,
        },
      });
      sendMail(process.env.SMTP_USER!, email, "Forgot Password", link);
    } catch (error) {
      console.log(error);
      return res.send("error");
    }
    return res
      .status(201)
      .send(RESTResponse.createResponse(true, HTTPResponses.OK, { link }));
  }

  /**
   * It takes a password,a confirmation password and forgot password id from url, and if they match,
   * it hashes the password and
   * updates the user's password in the database
   * @param {Request} req - Request, res: Response
   * @param {Response} res - Response
   * @returns A response object.
   */
  static async resetPassword(req: Request, res: Response): Promise<Response> {
    const { password, confirmPassword } = req.body;
    const forgotPassId: string = req.params.id;
    try {
      resetPasswordDto.parse({ password, confirmPassword, forgotPassId });
    } catch (error) {
      return res
        .status(401)
        .send(
          RESTResponse.createResponse(false, HTTPResponses.INVALID_DATA, {})
        );
    }
    let forgotPassword: ForgotPassword | null;
    try {
      forgotPassword = await prisma.forgotPassword.findUnique({
        where: {
          id: forgotPassId,
        },
      });
      if (!forgotPassword) {
        return res
          .status(400)
          .send(
            RESTResponse.createResponse(false, HTTPResponses.BAD_REQUEST, {})
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
    try {
      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.update({
        where: {
          id: forgotPassword.userId,
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

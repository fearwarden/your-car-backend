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
      .status(HTTPCodeStatus.ACCEPTED)
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
      .status(HTTPCodeStatus.ACCEPTED)
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
    const user: User | null = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    return res.status(HTTPCodeStatus.OK).send(
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

    const validation = changePasswordDto.safeParse(payload);
    if (!validation.success) throw validation.error;
    const user: User | null = await prisma.user.findUnique({
      where: {
        id: userId.id,
      },
    });
    const passMatch = await bcrypt.compare(
      payload.currentPassword,
      user!.password
    );
    if (!passMatch) {
      throw new AppError(
        HTTPResponses.INCORRECT_PASSWORD,
        HTTPCodeStatus.UNAUTHORIZED
      );
    }
    const hashedPassword = await hashPassword(payload.password);

    const changedPassword = await prisma.user.update({
      where: {
        id: userId.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    return res
      .status(HTTPCodeStatus.OK)
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

    const validation = forgotPasswordDto.safeParse({ email });
    if (!validation.success) throw validation.error;

    const user: User | null = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new AppError(
        HTTPResponses.USER_DOES_NOT_EXIST,
        HTTPCodeStatus.USER_DOES_NOT_EXIST
      );
    }

    const forgotPasswordId = randomUUID();
    const link = generateLink(forgotPasswordId, "forgot-password");

    const forgotPass = await prisma.forgotPassword.create({
      data: {
        id: forgotPasswordId,
        userId: user.id,
      },
    });
    sendMail(process.env.SMTP_USER!, email, "Forgot Password", link);

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

    const validation = resetPasswordDto.safeParse({
      password,
      confirmPassword,
      forgotPassId,
    });
    if (!validation.success) throw validation.error;

    const forgotPassword: ForgotPassword | null =
      await prisma.forgotPassword.findUnique({
        where: {
          id: forgotPassId,
        },
      });
    if (!forgotPassword) {
      throw new AppError(HTTPResponses.BAD_REQUEST, HTTPCodeStatus.BAD_REQUEST);
    }
    const hashedPassword: string = await hashPassword(password);
    const user: User | null = await prisma.user.update({
      where: {
        id: forgotPassword.userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    return res
      .status(201)
      .send(RESTResponse.createResponse(true, HTTPResponses.OK, {}));
  }
}

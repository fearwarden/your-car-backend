// Packages
import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
// DTOs
import { RegisterDto } from "./dtos/register.dto";
// Helpers
import RESTResponse from "../../utils/RESTResponse";
import { HTTPResponses } from "../../constants/HTTPResponses";
import { hashPassword } from "../../utils/helperFunctions";
import { AppError } from "../../utils/AppError";
import { HTTPCodeStatus } from "../../constants/HTTPCodeStatus";

// Prisma client instantiation
const prisma: PrismaClient = new PrismaClient();

export class AuthController {
  /**
   * It takes a payload with user credentials and creates a user.
   * @param {Request} req - Request - The request object with email, password, confirmPassword, firstName, lastName
   * @param {Response} res - Response - the response object w
   * @returns The response is being returned.
   */
  static async register(req: Request, res: Response): Promise<Response> {
    const payload = req.body;
    const validation = RegisterDto.safeParse(payload);
    if (!validation.success) throw validation.error;

    const user: User | null = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (user) {
      throw new AppError(HTTPResponses.USER_EXIST, HTTPCodeStatus.USER_EXIST);
    }
    const hashedPassword = await hashPassword(payload.password);
    let profilePicture: string;
    if (!payload.profilePicture) {
      profilePicture = "/uploads/profiles/avatar.webp";
    } else {
      profilePicture = payload.profilePicture;
    }

    const createdUser: User | null = await prisma.user.create({
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
    return res
      .status(201)
      .send(RESTResponse.createResponse(true, HTTPResponses.OK, {}));
  }

  /**
   * This function is called when a user logs in. It sets the session variable to the user's session.
   * @param {Request} req - Request - The request object
   * @param {Response} res - Response - The response object
   * @returns The session object.
   */
  static async login(req: Request, res: Response): Promise<Response> {
    const session = req.session;
    return res
      .status(201)
      .send(RESTResponse.createResponse(true, HTTPResponses.OK, { session }));
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

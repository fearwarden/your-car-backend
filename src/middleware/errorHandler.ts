import { Request, Response, NextFunction } from "express";
import { HTTPCodeStatus } from "../constants/HTTPCodeStatus";
import { HTTPResponses } from "../constants/HTTPResponses";
import RESTResponse from "../utils/RESTResponse";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);
  // Rest of error goes here

  if (error.name === "ZodError") {
    return res
      .status(401)
      .send(RESTResponse.createResponse(false, HTTPResponses.INVALID_DATA, {}));
  }

  if (error instanceof AppError) {
    return res
      .status(error.statusCode)
      .send(RESTResponse.createResponse(false, error.message, {}));
  }

  return res
    .status(HTTPCodeStatus.INTERNAL_SERVER_ERROR)
    .send(
      RESTResponse.createResponse(
        false,
        HTTPResponses.INTERNAL_SERVER_ERROR,
        {}
      )
    );
};

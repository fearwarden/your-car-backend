import path from "path";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { HTTPCodeStatus } from "../constants/HTTPCodeStatus";

export const mediaExtentionLimiter = (allowedExtArray: [{}]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const medias: any = req.files;

    const fileExtensions: {}[] = [];
    Object.keys(medias).forEach((key) => {
      fileExtensions.push(path.extname(medias[key].name));
    });

    // Are the file extension allowed
    const allowed = fileExtensions.every((ext) =>
      allowedExtArray.includes(ext)
    );

    if (!allowed) {
      const message = "Upload failed. Only .png, .jpg and jpeg are allowed.";
      throw new AppError(message, HTTPCodeStatus.BAD_REQUEST);
    }
    next();
  };
};

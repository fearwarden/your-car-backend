import path from "path";
import * as fs from "fs";
import fileUpload from "express-fileupload";
import { AppError } from "../AppError";
import { HTTPResponses } from "../../constants/HTTPResponses";
import { HTTPCodeStatus } from "../../constants/HTTPCodeStatus";

export function handlePostPictures(images: any, userId: any, postId: string) {
  const rootPath: string = process.env.UPLOAD_ROOT_PATH_POSTS!;

  if (!fs.existsSync(rootPath)) {
    throw new AppError(
      HTTPResponses.INTERNAL_SERVER_ERROR,
      HTTPCodeStatus.INTERNAL_SERVER_ERROR
    );
  }

  const folderWithUserId = path.join(rootPath, userId.toString(), postId);
  fs.mkdirSync(folderWithUserId, { recursive: true }); // recursive: true will create all the necessary parent directories if they don't already exist.
  console.log(images.image);
  for (let i = 0; i < images.image.length; i++) {
    const imageFinalPath = path.join(folderWithUserId, images.image[i].name);
    console.log(imageFinalPath);
    console.log(images.image[i].data);
    try {
      fs.writeFileSync(imageFinalPath, images.image[i].data);
    } catch (error) {
      throw new AppError(
        HTTPResponses.IMAGE_ALREADY_EXIST,
        HTTPCodeStatus.USER_EXIST
      );
    }
  }
}
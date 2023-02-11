import path from "path";
import { AppError } from "../AppError";
import { HTTPResponses } from "../../constants/HTTPResponses";
import { HTTPCodeStatus } from "../../constants/HTTPCodeStatus";

export function handleProfilePicture(image: any) {
  let filePath: any;
  const rootPath: string = process.env.UPLOAD_ROOT_PATH_PROFILE!;
  Object.keys(image).forEach((key) => {
    filePath = path.join(rootPath, image[key].name);
    image[key].mv(filePath, (err: any) => {
      if (err) {
        console.log(err);
        throw new AppError(
          HTTPResponses.BAD_REQUEST,
          HTTPCodeStatus.BAD_REQUEST
        );
      }
    });
  });
  return filePath;
}

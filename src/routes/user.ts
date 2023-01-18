require("express-group-routes");
import { Application, Request, Response } from "express";
import { UserController } from "../modules/user/user.controller";
import { isLoggedIn } from "../modules/auth/strategy/passport";

export function userRoutes(app: any): Application {
  app.group("/api/v1/user", (router: any) => {
    router.get("/personal-info", isLoggedIn, (req: Request, res: Response) => {
      UserController.personalInfo(req, res);
    });
    router.post(
      "/change-password",
      isLoggedIn,
      (req: Request, res: Response) => {
        UserController.changePassword(req, res);
      }
    );
    router.post("/forgot-password", (req: Request, res: Response) => {
      UserController.forgotPassword(req, res);
    });
    router.post("/reset-password/:id", (req: Request, res: Response) => {
      UserController.resetPassword(req, res);
    });
    router.post("/update", isLoggedIn, (req: Request, res: Response) => {
      UserController.update(req, res);
    });
  });

  return app;
}

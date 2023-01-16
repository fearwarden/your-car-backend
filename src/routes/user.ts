require("express-group-routes");
import { Application, Request, Response } from "express";
import { UserController } from "../modules/user/user.controller";
import { isLoggedIn } from "../modules/auth/strategy/passport";

export function userRoutes(app: any): Application {
  app.group("/api/v1", (router: any) => {
    router.group("/user", (subRouter: any) => {
      // Subroutes under user
      subRouter.get(
        "/personal-info",
        isLoggedIn,
        (req: Request, res: Response) => {
          UserController.personalInfo(req, res);
        }
      );
      subRouter.post(
        "/change-password",
        isLoggedIn,
        (req: Request, res: Response) => {
          UserController.changePassword(req, res);
        }
      );
      subRouter.post("/forgot-password", (req: Request, res: Response) => {
        UserController.forgotPassword(req, res);
      });
      subRouter.post("/reset-password/:id", (req: Request, res: Response) => {
        UserController.resetPassword(req, res);
      });
    });
  });

  return app;
}

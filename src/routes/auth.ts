require("express-group-routes");
import { Application, Request, Response } from "express";
import { AuthController } from "../modules/auth/auth.controller";
import passport from "passport";
import { safeParse } from "../utils/safeParse";

export function authRoutes(app: any): Application {
  app.group("/api/v1", (router: any) => {
    //Login and register
    router.post("/register", safeParse(AuthController.register));
    router.post(
      "/login",
      passport.authenticate("local"),
      safeParse(AuthController.login)
    );

    router.group("/auth", (subRouter: any) => {
      // Subroutes under auth
      subRouter.post("/logout", (req: Request, res: Response) => {
        AuthController.logout(req, res);
      });
    });
  });

  return app;
}

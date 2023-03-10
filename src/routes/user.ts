require("express-group-routes");
import { Application, Request, Response } from "express";
import { UserController } from "../modules/user/user.controller";
import { isLoggedIn } from "../modules/auth/strategy/passport";
import { safeParse } from "../utils/safeParse";

export function userRoutes(app: any): Application {
  app.group("/api/v1/user", (router: any) => {
    router.get(
      "/personal-info",
      isLoggedIn,
      safeParse(UserController.personalInfo)
    );
    router.post(
      "/change-password",
      isLoggedIn,
      safeParse(UserController.changePassword)
    );
    router.post("/forgot-password", safeParse(UserController.forgotPassword));
    router.post("/reset-password/:id", safeParse(UserController.resetPassword));
    router.post("/update", isLoggedIn, safeParse(UserController.update));
    router.delete("/remove", isLoggedIn, safeParse(UserController.remove));
  });

  return app;
}

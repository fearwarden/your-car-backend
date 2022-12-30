require("express-group-routes");
import { Application, Request, Response } from "express";
import { UserController } from "../modules/user/user.controller";

export function initializeRoutes(app: any): Application {
  app.group("/api/v1", (router: any) => {
    //Login and register
    router.post("/register", (req: Request, res: Response) => {
      UserController.register(req, res);
    });

    router.group("/user", (subRouter: any) => {
      // Subroutes under user
    });
  });

  return app;
}

require("express-group-routes");
import { Application, Request, Response } from "express";
import { UserController } from "../modules/user/user.controller";
import { AuthController } from "../modules/auth/auth.controller";
import passport from "passport";
import { isLoggedIn } from "../modules/auth/strategy/passport";
import RESTResponse from "../utils/RESTResponse";
import { HTTPResponses } from "../constants/HTTPResponses";

export function initializeRoutes(app: any): Application {
  app.group("/api/v1", (router: any) => {
    //Login and register
    router.post("/register", (req: Request, res: Response) => {
      AuthController.register(req, res);
    });

    router.post(
      "/login",
      passport.authenticate("local"),
      (req: Request, res: Response) => {
        const session = req.session;
        return res
          .status(201)
          .send(
            RESTResponse.createResponse(true, HTTPResponses.OK, { session })
          );
      }
    );

    router.group("/auth", (subRouter: any) => {
      // Subroutes under auth
      subRouter.post("/logout", (req: Request, res: Response) => {
        AuthController.logout(req, res);
      });
    });

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
    });
  });

  return app;
}

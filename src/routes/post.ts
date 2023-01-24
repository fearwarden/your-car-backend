require("express-group-routes");
import { Application, Request, Response } from "express";
import { isLoggedIn } from "../modules/auth/strategy/passport";
import { PostController } from "../modules/post/post.controller";

export function postRouter(app: any): Application {
  app.group("/api/v1/post", (router: any) => {
    router.post("/create", isLoggedIn, (req: Request, res: Response) => {
      PostController.create(req, res);
    });
    router.get("/:id", isLoggedIn, (req: Request, res: Response) => {
      PostController.getPost(req, res);
    });
  });

  return app;
}

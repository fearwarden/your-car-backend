require("express-group-routes");
import { Application, Request, Response } from "express";
import { isLoggedIn } from "../modules/auth/strategy/passport";
import { PostController } from "../modules/post/post.controller";
import { safeParse } from "../utils/safeParse";

export function postRouter(app: any): Application {
  app.group("/api/v1/post", (router: any) => {
    router.post("/create", isLoggedIn, safeParse(PostController.create));
    router.get("/:id", isLoggedIn, safeParse(PostController.getPost));
    router.delete("/:id", isLoggedIn, safeParse(PostController.deletePost));
  });

  return app;
}

require("express-group-routes");
import { Application } from "express";

export function initializeRoutes(app: any): Application {
  app.group("/api/v1", (router: any) => {
    //Login and register

    router.group("/user", (subRouter: any) => {
      // Subroutes under user
    });
  });

  return app;
}

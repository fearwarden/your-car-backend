import passport, { use } from "passport";
import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { Strategy } from "passport-local";
import prisma from "./db";
import { HTTPResponses } from "../constants/HTTPResponses";
import { User } from "../modules/user/user.model";
import { DeserializedUser } from "../modules/auth/dtos/deserializedUser.dto";
import RESTResponse from "./RESTResponse";
/**
 * Authentication strategy (Username & Password)
 * Since we are using email and password we have to rename the username field to what we use.
 * Attempts to find a user in the db, will approve or reject based on user found and if password matches or not.
 * Hashed using bcrypt
 */

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    const user = await prisma.user.findUnique({ where: { email } });
    const response = HTTPResponses.INVALID_USER;
    
    if (!user) return done(response);
    else if (user) {
      const passMatch = await bcrypt.compare(password, user.password);

      if (passMatch) return done(null, user);

      return done(response);
    }
  })
);

/**
 * Serializes the user, called after login is approved.
 * accesses the user object, resulting in data attached to the session. (Request.session.user)
 */
passport.serializeUser((user, done) => {
  done(null, (user as User).id);
});

/**
 * Deserialize the user, on every session request through the used passport strategy. (Local / email & password)
 */
passport.deserializeUser(async (id: string | number, done) => {
  const payload = await prisma.user.findUnique({
    where: { id: parseInt(id.toString()) },
  });
  if (!payload) return done("No user to deserialize");
  let user: DeserializedUser = {
      id: payload?.id,
  }
  return done(null, user);
});

/**
 * Login middleware
 * */
export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();

  return res
    .status(401)
    .send(RESTResponse.createResponse(false, HTTPResponses.UNAUTHORIZED, {}));
};

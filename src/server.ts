import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express } from "express";
import session from "express-session";
import passport from "passport";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/user";
import FileStore from "session-file-store";
import path from "path";
import fileUpload from "express-fileupload";

dotenv.config();

const sessionFileStore: FileStore.FileStore = FileStore(session);

const app: Express = express();

// Statiac path
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET!,
    store: new sessionFileStore({ path: "./sessions" }),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 1, sameSite: "lax" }, // 1 day expiration
  })
);
app.use(passport.initialize());
app.use(passport.session());
import "./modules/auth/strategy/passport";
import { postRouter } from "./routes/post";
import { errorHandler } from "./middleware/errorHandler";

const port = process.env.PORT === "test" ? 8081 : 3000;

app.use(fileUpload());
authRoutes(app);
userRoutes(app);
postRouter(app);

// error handler middleware
app.use(errorHandler);
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
export default app;

import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express } from "express";
import session from "express-session";
import passport from "passport";
import { initializeRoutes } from "./routes/routes";
import FileStore from "session-file-store";

dotenv.config();

const sessionFileStore: FileStore.FileStore = FileStore(session);

const app: Express = express();
// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET!,
    store: new sessionFileStore({ path: "./sessions" }),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 1, sameSite: "lax" }, // 1 day expiration
  })
);
app.use(passport.initialize());
app.use(passport.session());
import "./utils/passport";
import { dir } from "console";
import { dirname } from "path";

const port = process.env.PORT || 3000;

initializeRoutes(app);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

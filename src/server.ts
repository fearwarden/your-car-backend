import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Express } from "express";
import { initializeRoutes } from "./routes/routes";

dotenv.config();

const app: Express = express();
// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

initializeRoutes(app);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

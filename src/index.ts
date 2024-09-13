import dotenv from "dotenv";
import { App } from "./app";
import { AuthController } from "./resources/auth/auth.controler";
import { UserController } from "./resources/user/user.controller";
import { ProjectController } from "./resources/projects/project.controller";

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

const app = new App(
  [new AuthController(), new UserController(), new ProjectController()],
  PORT,
);

app.listen();

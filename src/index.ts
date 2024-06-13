import dotenv from "dotenv";
import { App } from "./app";
import { AuthController } from "./resources/auth/auth.controler";
import { Feedscontroller } from "./resources/feeds/controller";
import { UserController } from "./resources/user/user.controller";

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

const app = new App(
  [new AuthController(), new Feedscontroller(), new UserController()],
  PORT
);

app.listen();

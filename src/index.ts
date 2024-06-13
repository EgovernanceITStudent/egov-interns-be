import dotenv from "dotenv";
import { App } from "./app";
import { Authcontroller } from "./resources/auth/auth.controler";
import { Feedscontroller } from "./resources/feeds/controller";
import { User } from "./resources/users/controller";

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

const app = new App(
  [new Authcontroller(), new Feedscontroller(), new User()],
  PORT
);

app.listen();

import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const connectionString = (
  process.env.NODE_ENV === "production"
    ? process.env.DB_CONNECTION_STRING
    : process.env.DB_CONNECTION_STRING
) as string;

export const db = new Sequelize(connectionString, { dialect: "postgres" });
// db.authenticate()

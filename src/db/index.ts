import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DB_CONNECTION_STRING as string;

export const db = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: false,
});
// db.authenticate()

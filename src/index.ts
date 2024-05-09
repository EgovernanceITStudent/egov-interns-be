import dotenv from 'dotenv'
import { App } from './app'
import  {Pool} from 'pg'
import {Sequelize} from 'sequelize'
dotenv.config()

const connectionString = 'postgres://postgres.skjxbwzncomrweitcmfh:pHW9qZsUDZxf4xOU@aws-0-us-west-1.pooler.supabase.com:5432/postgres';
//connecting to database
const sequelize = new Sequelize(connectionString)

module.exports = {
    // querying:pool.query()
}
const app = new App([],3000);
app.listen()
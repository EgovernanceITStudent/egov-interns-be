import dotenv from 'dotenv'
import { App } from './app'
import { Authcontroller } from './resources/auth/controller'

dotenv.config()

const app = new App([new Authcontroller()],process.env.PORT as unknown as number);
app.listen()
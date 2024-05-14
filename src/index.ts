import dotenv from 'dotenv'
import { App } from './app'
import { Authcontroller } from './resources/auth/controller'
import { Feedscontroller } from './resources/feeds/controller';

dotenv.config()

const app = new App([new Authcontroller(),new Feedscontroller()],process.env.PORT as unknown as number);
app.listen()
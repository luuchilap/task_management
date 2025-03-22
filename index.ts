import express, { Express } from 'express';
import database from './config/database';
import systemConfig from './config/system';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routeApiVer1 from './api/v1/routes/index.route';

dotenv.config();
database.connect();

const app: Express = express();
const port: string | undefined = process.env.PORT;

app.locals.prefix = systemConfig.prefix;

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

routeApiVer1(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
}); 
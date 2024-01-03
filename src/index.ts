import * as cookieParser from 'cookie-parser';
import * as cors from "cors";
import * as express from "express";
import * as formData from 'express-form-data';
import * as helmet from "helmet";
import "reflect-metadata";
import * as morgan from "morgan";
import { createConnection } from "typeorm";
import routes from "./routes";
import config from './config/config';

//Connects to the Database -> then starts the express
createConnection()
    .then(async (connection) => {
        // Create a new express application instance
        const app = express();

        // Call midlewares
        app.use(cors());
        app.use(helmet());
        app.use(morgan('common'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(formData.parse());
        app.use(cookieParser());

        //Set all routes from routes folder
        app.use("/api", routes);

        app.listen(config.port, () => {
            console.log(`Server started on port ${config.port}!`);
        });
    })
    .catch(error => console.log(error));

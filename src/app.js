import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { JSON_LIMIT } from './constants.js';

const app = express();

app.use(express.json({limit: JSON_LIMIT})) // this specifies the maximum size of incoming json payload
app.use(express.urlencoded({extended: true, limit:JSON_LIMIT}))
app.use(express.static("public"))
app.use(cookieParser())

import scrapeRoutes from "./routes/scrapper.routes.js";


app.use("/api/scrape", scrapeRoutes);

export { app }
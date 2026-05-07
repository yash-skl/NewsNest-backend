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
import authRoutes from "./routes/auth.routes.js"
import storyRoutes from "./routes/story.routes.js"


app.use("/api/v1/scrape", scrapeRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/stories", storyRoutes);

export { app }
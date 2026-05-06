import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({limit: JSON_LIMIT})) // this specifies the maximum size of incoming json payload
app.use(express.urlencoded({extended: true, limit:JSON_LIMIT}))
app.use(express.static("public"))
app.use(cookieParser())

export { app }
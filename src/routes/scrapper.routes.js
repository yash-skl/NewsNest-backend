import express from "express";
import { scrapeNews } from "../controllers/scrapper.controllers.js";

const router = express.Router();

router.post("/", scrapeNews);

export default router;
import { Router } from "express";
import { scrapeNews } from "../controllers/scrapper.controllers.js";

const router = Router();

router.post("/", scrapeNews);

export default router;
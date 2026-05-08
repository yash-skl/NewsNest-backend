import { Router } from "express";
import { fetchAllStories, fetchBookmarks, getStoryById, toggleBookmark } from "../controllers/story.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();

router.route("/").get(fetchAllStories)
router.route("/bookmarks").get(verifyJWT, fetchBookmarks)
router.route("/:id").get(getStoryById)
router.route("/:id/bookmark").post(verifyJWT, toggleBookmark)

export default router;
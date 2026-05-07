import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Story } from "../models/story.models.js";
import { User } from "../models/user.models.js";

const fetchAllStories = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const stories = await Story.find()
        .sort({ points: -1 })
        .skip(skip)
        .limit(limit)
        .lean()

    const allStories = await Story.countDocuments();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                currPage: page,
                totPages: Math.ceil(allStories / limit),
                allStories,
                stories
            },
            "Stories fetched successfully"
        )
    );
});


// Get story by id
const getStoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const story = await Story.findById(id);

    if (!story) {
        throw new ApiError(404, "Story not found")
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            story,
            "Story fetched successfully"
        )
    );
});

// toggle bookmark
const toggleBookmark = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    const storyId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "user not found")
    }

    const alreadyMarked = user.bookmarks.includes(storyId);

    if (alreadyMarked) {

        await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    bookmarks: storyId
                }
            },
            {
                new: true
            }
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Bookmark removed successfully"
            )
        );

    } else {

        await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    bookmarks: storyId
                }
            },
            {
                new: true
            }
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Bookmark added successfully"
            )
        );
    }
});

export { fetchAllStories, getStoryById, toggleBookmark };
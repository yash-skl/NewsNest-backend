import { scrapeStories } from "../service/scrapper.service.js";

export const scrapeNews = async (req, res) => {
  try {
    const stories = await scrapeStories();

    res.status(200).json({
      success: true,
      message: "Stories scraped successfully",
      data: stories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
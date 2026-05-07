import axios from "axios";
import * as cheerio from "cheerio";
import { Story } from "../models/story.models.js";

const HN_URL = "https://news.ycombinator.com/";

export const scrapeStories = async () => {
    try {
        const { data } = await axios.get(HN_URL);

        const $ = cheerio.load(data);

        const stories = [];

        $(".athing")
            .slice(0, 10)
            .each((index, element) => {
                // Title
                const title = $(element)
                    .find(".titleline a")
                    .text()
                    .trim();

                // URL
                const url = $(element)
                    .find(".titleline a")
                    .attr("href");

                // Metadata row
                const subtext = $(element).next();

                // Points
                const pointsText = subtext
                    .find(".score")
                    .text()
                    .trim();

                const points = parseInt(pointsText) || 0;

                // Author
                const author = subtext
                    .find(".hnuser")
                    .text()
                    .trim();

                // Posted Time
                const ageText = subtext
                    .find(".age")
                    .text()
                    .trim();

                // Convert to Date (optional basic handling)
                const postedAt = new Date();

                stories.push({
                    title,
                    url,
                    points,
                    author,
                    postedAt,
                });
            });

        // Save stories to MongoDB
        for (const story of stories) {
            await Story.findOneAndUpdate(
                { url: story.url },
                story,
                {
                    upsert: true,
                    returnDocument: "after",
                }
            );
        }

        console.log("Stories scraped successfully");

        return stories;
    } catch (error) {
        console.error("Error scraping stories:", error.message);
    }
};
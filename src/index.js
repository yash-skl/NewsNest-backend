import {app} from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './db/index.js';
import { scrapeStories } from './service/scrapper.service.js';


dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 3000;

connectDB().then(async () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  await scrapeStories();
});
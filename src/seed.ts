import "dotenv/config";
import { connectDatabase } from "./db.js";
import { ExplorePromptModel } from "./models.js";

const prompts = [
  { question: "What game could you play for hours without getting bored?", category: "gaming" },
  { question: "What song always improves your mood?", category: "music" },
  { question: "Which movie do you wish you could watch again for the first time?", category: "movies" },
  { question: "What is your ideal comfort meal?", category: "food" },
  { question: "What technology are you most curious about right now?", category: "tech" },
  { question: "What is a belief you changed your mind about?", category: "deep-talks" },
];

await connectDatabase();
await ExplorePromptModel.bulkWrite(prompts.map((prompt) => ({ updateOne: { filter: prompt, update: { $set: prompt }, upsert: true } })));
console.log(`Seeded ${prompts.length} Orbit prompts.`);
process.exit(0);

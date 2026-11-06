import "dotenv/config";
import { app } from "./app.js";
import { connectDatabase } from "./db.js";

const port = Number(process.env.PORT ?? 3001);

await connectDatabase();
app.listen(port, () => console.log(`Orbit API listening on port ${port}`));

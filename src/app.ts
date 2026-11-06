import cors from "cors";
import express from "express";

export const app = express();

app.use(express.json({ limit: "32kb" }));
app.use(cors({ origin: true, methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"] }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", service: "orbit-api" });
});

app.use((_request, response) => {
  response.status(404).json({ error: "not_found", message: "Route not found." });
});

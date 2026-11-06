import cors from "cors";
import express from "express";
import router from "./routes.js";

export const app = express();

app.use(express.json({ limit: "32kb" }));
app.use(cors({ origin: true, methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"] }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", service: "orbit-api" });
});

app.use("/api", router);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof Error && error.name === "ZodError") {
    response.status(400).json({ error: "validation_error", message: "Request validation failed." });
    return;
  }
  response.status(500).json({ error: "internal_error", message: "Something went wrong." });
});

app.use((_request, response) => {
  response.status(404).json({ error: "not_found", message: "Route not found." });
});

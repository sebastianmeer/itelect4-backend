import request from "supertest";
import { app } from "../src/app.js";

describe("health endpoint", () => {
  it("returns a safe service status without database secrets", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok", service: "orbit-api" });
    expect(JSON.stringify(response.body)).not.toContain("MONGODB");
  });
});

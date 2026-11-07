import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { issueToken } from "../src/auth.js";

describe("POST /api/ai", () => {
  it("rejects requests without a bearer token", async () => {
    const response = await request(app).post("/api/ai").send({ prompt: "A thoughtful prompt that is long enough." });
    expect(response.status).toBe(401);
  });

  it("accepts a valid token before reporting unavailable provider configuration", async () => {
    process.env.JWT_SECRET = "test-secret";
    delete process.env.GEMINI_API_KEY;
    const response = await request(app)
      .post("/api/ai")
      .set("Authorization", `Bearer ${issueToken("507f1f77bcf86cd799439011")}`)
      .send({ prompt: "A thoughtful prompt that is long enough for validation." });
    expect(response.status).toBe(502);
    expect(response.body.error).toBe("ai_unavailable");
  });
});

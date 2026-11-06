import { describe, expect, it } from "vitest";
import { aiRequestSchema, aiReviewSchema } from "../src/ai.js";

describe("AI contracts", () => {
  it("requires a bounded coaching prompt", () => {
    expect(aiRequestSchema.safeParse({ prompt: "too short" }).success).toBe(false);
    expect(aiRequestSchema.safeParse({ prompt: "A thoughtful conversation opener about a shared interest." }).success).toBe(true);
  });

  it("rejects untrusted provider output outside the readiness enum", () => {
    expect(aiReviewSchema.safeParse({ summary: "ok", strengths: ["kind"], improvements: ["ask why"], readiness: "unknown" }).success).toBe(false);
  });
});

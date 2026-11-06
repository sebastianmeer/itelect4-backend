import { z } from "zod";

export const aiRequestSchema = z.object({
  prompt: z.string().trim().min(20).max(2000),
});

export const aiReviewSchema = z.object({
  summary: z.string().min(1).max(1000),
  strengths: z.array(z.string().min(1).max(300)).min(1).max(3),
  improvements: z.array(z.string().min(1).max(300)).min(1).max(3),
  readiness: z.enum(["ready", "almost", "not-yet"]),
});

export type AiReview = z.infer<typeof aiReviewSchema>;

const SYSTEM_PROMPT = `You are Orbit's thoughtful conversation coach. Help people create meaningful connections through curiosity and respect. Review the user's idea as text only; never infer sensitive traits or make claims about another person. Return JSON with summary, strengths, improvements, and readiness. Keep every field concise and actionable.`;

export async function reviewWithGemini(prompt: string): Promise<AiReview> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured.");

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: `Review only the text between the delimiters.\n<orbit-user-text>\n${prompt}\n</orbit-user-text>` }] }],
      generationConfig: { responseMimeType: "application/json" },
    }),
  });
  if (!response.ok) throw new Error("Gemini request failed.");
  const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no content.");
  const parsed: unknown = JSON.parse(text);
  return aiReviewSchema.parse(parsed);
}

import { Router } from "express";
import { z } from "zod";
import { ExplorePromptModel, ExploreResponseModel, UserModel } from "./models.js";
import { hashPassword, issueToken, requireAuth, verifyPassword } from "./auth.js";

const router = Router();
const credentials = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().toLowerCase().email(), password: z.string().min(8).max(128) });
const responseInput = z.object({ promptId: z.string().length(24), body: z.string().trim().min(10).max(280), authorName: z.string().trim().min(2).max(40).optional() });
const publicUser = (user: { _id: unknown; name: string; email: string }) => ({ id: String(user._id), name: user.name, email: user.email });

router.post("/auth/register", async (request, response, next) => {
  try {
    const input = credentials.parse(request.body);
    const existing = await UserModel.findOne({ email: input.email });
    if (existing) { response.status(409).json({ error: "email_exists", message: "An account already exists for this email." }); return; }
    const user = await UserModel.create({ ...input, passwordHash: await hashPassword(input.password) });
    response.status(201).json({ token: issueToken(String(user._id)), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.post("/auth/login", async (request, response, next) => {
  try {
    const input = credentials.pick({ email: true, password: true }).parse(request.body);
    const user = await UserModel.findOne({ email: input.email });
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) { response.status(401).json({ error: "invalid_credentials", message: "Invalid email or password." }); return; }
    response.json({ token: issueToken(String(user._id)), user: publicUser(user) });
  } catch (error) { next(error); }
});

router.get("/prompts", async (_request, response, next) => { try { response.json(await ExplorePromptModel.find().sort({ createdAt: -1 }).lean()); } catch (error) { next(error); } });
router.get("/prompts/:id", async (request, response, next) => { try { const prompt = await ExplorePromptModel.findById(request.params.id).lean(); if (!prompt) { response.status(404).json({ error: "not_found", message: "Prompt not found." }); return; } response.json(prompt); } catch (error) { next(error); } });

router.use("/responses", requireAuth);
router.get("/responses", async (request, response, next) => { try { response.json(await ExploreResponseModel.find({ userId: request.userId, ...(typeof request.query.promptId === "string" ? { promptId: request.query.promptId } : {}) }).sort({ createdAt: -1 }).lean()); } catch (error) { next(error); } });
router.get("/responses/:id", async (request, response, next) => { try { const item = await ExploreResponseModel.findOne({ _id: request.params.id, userId: request.userId }).lean(); if (!item) { response.status(404).json({ error: "not_found", message: "Response not found." }); return; } response.json(item); } catch (error) { next(error); } });
router.post("/responses", async (request, response, next) => { try { const input = responseInput.parse(request.body); const prompt = await ExplorePromptModel.findById(input.promptId); if (!prompt) { response.status(400).json({ error: "invalid_prompt", message: "Prompt not found." }); return; } const item = await ExploreResponseModel.create({ ...input, userId: request.userId }); response.status(201).json(item); } catch (error) { next(error); } });
router.patch("/responses/:id", async (request, response, next) => { try { const input = responseInput.pick({ body: true, authorName: true }).partial().parse(request.body); const item = await ExploreResponseModel.findOneAndUpdate({ _id: request.params.id, userId: request.userId }, input, { new: true, runValidators: true }).lean(); if (!item) { response.status(404).json({ error: "not_found", message: "Response not found." }); return; } response.json(item); } catch (error) { next(error); } });
router.delete("/responses/:id", async (request, response, next) => { try { const item = await ExploreResponseModel.findOneAndDelete({ _id: request.params.id, userId: request.userId }); if (!item) { response.status(404).json({ error: "not_found", message: "Response not found." }); return; } response.status(204).send(); } catch (error) { next(error); } });

export default router;

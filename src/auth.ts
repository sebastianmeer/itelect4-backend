import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";

const secret = (): string => process.env.JWT_SECRET ?? "development-only-secret";

export const hashPassword = (password: string): Promise<string> => bcrypt.hash(password, 12);
export const verifyPassword = (password: string, hash: string): Promise<boolean> => bcrypt.compare(password, hash);
export const issueToken = (userId: string): string => jwt.sign({ sub: userId }, secret(), { expiresIn: "7d" });

declare global {
  namespace Express { interface Request { userId?: string } }
}

export const requireAuth: RequestHandler = (request, response, next) => {
  const header = request.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) { response.status(401).json({ error: "unauthorized", message: "Authentication required." }); return; }
  try {
    const payload = jwt.verify(token, secret());
    if (typeof payload === "string" || !payload.sub) throw new Error("invalid subject");
    request.userId = payload.sub;
    next();
  } catch { response.status(401).json({ error: "unauthorized", message: "Authentication required." }); }
};

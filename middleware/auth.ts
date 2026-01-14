import express from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends express.Request {
  userId?: string;
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const auth = req.headers.authorization;
  console.log(`[auth] ${req.method} ${req.url} - auth=${auth ? '[REDACTED]' : 'none'}`);
  if (!auth || !auth.startsWith("Bearer ")) {
    console.log("[auth] Missing or invalid Authorization header");
    return res.status(401).json({ message: "Unauthorised" });
  }

  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "") as any;
    req.userId = payload.sub;
    console.log(`[auth] Token valid, userId=${payload.sub}`);
    return next();
  } catch (err: any) {
    console.log('[auth] Token verification failed', err?.message ?? err);
    return res.status(401).json({ message: "Unauthorised" });
  }
};

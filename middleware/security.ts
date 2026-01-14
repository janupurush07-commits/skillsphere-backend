import { Request, Response, NextFunction } from "express";

export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Minimal security placeholder — add helmet/cors in future
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
};

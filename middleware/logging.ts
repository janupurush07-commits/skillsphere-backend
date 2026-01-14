import { Request, Response, NextFunction } from "express";

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req;
  const safeHeaders = { ...req.headers } as any;
  if (safeHeaders.authorization) safeHeaders.authorization = '[REDACTED]';
  console.log(`[req] ${new Date().toISOString()} ${method} ${url} headers=${JSON.stringify(safeHeaders)}`);
  // capture body if present (may be large in production)
  if ((req as any).body && Object.keys((req as any).body).length > 0) {
    try {
      console.log(`[req.body] ${JSON.stringify((req as any).body)}`);
    } catch (e) {
      console.log('[req.body] <unserializable>');
    }
  }
  next();
};

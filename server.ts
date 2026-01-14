// src/server.ts
import express from "express";
import { loggingMiddleware } from "./middleware/logging";
import { securityMiddleware } from "./middleware/security";
import { parserMiddleware } from "./middleware/parsers";
import { rateLimiter } from "./middleware/rateLimiter";
import { authRouter } from "./routes/auth";
import { requireAuth, AuthenticatedRequest } from "./middleware/auth";
import { profileRouter } from "./routes/profile";
import { skillsRouter } from "./routes/skills";
import { assessmentRouter } from "./routes/assessment";
import { mentorRouter } from "./routes/mentor";
import { projectsRouter } from "./routes/projects";
import { dashboardRouter } from "./routes/dashboard";

const app = express();

// ✅ Apply middleware
// Request logging (first)
app.use(loggingMiddleware);
app.use(securityMiddleware);
app.use(parserMiddleware);
app.use(rateLimiter);

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/assessments", assessmentRouter);
app.use("/api/mentor", mentorRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/dashboard", dashboardRouter);

// Small protected test route to verify req.userId is populated
app.get("/test", requireAuth, (req: AuthenticatedRequest, res: express.Response) => {
  res.json({ userId: req.userId ?? null });
});

app.get("/health", (_: express.Request, res: express.Response) => {
  res.json({ ok: true });
});

// Small unprotected ping route for quick checks
app.get("/ping", (_: express.Request, res: express.Response) => {
  res.json({ ok: true, timestamp: Date.now() });
});

// ✅ Use environment PORT when provided, fall back to 3000
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

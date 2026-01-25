// src/server.ts
import express from "express";
import { securityMiddleware } from "./middleware/security";
import { parserMiddleware } from "./middleware/parsers";
import { rateLimiter } from "./middleware/rateLimiter";
import { authRouter } from "./routes/auth";
import { profileRouter } from "./routes/profile";
import { skillsRouter } from "./routes/skills";
import { assessmentRouter } from "./routes/assessment";
import { mentorRouter } from "./routes/mentor";
import { projectsRouter } from "./routes/projects";
import { dashboardRouter } from "./routes/dashboard";

const app = express();

// ✅ Apply middleware
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

app.get("/health", (_: express.Request, res: express.Response) => {
  res.json({ ok: true });
});

// ✅ Add PORT here, before app.listen
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

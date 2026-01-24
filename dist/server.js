"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const logging_1 = require("./middleware/logging");
const security_1 = require("./middleware/security");
const parsers_1 = require("./middleware/parsers");
const rateLimiter_1 = require("./middleware/rateLimiter");
const auth_1 = require("./routes/auth");
const auth_2 = require("./middleware/auth");
const profile_1 = require("./routes/profile");
const skills_1 = require("./routes/skills");
const assessment_1 = require("./routes/assessment");
const mentor_1 = require("./routes/mentor");
const projects_1 = require("./routes/projects");
const dashboard_1 = require("./routes/dashboard");
const app = (0, express_1.default)();
// ✅ Apply middleware
// Request logging (first)
app.use(logging_1.loggingMiddleware);
app.use(security_1.securityMiddleware);
app.use(parsers_1.parserMiddleware);
app.use(rateLimiter_1.rateLimiter);
// ✅ Routes
app.use("/api/auth", auth_1.authRouter);
app.use("/api/profile", profile_1.profileRouter);
app.use("/api/skills", skills_1.skillsRouter);
app.use("/api/assessments", assessment_1.assessmentRouter);
app.use("/api/mentor", mentor_1.mentorRouter);
app.use("/api/projects", projects_1.projectsRouter);
app.use("/api/dashboard", dashboard_1.dashboardRouter);
// Small protected test route to verify req.userId is populated
app.get("/test", auth_2.requireAuth, (req, res) => {
    res.json({ userId: req.userId ?? null });
});
app.get("/health", (_, res) => {
    res.json({ ok: true });
});
// Small unprotected ping route for quick checks
app.get("/ping", (_, res) => {
    res.json({ ok: true, timestamp: Date.now() });
});
// ✅ Use environment PORT when provided, fall back to 3000
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});

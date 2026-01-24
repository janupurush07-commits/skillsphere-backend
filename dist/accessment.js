"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessmentRouter = void 0;
// src/routes/assessment.ts
const express_1 = require("express");
const prisma_1 = require("./services/prisma");
const auth_1 = require("./middleware/auth");
exports.assessmentRouter = (0, express_1.Router)();
exports.assessmentRouter.post("/mcq", auth_1.requireAuth, async (req, res) => {
    const { prompt, response } = req.body; // response: selected option
    const score = response === "Craft a storyboard of user rituals before writing code" ? 1 : 0;
    const record = await prisma_1.prisma.assessment.create({
        data: { userId: req.userId, type: "MCQ", prompt, response, score }
    });
    res.status(201).json({ assessment: record });
});
exports.assessmentRouter.post("/scenario", auth_1.requireAuth, async (req, res) => {
    const { prompt, response } = req.body; // response: structured text/json
    const record = await prisma_1.prisma.assessment.create({
        data: { userId: req.userId, type: "Scenario", prompt, response }
    });
    res.status(201).json({ assessment: record });
});

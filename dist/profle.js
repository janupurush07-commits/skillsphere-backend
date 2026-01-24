"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRouter = void 0;
// src/routes/profile.ts
const express_1 = require("express");
const prisma_1 = require("./services/prisma");
const auth_1 = require("./middleware/auth");
exports.profileRouter = (0, express_1.Router)();
// GET profile
exports.profileRouter.get("/", auth_1.requireAuth, async (req, res) => {
    if (!req.userId)
        return res.status(401).json({ message: "Unauthorised" });
    const profile = await prisma_1.prisma.profile.findUnique({ where: { userId: req.userId } });
    res.json({ profile });
});
// POST (create or update) profile
exports.profileRouter.post("/", auth_1.requireAuth, async (req, res) => {
    const { summary, strengths, improvements, primaryCraft, secondaryCraft } = req.body;
    const upsert = await prisma_1.prisma.profile.upsert({
        where: { userId: req.userId },
        update: { summary, strengths, improvements },
        create: { userId: req.userId, summary, strengths, improvements }
    });
    await prisma_1.prisma.user.update({
        where: { id: req.userId },
        data: { primaryCraft, secondaryCraft }
    });
    res.status(201).json({ profile: upsert });
});

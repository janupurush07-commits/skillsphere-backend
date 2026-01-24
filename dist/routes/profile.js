"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../services/prisma");
const auth_1 = require("../middleware/auth");
exports.profileRouter = (0, express_1.Router)();
exports.profileRouter.get("/", auth_1.requireAuth, async (req, res) => {
    console.log(`[route:profile GET] userId=${req.userId}`);
    if (!req.userId)
        return res.status(401).json({ message: "Unauthorised" });
    const profile = await prisma_1.prisma.profile.findUnique({ where: { userId: req.userId } });
    res.json({ profile });
});
exports.profileRouter.post("/", auth_1.requireAuth, async (req, res) => {
    console.log(`[route:profile POST] userId=${req.userId}`);
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skillsRouter = void 0;
// src/routes/skills.ts
const express_1 = require("express");
const prisma_1 = require("./services/prisma");
const auth_1 = require("./middleware/auth");
exports.skillsRouter = (0, express_1.Router)();
exports.skillsRouter.get("/", auth_1.requireAuth, async (req, res) => {
    const skills = await prisma_1.prisma.skillMap.findMany({ where: { userId: req.userId } });
    res.json({ skills });
});
exports.skillsRouter.post("/", auth_1.requireAuth, async (req, res) => {
    const { domain, level } = req.body;
    const skill = await prisma_1.prisma.skillMap.create({
        data: { userId: req.userId, domain, level }
    });
    res.status(201).json({ skill });
});

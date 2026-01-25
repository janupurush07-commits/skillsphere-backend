// src/routes/skills.ts
import { Router } from "express";
import { prisma } from "../services/prisma";
import { requireAuth } from "../middleware/auth";

export const skillsRouter = Router();

skillsRouter.get("/", requireAuth, async (req, res) => {
  const skills = await prisma.skillMap.findMany({ where: { userId: req.userId! } });
  res.json({ skills });
});

skillsRouter.post("/", requireAuth, async (req, res) => {
  const { domain, level, momentum, badges } = req.body;
  const skill = await prisma.skillMap.create({
    data: { userId: req.userId!, domain, level, momentum, badges }
  });
  res.status(201).json({ skill });
});

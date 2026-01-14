// src/routes/skills.ts
import { Router } from "express";
import { prisma } from "./services/prisma";
import { requireAuth } from "./middleware/auth";

export const skillsRouter = Router();

skillsRouter.get("/", requireAuth, async (req, res) => {
  const skills = await prisma.skillMap.findMany({ where: { userId: (req as any).userId! } });
  res.json({ skills });
});

skillsRouter.post("/", requireAuth, async (req, res) => {
  const { domain, level } = req.body;
  const skill = await prisma.skillMap.create({
    data: { userId: (req as any).userId!, domain, level }
  });
  res.status(201).json({ skill });
});

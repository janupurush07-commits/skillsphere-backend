// src/routes/profile.ts
import express, { Router } from "express";
import { prisma } from "../services/prisma";
import { requireAuth } from "../middleware/auth";
interface AuthenticatedRequest extends express.Request {
  userId?: string;
}
export const profileRouter = Router();

// GET profile
profileRouter.get("/", requireAuth, async (req:AuthenticatedRequest,res:express.Response) => {
    if(!req.userId) return res.status(401).json({ message: "Unauthorised"});
  const profile = await prisma.profile.findUnique({ where: { userId: req.userId! } });
  res.json({ profile });
});

// POST (create or update) profile
profileRouter.post("/", requireAuth, async (req:AuthenticatedRequest, res:Express.Response) => {
  const { summary, strengths, improvements, primaryCraft, secondaryCraft } = req.body;

  const upsert = await prisma.profile.upsert({
    where: { userId: req.userId! },
    update: { summary, strengths, improvements },
    create: { userId: req.userId!, summary, strengths, improvements }
  });

  await prisma.user.update({
    where: { id: req.userId! },
    data: { primaryCraft, secondaryCraft }
  });

  res.status(201).json({ profile: upsert });
});

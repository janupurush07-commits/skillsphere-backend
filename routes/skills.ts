import { Router } from "express";
import { prisma } from "../services/prisma";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

export const skillsRouter = Router();

skillsRouter.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  console.log(`[route:skills GET] userId=${req.userId}`);
  const skills = await prisma.skillMap.findMany({ where: { userId: req.userId! } });
  res.json({ skills });
});

skillsRouter.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  console.log(`[route:skills POST] userId=${req.userId}`);
  const { domain, level } = req.body;
  const skill = await prisma.skillMap.create({
    data: { userId: req.userId!, domain, level }
  });
  res.status(201).json({ skill });
});

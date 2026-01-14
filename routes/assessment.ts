import { Router } from "express";
import { prisma } from "../services/prisma";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

export const assessmentRouter = Router();

assessmentRouter.post("/mcq", requireAuth, async (req: AuthenticatedRequest, res) => {
  console.log(`[route:assessment MCQ] userId=${req.userId}`);
  const { prompt, response } = req.body; // response: selected option
  const score = response === "Craft a storyboard of user rituals before writing code" ? 1 : 0;
  const record = await prisma.assessment.create({
    data: { userId: req.userId!, type: "MCQ", prompt, response, score }
  });
  res.status(201).json({ assessment: record });
});

assessmentRouter.post("/scenario", requireAuth, async (req: AuthenticatedRequest, res) => {
  console.log(`[route:assessment SCENARIO] userId=${req.userId}`);
  const { prompt, response } = req.body; // response: structured text/json
  const record = await prisma.assessment.create({
    data: { userId: req.userId!, type: "Scenario", prompt, response }
  });
  res.status(201).json({ assessment: record });
});

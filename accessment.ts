// src/routes/assessment.ts
import { Router } from "express";
import { prisma } from "../services/prisma";
import { requireAuth } from "../middleware/auth";

export const assessmentRouter = Router();

assessmentRouter.post("/mcq", requireAuth, async (req, res) => {
  const { prompt, response } = req.body; // response: selected option
  const score = response === "Craft a storyboard of user rituals before writing code" ? 1 : 0;
  const record = await prisma.assessment.create({
    data: { userId: req.userId!, type: "MCQ", prompt, response, score }
  });
  res.status(201).json({ assessment: record });
});

assessmentRouter.post("/scenario", requireAuth, async (req, res) => {
  const { prompt, response } = req.body; // response: structured text/json
  const record = await prisma.assessment.create({
    data: { userId: req.userId!, type: "Scenario", prompt, response }
  });
  res.status(201).json({ assessment: record });
});

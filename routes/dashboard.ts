import { Router } from "express";

export const dashboardRouter = Router();

dashboardRouter.get("/", async (req, res) => {
  res.json({ stats: {} });
});

import { Router } from "express";

export const projectsRouter = Router();

projectsRouter.get("/", async (req, res) => {
  res.json({ projects: [] });
});

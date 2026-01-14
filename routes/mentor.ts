import { Router } from "express";

export const mentorRouter = Router();

mentorRouter.get("/", async (req, res) => {
  res.json({ mentors: [] });
});

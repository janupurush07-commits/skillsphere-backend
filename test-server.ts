import express from "express";
import { requireAuth } from "./middleware/auth";

const app = express();

app.get("/test", requireAuth, (req, res) => {
  res.json({ userId: (req as any).userId || null });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Test server listening on ${PORT}`));

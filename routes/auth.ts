import { Router } from "express";
const bcrypt: any = require("bcryptjs");
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../services/prisma";
import { body, validationResult } from "express-validator";

export const authRouter = Router();

const signAccess = (userId: string) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: "15m" });
const signRefresh = () =>
  jwt.sign({ jti: crypto.randomUUID() }, process.env.JWT_SECRET!, { expiresIn: "7d" });

authRouter.post(
  "/register",
  body("email").isEmail(),
  body("passphrase").isLength({ min: 8 }),
  body("name").isLength({ min: 2 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, passphrase, name, primaryCraft } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const passhash = await bcrypt.hash(passphrase, 12);
    const user = await prisma.user.create({
      data: { email, passhash, name, primaryCraft }
    });

    const access = signAccess(user.id);
    const refresh = signRefresh();
    await prisma.refreshToken.create({
      data: { userId: user.id, token: refresh, expiresAt: new Date(Date.now() + 7 * 864e5) }
    });

    res.status(201).json({ accessToken: access, refreshToken: refresh, user: { id: user.id, email, name } });
  }
);

authRouter.post("/login", body("email").isEmail(), body("passphrase").isString(), async (req, res) => {
  const { email, passphrase } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(passphrase, user.passhash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const access = signAccess(user.id);
  const refresh = signRefresh();
  await prisma.refreshToken.create({
    data: { userId: user.id, token: refresh, expiresAt: new Date(Date.now() + 7 * 864e5) }
  });

  res.json({ accessToken: access, refreshToken: refresh, user: { id: user.id, email: user.email, name: user.name } });
});

authRouter.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  const record = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!record || record.expiresAt < new Date()) return res.status(401).json({ message: "Invalid refresh token" });
  const access = signAccess(record.userId);
  res.json({ accessToken: access });
});

authRouter.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  await prisma.refreshToken.delete({ where: { token: refreshToken } }).catch(() => {});
  res.json({ ok: true });
});

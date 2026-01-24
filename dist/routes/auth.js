"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const bcrypt = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../services/prisma");
const express_validator_1 = require("express-validator");
exports.authRouter = (0, express_1.Router)();
const signAccess = (userId) => jsonwebtoken_1.default.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
const signRefresh = () => jsonwebtoken_1.default.sign({ jti: crypto_1.default.randomUUID() }, process.env.JWT_SECRET, { expiresIn: "7d" });
exports.authRouter.post("/register", (0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("passphrase").isLength({ min: 8 }), (0, express_validator_1.body)("name").isLength({ min: 2 }), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const { email, passphrase, name, primaryCraft } = req.body;
    const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existing)
        return res.status(409).json({ message: "Email already registered" });
    const passhash = await bcrypt.hash(passphrase, 12);
    const user = await prisma_1.prisma.user.create({
        data: { email, passhash, name, primaryCraft }
    });
    const access = signAccess(user.id);
    const refresh = signRefresh();
    await prisma_1.prisma.refreshToken.create({
        data: { userId: user.id, token: refresh, expiresAt: new Date(Date.now() + 7 * 864e5) }
    });
    res.status(201).json({ accessToken: access, refreshToken: refresh, user: { id: user.id, email, name } });
});
exports.authRouter.post("/login", (0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("passphrase").isString(), async (req, res) => {
    const { email, passphrase } = req.body;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(passphrase, user.passhash);
    if (!ok)
        return res.status(401).json({ message: "Invalid credentials" });
    const access = signAccess(user.id);
    const refresh = signRefresh();
    await prisma_1.prisma.refreshToken.create({
        data: { userId: user.id, token: refresh, expiresAt: new Date(Date.now() + 7 * 864e5) }
    });
    res.json({ accessToken: access, refreshToken: refresh, user: { id: user.id, email: user.email, name: user.name } });
});
exports.authRouter.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;
    const record = await prisma_1.prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!record || record.expiresAt < new Date())
        return res.status(401).json({ message: "Invalid refresh token" });
    const access = signAccess(record.userId);
    res.json({ accessToken: access });
});
exports.authRouter.post("/logout", async (req, res) => {
    const { refreshToken } = req.body;
    await prisma_1.prisma.refreshToken.delete({ where: { token: refreshToken } }).catch(() => { });
    res.json({ ok: true });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = (req, res, next) => {
    const auth = req.headers.authorization;
    console.log(`[auth] ${req.method} ${req.url} - auth=${auth ? '[REDACTED]' : 'none'}`);
    if (!auth || !auth.startsWith("Bearer ")) {
        console.log("[auth] Missing or invalid Authorization header");
        return res.status(401).json({ message: "Unauthorised" });
    }
    const token = auth.slice(7);
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        req.userId = payload.sub;
        console.log(`[auth] Token valid, userId=${payload.sub}`);
        return next();
    }
    catch (err) {
        console.log('[auth] Token verification failed', err?.message ?? err);
        return res.status(401).json({ message: "Unauthorised" });
    }
};
exports.requireAuth = requireAuth;

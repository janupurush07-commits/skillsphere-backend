"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityMiddleware = void 0;
const securityMiddleware = (req, res, next) => {
    // Minimal security placeholder — add helmet/cors in future
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    next();
};
exports.securityMiddleware = securityMiddleware;

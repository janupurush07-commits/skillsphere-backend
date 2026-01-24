"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMiddleware = void 0;
const loggingMiddleware = (req, res, next) => {
    const { method, url } = req;
    const safeHeaders = { ...req.headers };
    if (safeHeaders.authorization)
        safeHeaders.authorization = '[REDACTED]';
    console.log(`[req] ${new Date().toISOString()} ${method} ${url} headers=${JSON.stringify(safeHeaders)}`);
    // capture body if present (may be large in production)
    if (req.body && Object.keys(req.body).length > 0) {
        try {
            console.log(`[req.body] ${JSON.stringify(req.body)}`);
        }
        catch (e) {
            console.log('[req.body] <unserializable>');
        }
    }
    next();
};
exports.loggingMiddleware = loggingMiddleware;

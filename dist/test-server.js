"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("./middleware/auth");
const app = (0, express_1.default)();
app.get("/test", auth_1.requireAuth, (req, res) => {
    res.json({ userId: req.userId || null });
});
const PORT = 3001;
app.listen(PORT, () => console.log(`Test server listening on ${PORT}`));

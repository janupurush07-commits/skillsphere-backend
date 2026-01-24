"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsRouter = void 0;
const express_1 = require("express");
exports.projectsRouter = (0, express_1.Router)();
exports.projectsRouter.get("/", async (req, res) => {
    res.json({ projects: [] });
});

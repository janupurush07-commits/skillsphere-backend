"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorRouter = void 0;
const express_1 = require("express");
exports.mentorRouter = (0, express_1.Router)();
exports.mentorRouter.get("/", async (req, res) => {
    res.json({ mentors: [] });
});

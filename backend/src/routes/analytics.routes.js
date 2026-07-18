import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getQuestionBankController } from "../controllers/analytics/analytics.controller.js";

const router = express.Router();

router.use(requireAuth());

// GET /api/v1/analytics/question-bank — Get most repeated questions
router.get("/question-bank", getQuestionBankController);

export default router;

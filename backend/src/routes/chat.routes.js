import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { askQuestionController } from "../controllers/chat/chat.controller.js";

const router = express.Router();

// All chat routes require authentication
router.use(requireAuth());

// POST /api/v1/chat — Ask a question to the RAG system
router.post("/", askQuestionController);

export default router;

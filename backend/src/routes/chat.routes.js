import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { askQuestionController, getConversationsController, getConversationHistoryController } from "../controllers/chat/chat.controller.js";

const router = express.Router();

// All chat routes require authentication
router.use(requireAuth());

// GET /api/v1/chat/conversations — Get all chat sessions for the user
router.get("/conversations", getConversationsController);

// GET /api/v1/chat/conversations/:id — Get a specific chat session and its messages
router.get("/conversations/:id", getConversationHistoryController);

// POST /api/v1/chat — Ask a question to the RAG system
router.post("/", askQuestionController);

export default router;

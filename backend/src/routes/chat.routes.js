import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { askQuestionController, getConversationsController, getConversationHistoryController } from "../controllers/chat/chat.controller.js";
import { createConversationController } from "../controllers/chat/chat.controller.js";

const router = express.Router();

// All chat routes require authentication
router.use(requireAuth());

// GET /api/v1/chat/conversations — Get all chat sessions for the user
router.get("/conversations", getConversationsController);

// POST /api/v1/chat/conversations - Create a new empty conversation

router.post("/conversations", createConversationController);

// GET /api/v1/chat/conversations/:id — Get a specific chat session and its messages
router.get("/conversations/:id", getConversationHistoryController);

// DELETE /api/v1/chat/conversations/:id - Delete a conversation
import { deleteConversationController } from "../controllers/chat/chat.controller.js";
router.delete("/conversations/:id", deleteConversationController);

// POST /api/v1/chat — Ask a question to the RAG system
router.post("/", askQuestionController);

export default router;

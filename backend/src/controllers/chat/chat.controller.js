/**
 * Chat Controller
 * 
 * Exposes the RAG Chatbot endpoint.
 */
import { chatSchema } from "../../validation/chat.validation.js";
import { processChatQuery, getUserConversations, getConversationHistory } from "../../services/llm/chat.service.js";

/**
 * POST /api/v1/chat
 * Ask a question to the RAG system and persist it to a conversation.
 */
export const askQuestionController = async (req, res) => {
    try {
        const validation = chatSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.issues });
        }

        const { query, paperId, conversationId } = validation.data;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Process chat, save to DB, and get RAG answer
        const result = await processChatQuery(userId, query, paperId, conversationId);

        res.status(200).json(result);

    } catch (error) {
        console.error("Error in chat controller:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

/**
 * GET /api/v1/chat/conversations
 * Get all conversations for the user.
 */
export const getConversationsController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const conversations = await getUserConversations(userId);
        res.status(200).json({ conversations });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * GET /api/v1/chat/conversations/:id
 * Get a specific conversation and its messages.
 */
export const getConversationHistoryController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const conversationId = req.params.id;
        const conversation = await getConversationHistory(userId, conversationId);
        res.status(200).json({ conversation });
    } catch (error) {
        res.status(403).json({ message: "Unauthorized or not found" });
    }
};

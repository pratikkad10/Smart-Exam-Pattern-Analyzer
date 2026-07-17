/**
 * Chat Controller
 * 
 * Exposes the RAG Chatbot endpoint.
 */
import { chatSchema } from "../../validation/chat.validation.js";
import { generateRagAnswer } from "../../services/llm/rag.service.js";

/**
 * POST /api/v1/chat
 * Ask a question to the RAG system based on uploaded papers.
 */
export const askQuestionController = async (req, res) => {
    try {
        const validation = chatSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.issues });
        }

        const { query, paperId } = validation.data;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Generate the RAG answer
        const answer = await generateRagAnswer(query, userId, paperId);

        res.status(200).json(answer);

    } catch (error) {
        console.error("Error in chat controller:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

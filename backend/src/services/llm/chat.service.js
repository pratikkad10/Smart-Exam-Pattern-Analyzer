import { prisma } from "../../config/db.js";
import { generateRagAnswer } from "./rag.service.js";

/**
 * Creates or updates a conversation and its messages.
 */
export const processChatQuery = async (userId, query, paperId, conversationId) => {
    let convoId = conversationId;

    // 1. If no conversationId is provided, create a new Conversation
    if (!convoId) {
        const convo = await prisma.conversation.create({
            data: {
                userId,
                title: query.substring(0, 50) + (query.length > 50 ? "..." : "")
            }
        });
        convoId = convo.id;
    } else {
        // Verify conversation belongs to user
        const convo = await prisma.conversation.findUnique({
            where: { id: convoId }
        });
        if (!convo || convo.userId !== userId) {
            throw new Error("Conversation not found or unauthorized");
        }
    }

    // 2. Save the user's message to the DB
    await prisma.message.create({
        data: {
            conversationId: convoId,
            role: "user",
            content: query
        }
    });

    // 3. Fetch past messages for this conversation to give the LLM memory (context)
    const history = await prisma.message.findMany({
        where: { conversationId: convoId },
        orderBy: { createdAt: 'asc' },
        take: 10 // Get last 10 messages to avoid token bloat
    });

    // 4. Get answer from RAG pipeline
    const answerData = await generateRagAnswer(query, userId, paperId, history, convoId);

    // 5. Save the AI's response to the DB
    await prisma.message.create({
        data: {
            conversationId: convoId,
            role: "assistant",
            content: JSON.stringify(answerData)
        }
    });

    return {
        conversationId: convoId,
        ...answerData
    };
};

export const createConversation = async (userId, title = "New Chat") => {
    return prisma.conversation.create({
        data: {
            userId,
            title
        }
    });
};

export const getUserConversations = async (userId) => {
    return prisma.conversation.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        include: {
            messages: {
                take: 1, // just to show the first message as a preview
                orderBy: { createdAt: 'asc' }
            }
        }
    });
};

export const getConversationHistory = async (userId, conversationId) => {
    const convo = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
            messages: {
                orderBy: { createdAt: 'asc' }
            }
        }
    });

    if (!convo || convo.userId !== userId) {
        throw new Error("Unauthorized");
    }

    return convo;
};

export const deleteConversation = async (userId, conversationId) => {
    // Verify ownership before deleting
    const convo = await prisma.conversation.findUnique({
        where: { id: conversationId }
    });

    if (!convo || convo.userId !== userId) {
        throw new Error("Conversation not found or unauthorized");
    }

    return prisma.conversation.delete({
        where: { id: conversationId }
    });
};

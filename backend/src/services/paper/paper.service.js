/**
 * Paper Service
 *
 * Handles all database operations for the Paper and Question models.
 * Uses Prisma to create, read, and manage exam papers and their
 * extracted questions.
 */
import { prisma } from "../../config/db.js";

/**
 * Create a new Paper record with its extracted questions in a single transaction
 * @param {object} paperData - The paper metadata
 * @param {string} paperData.title - Paper title
 * @param {string|null} paperData.subject - Subject name
 * @param {number|null} paperData.year - Exam year
 * @param {string} paperData.fileUrl - Path to the uploaded PDF
 * @param {string} paperData.rawText - The raw extracted text
 * @param {string} paperData.userId - The ID of the user who uploaded it
 * @param {Array<{text: string, marks: number|null, unit: string|null}>} questions - Extracted questions
 * @returns {Promise<object>} The created Paper with its Questions
 */
export const createPaperWithQuestions = async (paperData, questions) => {
    // Use a Prisma transaction to ensure Paper + Questions are created atomically
    const paper = await prisma.paper.create({
        data: {
            title: paperData.title,
            subject: paperData.subject || null,
            year: paperData.year || null,
            fileUrl: paperData.fileUrl,
            rawText: paperData.rawText,
            userId: paperData.userId,
            conversationId: paperData.conversationId,
            // Nested create: insert all questions in one go
            questions: {
                create: questions.map((q) => ({
                    text: q.text,
                    marks: q.marks,
                    unit: q.unit,
                })),
            },
        },
        // Return the paper with its questions included
        include: {
            questions: true,
        },
    });

    return paper;
};

/**
 * Get all papers uploaded by a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} List of papers with question counts
 */
export const getPapersByUserId = async (userId) => {
    return await prisma.paper.findMany({
        where: { userId },
        include: {
            _count: {
                select: { questions: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

/**
 * Get a single paper by ID with all its questions
 * @param {string} paperId - The paper's ID
 * @returns {Promise<object|null>} The paper with questions, or null
 */
export const getPaperById = async (paperId) => {
    return await prisma.paper.findUnique({
        where: { id: paperId },
        include: {
            questions: {
                orderBy: { createdAt: "asc" },
            },
        },
    });
};

/**
 * Delete a paper and all its questions (cascade)
 * @param {string} paperId - The paper's ID
 * @returns {Promise<object>} The deleted paper
 */
export const deletePaper = async (paperId) => {
    return await prisma.paper.delete({
        where: { id: paperId },
    });
};

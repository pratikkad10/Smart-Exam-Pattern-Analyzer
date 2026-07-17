/**
 * Paper Controller
 *
 * Orchestrates the full Feature 2 pipeline:
 * 1. Receive uploaded PDF
 * 2. Extract raw text from PDF
 * 3. Send text to AI for structured question extraction
 * 4. Save Paper + Questions to PostgreSQL
 * 5. Vectorize questions and store in Qdrant
 */
import { paperUploadSchema } from "../../validation/paper.validation.js";
import { extractTextFromPDF } from "../../services/pdf/pdf.service.js";
import { extractQuestionsFromText } from "../../services/llm/extraction.service.js";
import { createPaperWithQuestions, getPapersByUserId, getPaperById, deletePaper } from "../../services/paper/paper.service.js";
import { vectorizeAndStoreQuestions } from "../../services/embeddings/embedding.service.js";

/**
 * POST /api/v1/papers/upload
 * Upload a PDF, extract questions, save to DB, and vectorize
 */
export const uploadPaperController = async (req, res) => {
    try {
        // 1. Validate that a file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: "No PDF file uploaded." });
        }

        // 2. Validate the metadata fields (title, subject, year)
        const validation = paperUploadSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.issues });
        }

        const { title, subject, year } = validation.data;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // 3. Extract raw text from the uploaded PDF
        console.log(`Extracting text from PDF: ${req.file.filename}`);
        const rawText = await extractTextFromPDF(req.file.path);
        console.log(`Extracted ${rawText.length} characters of text.`);

        // 4. Use AI to extract structured questions from the raw text
        console.log("Sending text to AI for question extraction...");
        const extractedQuestions = await extractQuestionsFromText(rawText);
        console.log(`AI extracted ${extractedQuestions.length} questions.`);

        // 5. Save Paper + Questions to PostgreSQL
        const paper = await createPaperWithQuestions(
            {
                title,
                subject,
                year,
                fileUrl: req.file.path,
                rawText,
                userId,
            },
            extractedQuestions
        );

        // 6. Vectorize questions and store in Qdrant (async, non-blocking)
        //    We don't await this — the user gets their response immediately
        //    while vectorization happens in the background
        vectorizeAndStoreQuestions(paper.questions, paper.id)
            .then(() => console.log(`Vectorization complete for paper: ${paper.id}`))
            .catch((err) => console.error(`Vectorization failed for paper ${paper.id}:`, err));

        // 7. Respond with the created paper and questions
        res.status(201).json({
            message: "Paper uploaded and processed successfully!",
            paper: {
                id: paper.id,
                title: paper.title,
                subject: paper.subject,
                year: paper.year,
                questionsExtracted: paper.questions.length,
                questions: paper.questions,
            },
        });
    } catch (error) {
        console.error("Error in paper upload:", error);

        // Handle specific known errors
        if (error.message.includes("No text could be extracted")) {
            return res.status(422).json({ message: error.message });
        }
        if (error.message.includes("AI failed")) {
            return res.status(502).json({ message: error.message });
        }

        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * GET /api/v1/papers
 * Get all papers for the current user
 */
export const getMyPapersController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const papers = await getPapersByUserId(userId);

        res.status(200).json({
            message: "Papers fetched successfully",
            count: papers.length,
            papers,
        });
    } catch (error) {
        console.error("Error fetching papers:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * GET /api/v1/papers/:id
 * Get a single paper with all its extracted questions
 */
export const getPaperByIdController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const paper = await getPaperById(req.params.id);

        if (!paper) {
            return res.status(404).json({ message: "Paper not found" });
        }

        // Ensure the user can only access their own papers
        if (paper.userId !== userId) {
            return res.status(403).json({ message: "Forbidden: You can only view your own papers." });
        }

        res.status(200).json({
            message: "Paper fetched successfully",
            paper,
        });
    } catch (error) {
        console.error("Error fetching paper:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * DELETE /api/v1/papers/:id
 * Delete a paper and all its questions
 */
export const deletePaperController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const paper = await getPaperById(req.params.id);

        if (!paper) {
            return res.status(404).json({ message: "Paper not found" });
        }

        if (paper.userId !== userId) {
            return res.status(403).json({ message: "Forbidden: You can only delete your own papers." });
        }

        await deletePaper(paper.id);

        res.status(200).json({ message: "Paper deleted successfully" });
    } catch (error) {
        console.error("Error deleting paper:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Embedding Service
 *
 * Takes extracted questions and stores their vector embeddings
 * in Qdrant. Each vector is tagged with the questionId and paperId
 * so the RAG chatbot (Feature 3) can search and retrieve them later.
 */
import vectorStore from "../../config/qdrant.js";

/**
 * Generate embeddings for extracted questions and store them in Qdrant
 * @param {Array<{id: string, text: string, marks: number|null, unit: string|null}>} questions - Questions with their DB IDs
 * @param {string} paperId - The Paper ID these questions belong to
 * @returns {Promise<void>}
 */
export const vectorizeAndStoreQuestions = async (questions, paperId, userId) => {
    if (!questions || questions.length === 0) {
        console.warn("No questions to vectorize.");
        return;
    }

    // Prepare documents for LangChain's vectorStore.addDocuments()
    // Each document needs: pageContent (the text to embed) and metadata (for filtering)
    const documents = questions.map((question) => ({
        pageContent: question.text,
        metadata: {
            questionId: question.id,
            paperId: paperId,
            userId: userId,
            marks: question.marks,
            unit: question.unit,
        },
    }));

    // Add documents to Qdrant — this automatically:
    // 1. Generates embeddings using our HF embeddings config
    // 2. Stores vectors + metadata in the Qdrant collection
    await vectorStore.addDocuments(documents);

    console.log(`Successfully vectorized and stored ${documents.length} questions for paper ${paperId}`);
};

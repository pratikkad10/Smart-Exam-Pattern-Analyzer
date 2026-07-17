/**
 * PDF Service
 *
 * Extracts raw text content from uploaded PDF files using pdf-parse.
 * This raw text is then passed to the AI extraction service for
 * structured question extraction.
 */
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

/**
 * Extract raw text from a PDF file
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<string>} The extracted raw text content
 */
export const extractTextFromPDF = async (filePath) => {
    // PDFLoader natively supports ES Modules and is part of our LangChain stack
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    if (!docs || docs.length === 0) {
        throw new Error("No text could be extracted from the PDF. The file may be scanned or image-based.");
    }

    // Combine text from all parsed pages
    const fullText = docs.map(doc => doc.pageContent).join("\n");
    
    if (fullText.trim().length === 0) {
        throw new Error("No text could be extracted from the PDF.");
    }

    return fullText.trim();
};

/**
 * RAG (Retrieval-Augmented Generation) Service
 * 
 * Handles querying the Qdrant vector database for relevant questions
 * and passing them as context to the LLM to generate an answer.
 */
import vectorStore from "../../config/qdrant.js";
import { chatCompletion } from "../../config/llm.js";

/**
 * Searches the vector database for questions relevant to the user query.
 * @param {string} query - The user's chat query.
 * @param {string} userId - The ID of the user (to filter only their papers).
 * @param {string} [paperId] - Optional. If provided, filters to only this paper.
 * @returns {Promise<Array>} List of relevant LangChain Document objects.
 */
export const searchContext = async (query, userId, paperId = null) => {
    // We use Qdrant's payload filtering to ensure users only search their own data
    // Note: LangChain JS stores metadata fields under the "metadata." prefix in Qdrant payloads
    const filter = {
        must: [
            {
                key: "metadata.userId",
                match: { value: userId }
            }
        ]
    };

    // If the user is chatting with a specific paper, narrow the filter down
    if (paperId) {
        filter.must.push({
            key: "metadata.paperId",
            match: { value: paperId }
        });
    }

    // Retrieve the top 10 most relevant questions based on semantic similarity
    const results = await vectorStore.similaritySearch(query, 10, filter);
    return results;
};

/**
 * Generates an answer to the user's query using the RAG pipeline.
 * @param {string} query - The user's chat query.
 * @param {string} userId - The user's ID.
 * @param {string} [paperId] - Optional specific paper to chat with.
 * @returns {Promise<string>} The AI's response.
 */
export const generateRagAnswer = async (query, userId, paperId = null, history = []) => {
    // 1. Retrieve relevant context from Qdrant
    const relevantDocs = await searchContext(query, userId, paperId);

    if (!relevantDocs || relevantDocs.length === 0) {
        return {
            summary: "I couldn't find any relevant information in your uploaded exam papers to answer that question. (Make sure you have uploaded papers!)",
            results: []
        };
    }

    // 2. Format the context for the prompt so the LLM understands it
    const formattedContext = relevantDocs.map((doc, index) => {
        let text = `${index + 1}. Question: ${doc.pageContent}`;
        if (doc.metadata.marks) text += ` (Marks: ${doc.metadata.marks})`;
        if (doc.metadata.unit) text += ` (Unit: ${doc.metadata.unit})`;
        return text;
    }).join("\n\n");

    // 3. Build the Strict LLM system prompt
    const systemPrompt = `
You are an AI Teaching Assistant for university students.

Your primary responsibility is to answer the student's question using ONLY the provided exam paper context.

==================================================
RULES
==================================================

1. Use ONLY the information present in the provided context.
2. Do NOT use your own knowledge or make assumptions.
3. Do NOT invent answers.
4. If the requested information is missing from the context, clearly state that it is not available in the uploaded exam papers.

==================================================
RESPONSE FORMAT (STRICT JSON)
==================================================
You MUST return your answer strictly as a raw JSON object, without any markdown formatting, backticks, or extra text.
The JSON must follow this exact schema:

{
  "summary": "A short 1-2 sentence conversational answer to the student's query.",
  "results": [
    {
      "question": "The exact text of the question found in the context",
      "marks": 9,
      "unit": "Unit 2"
    }
  ]
}

If no relevant information is found, return an empty array for results:
{
  "summary": "I couldn't find this information in the uploaded exam papers. Try asking about a topic covered in the uploaded documents.",
  "results": []
}

==================================================
CONTEXT
==================================================

${formattedContext}
`;

    // 4. Query the LLM with chat history
    const rawAnswer = await chatCompletion(systemPrompt, query, history);
    
    // 5. Parse the JSON safely
    try {
        // Strip markdown code blocks just in case the LLM tries to format it
        const cleanAnswer = rawAnswer.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        return JSON.parse(cleanAnswer);
    } catch (error) {
        console.error("Failed to parse RAG JSON answer:", rawAnswer);
        return {
            summary: "I found some information, but there was an error formatting the response.",
            results: [],
            raw: rawAnswer
        };
    }
};

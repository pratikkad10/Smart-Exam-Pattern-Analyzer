/**
 * LLM Extraction Service
 *
 * Uses the Hugging Face LLM to extract structured questions
 * from raw PDF text. Sends a carefully crafted prompt and
 * parses the JSON response into an array of question objects.
 */
import { chatCompletion } from "../../config/llm.js";

const SYSTEM_PROMPT = `You are an expert university exam paper parser.

Your task is to extract EVERY question from the provided exam paper and return ONLY valid JSON.

## Instructions

1. Extract every individual question.
2. If a question contains sub-parts (a), (b), (c), etc., treat each sub-part as a separate question.
3. Preserve the original wording of each question as much as possible.
4. Correct obvious OCR mistakes only when the intended text is clear.
5. Ignore:
   - Page numbers
   - Headers
   - Footers
   - University name
   - Subject code
   - Time/Duration
   - Maximum Marks
   - Instructions like "Attempt Any Three"
   - Decorative separators
   - Standalone structural choice words like "OR", "AND", or "EITHER" that appear between questions.

## For each question extract:

- text → Complete question text
- marks → Numeric marks if explicitly mentioned, otherwise null
- unit → Unit/Module if explicitly mentioned, otherwise null

## Output Rules

- Return ONLY a JSON array.
- Do NOT return markdown.
- Do NOT return explanations.
- Do NOT include comments.
- Do NOT include trailing commas.
- Every object must contain exactly these keys:

{
  "text": "...",
  "marks": number | null,
  "unit": "..." | null
}

## Example Output

[
  {
    "text": "Explain the TCP/IP model.",
    "marks": 5,
    "unit": "Unit 3"
  },
  {
    "text": "What is a Router?",
    "marks": 2,
    "unit": null
  }
]
`;

/**
 * Extract structured questions from raw PDF text using the LLM
 * @param {string} rawText - The raw text extracted from a PDF
 * @returns {Promise<Array<{text: string, marks: number|null, unit: string|null}>>}
 */
export const extractQuestionsFromText = async (rawText) => {
    const userMessage = `## Exam Paper\n\n${rawText.slice(0, 12000)}\n\nReturn ONLY the JSON array.`;

    const response = await chatCompletion(SYSTEM_PROMPT, userMessage);

    // Parse the LLM response — extract the JSON array from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
        console.error("LLM response did not contain valid JSON:", response);
        throw new Error("AI failed to extract questions. The response was not valid JSON.");
    }

    const questions = JSON.parse(jsonMatch[0]);

    // Validate that we got an array of objects with the expected shape
    if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("AI returned an empty or invalid question list.");
    }

    // Sanitize each question object and filter out hallucinated structural words
    return questions
        .map((q) => ({
            text: typeof q.text === "string" ? q.text.trim() : String(q.text),
            marks: typeof q.marks === "number" ? q.marks : null,
            unit: typeof q.unit === "string" ? q.unit.trim() : null,
        }))
        .filter(q => {
            const lowerText = q.text.toLowerCase();
            return lowerText !== "or" && lowerText !== "and" && lowerText !== "either" && lowerText.length > 3;
        });
};

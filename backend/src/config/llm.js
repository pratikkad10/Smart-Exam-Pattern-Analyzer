/**
 * Hugging Face Chat LLM Configuration
 *
 * Uses the @huggingface/inference SDK to call HF's chat completions API.
 * Model: Qwen/Qwen2.5-7B-Instruct (reliable on HF free tier)
 */
import "dotenv/config";
import { InferenceClient } from "@huggingface/inference";

// Ensure we are using the correct environment variable
const apiKey = process.env.HUGGINGFACEHUB_API_KEY || process.env.HUGGINGFACE_API_KEY;
const hfClient = new InferenceClient(apiKey);

const MODEL = "Qwen/Qwen2.5-7B-Instruct";

/**
 * Send a chat completion request to the HF Inference API
 * @param {string} systemPrompt - The system/instruction prompt
 * @param {string} userMessage - The user message (e.g., the exam paper text)
 * @returns {Promise<string>} The model's response text
 */
export const chatCompletion = async (systemPrompt, userMessage) => {
    try {
        const response = await hfClient.chatCompletion({
            model: MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
            ],
            temperature: 0.1,
            max_tokens: 4096,
        });

        return response.choices[0].message.content;
    } catch (error) {
        // Log the full error body for debugging
        if (error.httpResponse?.body) {
            console.error("HF API Error Body:", JSON.stringify(error.httpResponse.body, null, 2));
        }
        throw error;
    }
};
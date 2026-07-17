// test-embeddings.js
import { embeddings } from "../config/hf-embeddings.js";

async function testEmbedding() {
    try {
        console.log("Sending request to Hugging Face Inference API...");
        const text = "This is a test document for the AI model.";

        // embedQuery is used for single strings
        const vector = await embeddings.embedQuery(text);

        console.log("Success!");
        console.log(`Vector dimension length: ${vector.length} (Should be 1024 for BAAI/bge-large-en-v1.5)`);
        console.log(`First 5 values of the vector:`, vector.slice(0, 5));
    } catch (error) {
        console.error("Failed to generate embeddings:", error);
    }
}

testEmbedding();

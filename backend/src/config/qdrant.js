//Qdrant Vector DB configuaration and connecting to it
import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./hf-embeddings.js";
import dotenv from "dotenv";
dotenv.config();

const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: "langchainjs-testing",
});

export default vectorStore;
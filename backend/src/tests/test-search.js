import vectorStore from "../config/qdrant.js";

async function run() {
    const resultsNoFilter = await vectorStore.similaritySearch("question", 1);
    const userId = resultsNoFilter[0]?.metadata?.userId;

    console.log("Found userId:", userId);

    if (userId) {
        console.log("Searching with Qdrant 'must' filter (key: userId)...");
        try {
            const results1 = await vectorStore.similaritySearch("question", 3, {
                must: [{ key: "userId", match: { value: userId } }]
            });
            console.log("Results 1 count:", results1.length);
        } catch (e) { console.error("Error 1", e.message); }

        console.log("Searching with Qdrant 'must' filter (key: metadata.userId)...");
        try {
            const results2 = await vectorStore.similaritySearch("question", 3, {
                must: [{ key: "metadata.userId", match: { value: userId } }]
            });
            console.log("Results 2 count:", results2.length);
        } catch (e) { console.error("Error 2", e.message); }
    }
    process.exit(0);
}

run().catch(console.error);

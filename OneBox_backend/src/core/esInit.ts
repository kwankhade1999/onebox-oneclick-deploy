import { esClient } from "./esClient";

async function createIndex() {
    const indexName = "emails";


    const exists = await esClient.indices.exists({ index: indexName });
    if (exists) {
        console.log("Index already exists:", indexName);
        return;
    }

    await esClient.indices.create({
        index: indexName,
        mappings: {
            properties: {
                accountId: { type: "keyword" },
                folder: { type: "keyword" },
                subject: { type: "text" },
                from: { type: "keyword" },
                to: { type: "keyword" },
                date: { type: "date" },
                text: { type: "text" },
                html: { type: "text" },
                messageId: { type: "keyword" }
            }
        }
    });

    console.log("Index created:", indexName);
}

createIndex().catch(console.error);

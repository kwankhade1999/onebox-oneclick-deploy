import type { Client } from "@elastic/elasticsearch";

export async function bootstrapElasticIndexes(es: Client) {
    console.log("🔧 Ensuring Elasticsearch indexes...");

    // EMAILS INDEX
    const emailIndexExists = await es.indices.exists({ index: "emails" });

    if (!emailIndexExists) {
        await es.indices.create({
            index: "emails",
            body: {
                mappings: {
                    properties: {
                        subject: { type: "text" },
                        text: { type: "text" },
                        from: { type: "keyword" },
                        folder: { type: "keyword" },
                        accountId: { type: "keyword" },
                        category: { type: "keyword" },
                        date: { type: "date" }
                    }
                }
            }
        });

        console.log("✔ Created ES index: emails");
    } else {
        console.log("✔ Index already exists: emails");
    }

    // 👉 Add additional indexes here (threads, categories, embeddings)
}

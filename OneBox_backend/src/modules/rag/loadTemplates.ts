
import OpenAI from "openai";
import { config } from "../../config/env";
import { TEMPLATES } from "./templates";
import { upsertVector } from "../../core/qdrantClient";


const openai = new OpenAI({
    apiKey: config.openaiKey,
});

// ********************* Set SKIP_EMBEDDINGS=false only if your OpenAI billing/quota is active ( Pranay )**************************
const SKIP_EMBEDDINGS = process.env.SKIP_EMBEDDINGS === "true";
const skip = SKIP_EMBEDDINGS ?? true;
// ********************* Set SKIP_EMBEDDINGS=false only if your OpenAI billing/quota is active ( Pranay )**************************



/**
 * Loads predefined reply templates into Qdrant by embedding text and storing vectors (skipped when SKIP_EMBEDDINGS=true).
 * @author Pranay Mahalle
 */

export async function loadTemplatesToQdrant() {
    console.log("🔄 Loading templates into Qdrant...");

    for (const t of TEMPLATES) {
        console.log(`→ Processing template: ${t.id}`);

        if (skip) {
            console.log("SKIP_EMBEDDINGS=true → Not embedding or inserting");
            continue;
        }


        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: t.text,
        });

        const vector = embedding.data[0].embedding;


        await upsertVector(t.id, vector, {
            label: t.label,
            text: t.text,
        });

        console.log(`Inserted: ${t.id}`);
    }

    console.log("Template loading complete");
}

import OpenAI from "openai";
import { config } from "../../config/env";
import { esClient } from "../../core/esClient";
import { searchVector } from "../../core/qdrantClient";

const openai = new OpenAI({
    apiKey: config.openaiKey,
});

// ********************* Set SKIP_EMBEDDINGS=false only if your OpenAI billing/quota is active ( Pranay )**************************
const RAG_DISABLED = process.env.RAG_DISABLED === "true" || true;
// ********************* Set SKIP_EMBEDDINGS=false only if your OpenAI billing/quota is active ( Pranay )**************************


/**
 * Retrieves a single email document from Elasticsearch by ID.
 * @author Pranay Mahalle
 * @param {string} esId - The Elasticsearch document ID.
 * @returns {Promise<EmailDoc|null>} The email document or null if not found.
 */
export async function getEmailById(esId: string): Promise<EmailDoc | null> {
    try {
        const resp = await esClient.get({
            index: "emails",
            id: esId,
        });

        return resp._source as EmailDoc;
    } catch (err: any) {
        console.error("getEmailById error:", err.response?.data || err.message);
        return null;
    }
}


/**
 * Retrieves the most relevant reply templates for an email using embedding search (Qdrant).
 * Disabled when RAG_DISABLED=true, returning an empty list instead.
 * @author Pranay Mahalle
 * @param {string} esId - Email document ID.
 * @returns  List of matching templates.
 */
export async function getRelevantTemplatesForEmail(esId: string) {
    if (RAG_DISABLED) {
        console.log("[RAG] Disabled – returning zero templates");
        return [];
    }


    const email = await getEmailById(esId);
    if (!email) return [];

    const content = `${email.subject}\n\n${email.text}`;


    const embeddingRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: content,
    });

    const vector = embeddingRes.data[0].embedding;


    const results = await searchVector(vector, 3);
    return results;
}

/**
 * Generates an AI-powered email reply using the received message as context.
 * Uses RAG-lite logic; when RAG is disabled, reply is generated directly via LLM.
 * @author Pranay Mahalle
 * @param {string} esId - Email document ID.
 * @returns Suggested reply text.
 */
export async function generateSuggestedReply(esId: string): Promise<string | null> {
    console.log(`[RAG] generateSuggestedReply → ${esId}`);

    const email = await getEmailById(esId);
    if (!email) return null;

    const prompt = `
You are a professional AI email assistant. Write a friendly, concise, and actionable email reply.

Email received:
Subject: ${email.subject}
From: ${email.from}

Body:
${email.text}

Guidelines:
- If the sender is interested, include a meeting booking link:
  https://cal.com/example
- If they ask a question, answer directly.
- If unclear, ask a helpful clarifying question.
- Avoid long paragraphs. Be direct, warm, and helpful.
- Output ONLY the email reply. No explanation.
`;

    try {
        const res = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
        });

        return res.choices?.[0]?.message?.content?.trim() || null;
    } catch (err: any) {
        console.error("LLM reply error:", err.response?.data || err.message);
        return null;
    }
}

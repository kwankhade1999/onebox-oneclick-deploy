import { Router } from "express";
import {
    generateSuggestedReply,
    getRelevantTemplatesForEmail,
    getEmailById,
} from "../ragService";

const router = Router();

/**
 * Fetches a single email document from Elasticsearch using its ID.
 * @author Pranay Mahalle
 */

router.get("/email/:id", async (req, res) => {
    try {
        const email = await getEmailById(req.params.id);
        if (!email) return res.status(404).json({ error: "Email not found" });

        res.json(email);
    } catch (err: any) {
        console.error("RAG get email error:", err.message);
        res.status(500).json({ error: "Failed to fetch email" });
    }
});

/**
 * Retrieves relevant reply templates for a specific email using RAG search (Qdrant).
 * @author Pranay Mahalle
 */
router.get("/templates/:id", async (req, res) => {
    try {
        const results = await getRelevantTemplatesForEmail(req.params.id);
        res.json(results);
    } catch (err: any) {
        console.error("RAG template search error:", err.message);
        res.status(500).json({ error: "Failed to fetch templates" });
    }
});


/**
 * Generates an AI-powered suggested reply for a given email ID using LLM-based RAG-lite logic.
 * @author Pranay Mahalle
 */
router.get("/reply/:id", async (req, res) => {
    try {
        const reply = await generateSuggestedReply(req.params.id);

        if (!reply) {
            return res.status(500).json({ error: "Failed to generate reply" });
        }

        res.json({ reply });
    } catch (err: any) {
        console.error("RAG suggested reply error:", err.message);
        res.status(500).json({ error: "Failed to generate suggested reply" });
    }
});

export default router;

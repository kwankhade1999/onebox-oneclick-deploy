 
import { Router } from "express";
import { generateSuggestedReply, getEmailById } from "../../rag/ragService";
import { esClient } from "../../../core/esClient";

const router = Router();

/**
 * Generates an AI-powered suggested reply for a given email and stores it back into Elasticsearch.
 * @author Pranay Mahalle
 */
router.post("/:id/suggest-reply", async (req, res) => {
  const esId = req.params.id;

  try {
    const email = await getEmailById(esId);
    if (!email) {
      return res.status(404).json({ ok: false, error: "Email not found" });
    }

    const reply = await generateSuggestedReply(esId);
    if (!reply) {
      return res.status(500).json({ ok: false, error: "Failed to generate reply" });
    }

    await esClient.update({
      index: "emails",
      id: esId,
      doc: { suggestedReply: reply },
    });

    res.json({
      ok: true,
      emailId: esId,
      reply,
    });
  } catch (err: any) {
    console.error("suggest-reply error:", err);
    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
});

export default router;

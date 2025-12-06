import { Router } from "express";
import { categorizeEmail } from "../../categorization/aiCategorizer";

const router = Router();


router.post("/categorize", async (req, res) => {
  try {
    const { subject = "", text = "" } = req.body || {};

    if (!subject && !text) {
      return res.status(400).json({ error: "subject or text required" });
    }

    const label = await categorizeEmail(subject, text);
    return res.json({ ok: true, label });
  } catch (err: any) {
    console.error("AI categorize route error:", err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

export default router;

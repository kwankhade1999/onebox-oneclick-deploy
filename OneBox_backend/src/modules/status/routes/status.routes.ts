 
import { Router } from "express";
import { esClient } from "../../../core/esClient";
import { listAccounts } from "../../accounts/services/accounts.service";

const router = Router();


router.get("/", async (req, res) => {
  try {
    const countRes = await esClient.count({ index: "emails" });

    const accounts = listAccounts();

    res.json({
      ok: true,
      emailCount: countRes.count || 0,
      accounts,
    });
  } catch (err: any) {
    console.error("Status route error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;

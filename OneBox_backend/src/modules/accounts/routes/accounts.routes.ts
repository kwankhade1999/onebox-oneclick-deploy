import { Router } from "express";
import { addAccount, listAccounts } from "../services/accounts.service";

const router = Router();

/**
 * Registers a new IMAP email account for real-time syncing and processing.
 * @author Pranay Mahalle
 * @param {{ id: string, host: string, port?: number, secure?: boolean, user: string, pass: string }} req.body - IMAP account configuration.
 * @returns Sends success response after account registration.
 */

router.post("/", async (req, res) => {
  try {
    const { id, host, port = 993, secure = true, user, pass } = req.body;

    if (!id || !host || !user || !pass) {
      return res.status(400).json({ error: "id, host, user, pass required" });
    }

    await addAccount({
      id,
      host,
      port,
      secure,
      user,
      pass,
    });

    res.json({ ok: true, id });
  } catch (err) {
    console.error("POST /api/accounts error", err);
    res.status(500).json({ error: String(err) });
  }
});

/**
 * Retrieves the connection status and details of all IMAP accounts.
 * @author Pranay Mahalle
 * @returns Sends the list of configured IMAP accounts.
 */

router.get("/", (req, res) => {
  const accounts = listAccounts();
  res.json(accounts);
});

export default router;

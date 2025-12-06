 /**
 * Configures and initializes the Express application for the OneBox backend.
 * Sets up middleware (CORS, JSON parsing) and registers all API route modules.
 * Exports the configured Express instance for use by the server entry point.
 * @author Pranay Mahalle
 * @returns {import("express").Express} The initialized Express application.
 */

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import searchRouter from "./modules/search/routes/search.routes";
import replyRoutes from "./modules/reply/routes/reply.routes";
import statusRoutes from "./modules/status/routes/status.routes";
import aiTestRoutes from "./modules/dev/routes/aiTest.routes";
import accountsRoutes from "./modules/accounts/routes/accounts.routes";
import aiTest from "./modules/dev/routes/aiTest.routes";



const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api/search", searchRouter);
app.use("/api/reply", replyRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/dev", aiTestRoutes);
app.use("/api/accounts", accountsRoutes);
app.use("/api/ai", aiTest);


app.get("/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

export default app;

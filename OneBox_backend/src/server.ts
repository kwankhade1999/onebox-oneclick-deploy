import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { bootstrap } from "./bootstrap";

async function startServer() {
  await bootstrap();

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`OneBox backend running at http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});

import { esClient } from "./core/esClient";
import { bootstrapElasticIndexes } from "./core/bootstrapIndexes";
import { ensureCollection } from "./core/qdrantClient";
import { loadTemplatesToQdrant } from "./modules/rag/loadTemplates";


async function waitForEs() {
  let connected = false;

  while (!connected) {
    try {
      await esClient.ping();
      connected = true;
      console.log("✔ Elasticsearch is ready");
    } catch {
      console.log("⏳ Waiting for Elasticsearch...");
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

export async function bootstrap() {
  try {
    console.log("🚀 Bootstrapping OneBox...");


    console.log("Checking Elasticsearch...");
    await waitForEs();


    console.log("Creating/validating Elasticsearch indexes...");
    await bootstrapElasticIndexes(esClient);


    console.log("Checking Qdrant collection...");
    await ensureCollection();

    console.log("Loading templates into Qdrant...");
    await loadTemplatesToQdrant();


  } catch (err) {
    console.error("❌ Bootstrap failed:", err);
    process.exit(1);
  }
}

import { esClient } from "../../../core/esClient";

export async function indexEmail(doc: any, folder: string) {
  try {
    const esId = `${doc.messageId}__${folder}`;

    await esClient.index({
      index: "emails",
      id: esId,
      document: { ...doc, receivedAt: new Date().toISOString() },
    });

    console.log(`[ES] Indexed: ${doc.subject} (${folder})`);
  } catch (err) {
    console.error("[ES] Index error:", err);
  }
}

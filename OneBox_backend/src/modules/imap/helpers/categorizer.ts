import { categorizeEmail } from "../../categorization/aiCategorizer";

export async function categorizeDocument(subject: string, text: string) {
  try {
    return (await categorizeEmail(subject, text)) || "Uncategorized";
  } catch (err) {
    console.error("[AI Categorizer] Error:", err);
    return "Uncategorized";
  }
}

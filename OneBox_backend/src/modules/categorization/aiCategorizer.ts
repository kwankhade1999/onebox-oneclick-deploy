import OpenAI from "openai";
import { config } from "../../config/env";

/**
 * OpenAI client used for email categorization tasks.
 * @author Pranay Mahalle
 */

export const client = new OpenAI({
  apiKey: config.openaiKey,
});

const PROMPT_INSTRUCTIONS = `
You are an email labeler for a sales/outreach product.
Classify the email into exactly one of these labels (output ONLY the label):
- Interested
- Meeting Booked
- Not Interested
- Spam
- Out of Office

Rules:
- Output exactly one of the five labels above, with exact spelling.
- If the email clearly indicates an auto-reply like "out of office" or "on leave", choose "Out of Office".
- If the email confirms a meeting or contains a meeting link and a confirmation, choose "Meeting Booked".
- If the email expresses interest or asks for next steps, choose "Interested".
- If it's a clear rejection or uninterested reply, choose "Not Interested".
- If it's unsolicited/promotional/scam/bulk, choose "Spam".
`;

/**
 * Classifies an email into one of five predefined categories using OpenAI LLM.
 * @author Pranay Mahalle
 * @param {string} subject - Email subject.
 * @param {string} text - Email body content.
 * @returns {Promise<string>} Predicted category label.
 */

export async function categorizeEmail(subject: string, text: string): Promise<string> {
  const combined = `Subject: ${subject}\n\nBody: ${text}`;
  console.log("Open Request Hit");
  

  try {
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",      
      messages: [
        { role: "system", content: PROMPT_INSTRUCTIONS },
        { role: "user", content: combined },
      ],
      temperature: 0,
      max_tokens: 6,
    });

    const label = resp.choices?.[0]?.message?.content?.trim();
  
    const allowed = ["Interested", "Meeting Booked", "Not Interested", "Spam", "Out of Office"];
    if (!label) return "Not Interested";

    const normalized = label.split("\n")[0].trim().replace(/[^\w\s]/g, "").trim();
    const matched = allowed.find(a => a.toLowerCase() === normalized.toLowerCase());
    return matched ?? "Not Interested";
  } catch (err) {
    console.error("categorizeEmail error:", err);
    return "Not Interested";
  }
}

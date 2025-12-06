import { simpleParser } from "mailparser";
import { formatAddresses } from "./formatAddresses";

export async function parseEmail(raw: Buffer) {
  const parsed = await simpleParser(raw);

  return {
    subject: parsed.subject || "",
    from: formatAddresses(parsed.from),
    to: formatAddresses(parsed.to),
    date: parsed.date?.toISOString() || new Date().toISOString(),
    messageId: parsed.messageId || "",
    text: parsed.text || "",
    html: parsed.html || "",
  };
}

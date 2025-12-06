import axios from "axios";
import { config } from "../../../config/env";

export async function notifyInterested(doc: any) {
    try {
        const slackWebhook = config.slackWebhook;
        const externalWebhook = config.interestedWebhook;

        const payload = {
            type: "interested_email",
            accountId: doc.accountId,
            folder: doc.folder,
            subject: doc.subject,
            from: doc.from,
            date: doc.date,
            messageId: doc.messageId,
            preview: (doc.text || doc.html || "").slice(0, 500),
            receivedAt: new Date().toISOString(),
        };

        if (slackWebhook) {
            try {
                await axios.post(
                    slackWebhook,
                    {
                        text: `📩 *Interested Email Detected*  
*From:* ${doc.from}  
*Subject:* ${doc.subject}`,
                        attachments: [
                            {
                                color: "#36a64f",
                                text: payload.preview,
                            },
                        ],
                    },
                    { timeout: 10000 }
                );
                console.log("Slack notification sent");
            } catch (err) {
                console.error("Slack notification failed:", err);
            }
        }

        if (externalWebhook) {
            try {
                await axios.post(externalWebhook, payload, { timeout: 10000 });
                console.log("Webhook sent to:", externalWebhook);
            } catch (err) {
                console.error("External webhook failed:", err);
            }
        }

    } catch (err) {
        console.error("notifyInterested general error:", err);
    }
}

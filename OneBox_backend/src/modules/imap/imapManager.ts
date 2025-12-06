import { ImapFlow } from "imapflow";
import fs from "fs";
import path from "path";

import { parseEmail } from "./helpers/parser";
import { categorizeDocument } from "./helpers/categorizer";
import { notifyInterested } from "./helpers/notifier";
import { indexEmail } from "./helpers/indexer";

/**
 * Manages IMAP account connections, real-time email syncing, parsing, categorization, notifications, and indexing. 
 * @author Pranay Mahalle
 */

export class ImapManager {
    private clients = new Map<string, ImapFlow>();
    private states = new Map<string, AccountState>();
    private lastProcessed = new Map<string, Date>();
    private storageDir = path.resolve(process.cwd(), "imap_data");

    constructor() {
        if (!fs.existsSync(this.storageDir)) {
            fs.mkdirSync(this.storageDir, { recursive: true });
        }
    }

    listStatus(): AccountState[] {
        return Array.from(this.states.values());
    }

    /** Starts and initializes an IMAP account connection and begins mailbox sync. */
    async startAccount(cfg: AccountConfig) {
        if (this.clients.has(cfg.id)) {
            throw new Error(`Account with id ${cfg.id} already registered`);
        }
        
        const client = new ImapFlow({
            host: cfg.host,
            port: cfg.port,
            secure: cfg.secure,
            auth: cfg.auth,
            logger: false,
        });

        this.states.set(cfg.id, { id: cfg.id, connected: false });


        client.on("close", () => {
            console.warn(`[${cfg.id}] IMAP connection closed`);
            const st = this.states.get(cfg.id);
            if (st) st.connected = false;
        });

        client.on("error", (err: any) => {
            console.error(`[${cfg.id}] IMAP error:`, err);
            const st = this.states.get(cfg.id) || { id: cfg.id, connected: false };
            st.error = String(err);
            st.connected = false;
            this.states.set(cfg.id, st);
        });

        try {
            await client.connect();
            console.log(`[${cfg.id}] connected`);

            this.clients.set(cfg.id, client);
            const st = this.states.get(cfg.id)!;
            st.connected = true;
            this.states.set(cfg.id, st);

            const foldersToSync = ["INBOX"];
            st.folders = foldersToSync;


            for (const folder of foldersToSync) {
                this.syncFolderOnce(client, cfg.id, folder).catch((err) =>
                    console.error(`[${cfg.id}] sync ${folder} error`, err)
                );
            }


            this.idleLoop(client, cfg.id, "INBOX").catch((err) =>
                console.error(`[${cfg.id}] idle loop INBOX error`, err)
            );
        } catch (err) {
            console.error(`[${cfg.id}] connect failed`, err);
            const st = this.states.get(cfg.id)!;
            st.error = String(err);
            st.connected = false;
            this.states.set(cfg.id, st);
            throw new Error("Invalid email address or app password.");
        }
    }

    /** Performs a one-time historical sync of a mailbox (last 30 days). */
    private async syncFolderOnce(client: ImapFlow, accountId: string, folder: string) {
        await client.mailboxOpen(folder, { readOnly: true });

        const sinceDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const searchResult = await client.search({ since: sinceDate });
        const uids = Array.isArray(searchResult) ? searchResult : [];

        if (uids.length === 0) {
            console.log(`[${accountId}] No messages found in "${folder}" for last 30 days.`);
            this.lastProcessed.set(`${accountId}_${folder}`, new Date());
            return;
        }

        let latestDate: Date | null = null;

        for (const uid of uids) {
            try {
                const msg = await client.fetchOne(uid, { envelope: true, source: true });
                if (!msg || !msg.source) continue;

                const parsedDate = msg.envelope?.date ? new Date(msg.envelope.date) : new Date();
                if (parsedDate < sinceDate) continue;

                await this.processMessage(accountId, folder, msg.source, false);

                if (!latestDate || parsedDate > latestDate) {
                    latestDate = parsedDate;
                }
            } catch (err) {
                console.error(`[${accountId}] fetch uid ${uid} error`, err);
            }
        }

        this.lastProcessed.set(`${accountId}_${folder}`, latestDate || new Date());

        const st = this.states.get(accountId)!;
        st.lastSync = new Date().toISOString();
        this.states.set(accountId, st);
    }

    /** Maintains real-time IMAP IDLE listener and processes new messages as they arrive. */
    private async idleLoop(client: ImapFlow, accountId: string, folder: string) {
        while (true) {
            try {
                await client.mailboxOpen(folder, { readOnly: true });
                console.log(`[${accountId}] IDLE listening on folder "${folder}"`);

                const onNew = async () => {
                    try {
                        const cutoff =
                            this.lastProcessed.get(`${accountId}_${folder}`) ||
                            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

                        const searchResult = await client.search({ since: cutoff });
                        const uids = Array.isArray(searchResult) ? searchResult : [];

                        for (const uid of uids) {
                            try {
                                const msg = await client.fetchOne(uid, { envelope: true, source: true });
                                if (!msg || !msg.source) continue;

                                const msgDate = new Date(msg.envelope?.date || Date.now());
                                if (msgDate <= cutoff) continue;

                                await this.processMessage(accountId, folder, msg.source, true);

                                this.lastProcessed.set(`${accountId}_${folder}`, msgDate);
                            } catch (err) {
                                console.error(`[${accountId}] fetch uid=${uid} failed`, err);
                            }
                        }
                    } catch (err) {
                        console.error(`[${accountId}] onNew error`, err);
                    }
                };

                client.on("exists", onNew);

                try {
                    await client.idle();
                } finally {
                    client.off("exists", onNew);
                }
            } catch (err) {
                console.error(`[${accountId}] idle loop error`, err);


                try {
                    console.log(`[${accountId}] Attempting IMAP reconnect...`);
                    await client.connect();
                    console.log(`[${accountId}] Reconnected successfully`);
                } catch (reErr) {
                    console.error(`[${accountId}] IMAP reconnect failed`, reErr);
                }

                await new Promise((res) => setTimeout(res, 3000));
            }
        }
    }

    /** Parses, categorizes, notifies, stores locally, and indexes a single email message. */
    private async processMessage(
        accountId: string,
        folder: string,
        raw: Buffer,
        categorize: boolean
    ) {
        try {
            const parsed = await parseEmail(raw);

            const doc = {
                accountId,
                folder,
                ...parsed,
                category: "Uncategorized",
            };

            if (categorize) {
                doc.category = await categorizeDocument(doc.subject, doc.text);

                if (doc.category === "Interested") {
                    await notifyInterested(doc);
                }
            }

            this.persistLocally(accountId, folder, doc);
            await indexEmail(doc, folder);

            console.log(
                `[${accountId}] [${folder}] "${doc.subject}" from ${doc.from} | category=${doc.category}`
            );
        } catch (err) {
            console.error(`[${accountId}] processMessage error`, err);
        }
    }

    /** Saves processed email data into local JSON history storage. */
    private persistLocally(accountId: string, folder: string, doc: any) {
        try {
            const outFile = path.join(this.storageDir, `${accountId}.json`);
            const existing = fs.existsSync(outFile)
                ? JSON.parse(fs.readFileSync(outFile, "utf8"))
                : [];

            existing.push({ receivedAt: new Date().toISOString(), folder, doc });

            fs.writeFileSync(outFile, JSON.stringify(existing, null, 2));
        } catch (err) {
            console.error(`[${accountId}] Local persistence error`, err);
        }
    }
}

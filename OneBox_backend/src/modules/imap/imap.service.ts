import { imapManager } from "../../core/imapManagerSingleton";

export async function startImapAccount(config: {
  id: string;
  host: string;
  port?: number;
  secure?: boolean;
  auth: { user: string; pass: string };
}) {
  const finalConfig = {
    port: 993,
    secure: true,
    ...config,
  };

  return imapManager.startAccount(finalConfig);
}

export function listImapAccounts() {
  return imapManager.listStatus();
}

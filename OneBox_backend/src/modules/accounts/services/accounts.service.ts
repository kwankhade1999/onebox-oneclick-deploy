import { startImapAccount, listImapAccounts } from "../../imap/imap.service";

/**
 * Registers a new IMAP account by passing the credentials to the IMAP manager service.
 * Internally converts { user, pass } into { auth: { user, pass } } format required by ImapManager.
 * @author Pranay Mahalle
 * @param {{
 *   id: string,
 *   host: string,
 *   port?: number,
 *   secure?: boolean,
 *   user: string,
 *   pass: string
 * }} account - IMAP configuration details.
 * @returns  Resolves when the IMAP account is registered and started.
 */

export async function addAccount(account: {
  id: string;
  host: string;
  port?: number;
  secure?: boolean;
  user: string;
  pass: string;
}) {
  return startImapAccount({
    id: account.id,
    host: account.host,
    port: account.port,
    secure: account.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });
}

/**
 * Fetches the list of all IMAP accounts currently registered in the system.
 * Returns connection status, last sync information, and folder details for each account.
 * @author Pranay Mahalle
 * @returns {Array} List of IMAP account state objects.
 */

export function listAccounts() {
  return listImapAccounts();
}

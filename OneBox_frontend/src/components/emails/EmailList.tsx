import { useEffect, useState } from "react";
import { useEmails } from "../../features/emails/useEmails";
import { EmailItem } from "./EmailItem";
import { ReplySidebar } from "../reply/ReplySidebar";
import { AddAccountModal } from "../accounts/AddAccountModal";
import { fetchAccounts } from "../../features/accounts/accounts.api";
import type { Email } from "../../features/emails/email.types";

export const EmailList = ({ onSelect }: { onSelect: (email: Email) => void }) => {
  const {
    emails,
    loading,
  } = useEmails();

  const [accounts, setAccounts] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showAddAccount, setShowAddAccount] = useState(false);

  useEffect(() => {
    fetchAccounts().then((data) => {
      if (data.accounts) {
        setAccounts(data.accounts.map((a: any) => a.id));
      }
    });
  }, []);

  return (
    <div className="space-y-6 p-4 w-[54vw]">
      <section className="flex justify-between items-center px-1">
        <h2 className="font-bold text-white text-xl tracking-tight">Inbox</h2>

        <button
          onClick={() => {
            window.dispatchEvent(new Event("add-account-opened"));
            setShowAddAccount(true);
          }}

          className="bg-primary px-4 py-1 rounded-full text-white btn btn-sm"
        >
          + Add Account
        </button>
      </section>

      {/* <div className="gap-3 grid grid-cols-1 md:grid-cols-5 mb-4">
        <input
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="bg-base-100 px-3 py-2 rounded-xl w-full text-black text-sm input input-bordered"
        />

        <input
          placeholder="From"
          value={fromFilter}
          onChange={(e) => setFromFilter(e.target.value)}
          className="bg-base-100 px-3 py-2 rounded-xl w-full text-black text-sm input input-bordered"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-base-100 w-full text-black text-sm select-bordered select"
        >
          <option value="">All Categories</option>
          <option value="Interested">Interested</option>
          <option value="Meeting Booked">Meeting Booked</option>
          <option value="Not Interested">Not Interested</option>
          <option value="Spam">Spam</option>
          <option value="Out of Office">Out of Office</option>
        </select>

        {accounts.length > 1 && (
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="bg-base-100 w-full text-black text-sm select-bordered select"
          >
            <option value="">All Accounts</option>
            {accounts.map((acc) => (
              <option key={acc}>{acc}</option>
            ))}
          </select>
        )}

        <button
          onClick={loadEmails}
          className="px-4 border rounded-full btn btn-primary btn-sm"
        >
          Search
        </button>
      </div> */}

      {!loading && accounts.length === 0 && (
        <div className="space-y-3 py-10 text-neutral-500 text-center">
          <p className="font-semibold text-lg">No accounts added yet</p>
          <p className="opacity-70 text-sm">
            Add an IMAP account to start syncing emails.
          </p>

          <button
            onClick={() => {
              window.dispatchEvent(new Event("add-account-opened"));
              setShowAddAccount(true);
            }}

            className="px-4 rounded-full btn btn-primary btn-sm"
          >
            + Add Account
          </button>
        </div>
      )}

      {!loading && accounts.length > 0 && emails.length === 0 && (
        <div className="py-10 text-neutral-500 text-center">
          No emails found.
        </div>
      )}

      {loading && (
        <div className="py-10 text-neutral-400 text-center">
          Loading emails…
        </div>
      )}

      <ul className="space-y-3">
        {emails.map((email) => (
          <EmailItem
            key={email.id}
            email={email}
            onReply={(email, text) => {
              setSelectedEmail(email);
              setReplyText(text);
              setSidebarOpen(true);
            }}
          />
        ))}
      </ul>

      <ReplySidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        email={selectedEmail}
        reply={replyText}
        setReply={setReplyText}
      />

      <AddAccountModal
        open={showAddAccount}
        onClose={() => {
          setShowAddAccount(false);
        }}
        isFirstAccount={accounts.length === 0}
      />

    </div>
  );
};

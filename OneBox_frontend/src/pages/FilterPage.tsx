import { MainLayout } from "../layouts/MainLayout";
import { useEmails } from "../features/emails/useEmails";
import { EmailItem } from "../components/emails/EmailItem";
import { ReplySidebar } from "../components/reply/ReplySidebar";
import { useEffect, useState } from "react";
import { fetchAccounts } from "../features/accounts/accounts.api";
import type { Email } from "../features/emails/email.types";
import { AddAccountModal } from "../components/accounts/AddAccountModal";

export const FilterPage = () => {
  const {
    emails,
    loading,
    q, setQ,
    fromFilter, setFromFilter,
    category, setCategory,
    accountFilter, setAccountFilter,
    loadEmails
  } = useEmails();

  const [accounts, setAccounts] = useState<string[]>([]);
  const [reply, setReply] = useState("");
  const [pane, setPane] = useState<Email | null>(null);
  const [showAddAccount, setShowAddAccount] = useState(false);

  const loadAccountStatus = async () => {
    const data = await fetchAccounts();
    if (data.accounts) {
      setAccounts(data.accounts.map((a: any) => a.id));
    }
  };

  useEffect(() => {
    loadAccountStatus();
  }, []);

  useEffect(() => {
    const handler = () => {
      loadAccountStatus();     // refresh accounts list
      loadEmails();            // refresh email results
    };

    window.addEventListener("account-added", handler);
    return () => window.removeEventListener("account-added", handler);
  }, [loadEmails]);

  return (
    <MainLayout>
      <div className="p-6">
        <div className="bg-base-200 shadow-lg p-5 border border-base-300 rounded-2xl min-h-[calc(100vh-120px)]">
          <section className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-white text-xl tracking-tight">
              Filter Emails
            </h2>
          </section>

          <div className="gap-3 grid grid-cols-1 md:grid-cols-5 mb-6">
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
              className="px-4 border rounded-full w-[130px] btn btn-primary btn-sm"
            >
              Search
            </button>
          </div>

          {loading && (
            <div className="py-10 text-neutral-400 text-center">
              Searching emails…
            </div>
          )}

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

          <ul className="space-y-3">
            {emails.map((email) => (
              <EmailItem
                key={email.id}
                email={email}
                onReply={(email, text) => {
                  setPane(email);
                  setReply(text);
                }}
              />
            ))}
          </ul>

          <ReplySidebar
            open={pane !== null}
            onClose={() => setPane(null)}
            email={pane}
            reply={reply}
            setReply={setReply}
          />
        </div>

        <AddAccountModal
          open={showAddAccount}
          onClose={() => setShowAddAccount(false)}
          isFirstAccount={accounts.length === 0}
        />
      </div>
    </MainLayout>
  );
};

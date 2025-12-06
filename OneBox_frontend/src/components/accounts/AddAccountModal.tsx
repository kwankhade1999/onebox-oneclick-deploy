import { useState } from "react";
import { addAccount } from "../../features/accounts/accounts.api";

type Props = {
  open: boolean;
  onClose: () => void;
  isFirstAccount?: boolean;
};

export const AddAccountModal = ({ open, onClose, isFirstAccount }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    setError(null);
    setLoading(true);

    try {
      const uniqueId = (document.getElementById("uniqueId") as HTMLInputElement).value;
      const email = (document.getElementById("newEmail") as HTMLInputElement).value;
      const pass = (document.getElementById("newPass") as HTMLInputElement).value;

      if (!email || !pass) {
        setError("Email and App Password are required.");
        setLoading(false);
        return;
      }

      const res = await addAccount({
        id: uniqueId,
        user: email,
        host: "imap.gmail.com",
        port: 993,
        secure: true,
        pass,
      });

      if ((res as any)?.error) {
        setError((res as any).error);
        setLoading(false);
        return;
      }

      alert("Account added! Emails will start syncing from the last 30 days.");

      onClose();

      window.dispatchEvent(new Event("account-added"));
    } catch (err: any) {
      console.error("Add account error:", err);
      setError(err?.message || "Failed to add account. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-[999] fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm px-4">
      <div className="space-y-4 bg-base-200 shadow-xl p-6 border border-base-300 rounded-2xl w-full max-w-sm">
        <h3 className="font-semibold text-primary text-xl">Add IMAP Account</h3>

        {error && (
          <div className="bg-red-500/10 px-3 py-2 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <input
          id="uniqueId"
          placeholder="Unique ID"
          className="bg-base-100 px-3 py-2 rounded-xl w-full text-black placeholder:text-black/60 text-sm input input-bordered"
        />

        <input
          id="newEmail"
          placeholder="Email"
          className="bg-base-100 px-3 py-2 rounded-xl w-full text-black placeholder:text-black/60 text-sm input input-bordered"
        />

        <input
          id="newPass"
          placeholder="App Password"
          type="password"
          className="bg-base-100 px-3 py-2 rounded-xl w-full text-black placeholder:text-black/60 text-sm input input-bordered"
        />

        <div className="text-neutral-400 text-xs leading-relaxed">
          👉 Gmail users must create a <b className="text-primary">Google App Password</b>.
          <br />
          <a
            href="https://myaccount.google.com/apppasswords"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Generate App Password →
          </a>
        </div>

        <div className="flex justify-end items-center gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-full btn btn-ghost"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-6 rounded-full btn btn-primary"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

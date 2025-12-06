import type { Email } from "../../features/emails/email.types";

type Props = {
  open: boolean;
  onClose: () => void;
  email: Email | null;
  reply: string;
  setReply: (v: string) => void;
};

export const ReplySidebar = ({ open, onClose, email, reply, setReply }: Props) => {
  return (
    <>
      {open && (
        <div
          className="z-40 fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`
          fixed top-0 right-0 h-full w-[420px] bg-base-100 border-l border-base-300 
          p-6 z-50 shadow-2xl transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <button
          onClick={onClose}
          className="float-right opacity-60 hover:opacity-100 text-xl transition"
        >
          ✕
        </button>

        <h3 className="mb-4 font-semibold text-xl">Suggested Reply</h3>

        {email && (
          <div className="mb-4">
            <p className="font-medium">Subject: {email.subject}</p>
            <p className="opacity-70 mb-2 text-sm">From: {email.from}</p>

            <div className="bg-base-200 p-3 rounded-lg max-h-[220px] overflow-y-auto text-sm">
              {email.text || "No content"}
            </div>
          </div>
        )}

        <label className="font-medium text-sm">AI Suggested Reply</label>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="mt-2 p-[10px] rounded-xl w-full h-[400px] text-black textarea textarea-bordered"
        />

        <button
          onClick={() => navigator.clipboard.writeText(reply)}
          className="mt-4 w-full btn btn-primary"
        >
          Copy Reply
        </button>
      </div>
    </>
  );
};

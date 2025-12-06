import { useState } from "react";
import { generateReply } from "../../features/emails/email.api";
import type { Email } from "../../features/emails/email.types";

type Props = {
  email: Email;
  onReply: (email: Email, text: string) => void;
};

export const EmailItem = ({ email, onReply }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const snippet = email.text
    ? expanded
      ? email.text
      : email.text.slice(0, 120) + (email.text.length > 120 ? "..." : "")
    : "";

  return (
    <li className="space-y-2 bg-base-200 hover:bg-base-300/50 p-4 border border-base-300 rounded-xl transition cursor-pointer">
      <div className="font-semibold text-white text-sm line-clamp-1">
        {email.subject}
      </div>

      <div className="text-neutral-400 text-xs">{email.from}</div>

      <div className="text-[11px] text-neutral-500">
        {new Date(email.date).toLocaleString()}
      </div>

      <div className="font-medium text-[11px] text-primary">
        {email.category || "Uncategorized"}
      </div>

      {email.text && (
        <p className="text-neutral-400 text-xs leading-relaxed whitespace-pre-wrap">
          {snippet}
        </p>
      )}

      {email.text && email.text.length > 120 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
          className="text-[11px] text-primary hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}

      <button
        className="flex items-center gap-2 mt-2 px-4 rounded-full btn btn-primary btn-sm"
        disabled={loading}
        onClick={async (e) => {
          e.stopPropagation();
          setLoading(true);
          const data = await generateReply(email.id);
          setLoading(false);
          onReply(email, data.reply || "");
        }}
      >
        {loading && <span className="loading loading-spinner loading-xs"></span>}
        {loading ? "Generating..." : "Generate Reply"}
      </button>
    </li>
  );
};

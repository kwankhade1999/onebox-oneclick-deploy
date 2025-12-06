import { useState } from "react";
import { AddAccountModal } from "../components/accounts/AddAccountModal";

export const OnboardingPage = ({ reload }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center px-6 min-h-[80vh] text-center">
      <div className="space-y-5 max-w-md">
        <h2 className="font-extrabold text-primary text-3xl tracking-tight">
          Welcome to OneBox
        </h2>

        <p className="text-neutral-300 text-sm leading-relaxed">
          It looks like you don't have any emails yet.  
          Connect an IMAP account to begin syncing and organizing your inbox.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="mt-3 px-6 rounded-full btn btn-primary"
        >
          Add IMAP Account
        </button>
      </div>

      <AddAccountModal
        open={open}
        onClose={() => {
          setOpen(false);
          reload();
        }}
      />
    </div>
  );
};

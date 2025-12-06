import { useState } from "react";
import { Link } from "react-router-dom";
import { AddAccountModal } from "../accounts/AddAccountModal";

export const Topbar = () => {
  const [showAddAccount, setShowAddAccount] = useState(false);
  return (
    <header className="flex justify-between items-center px-10 py-6 w-full">
      <Link className="font-extrabold text-xl tracking-tight" to="/">
        <span className="text-primary">One</span>Box
      </Link>

      <div className="flex items-center gap-4">
        <button
          className="px-4 py-2 border rounded-full w-[134px] text-sm btn btn-ghost btn-sm glow"
          onClick={() => {
            window.dispatchEvent(new Event("add-account-opened"));
            setShowAddAccount(true);
          }}

        >
          Add Account
        </button>

        <Link
          to="/inbox"
          className="flex justify-center px-5 py-2 border rounded-full w-[134px] font-semibold text-sm btn btn-primary btn-sm glow"
        >
          Inbox
        </Link>

        <Link
          to="/filter"
          className="flex justify-center px-5 py-2 border rounded-full w-[134px] font-semibold text-sm btn btn-primary btn-sm glow"
        >
          Search
        </Link>

      </div>

      <nav className="hidden md:flex items-center gap-8 font-medium text-neutral-300 text-sm">
        <h5 className="flex justify-center px-5 py-2 border rounded-full w-[125px] font-semibold text-sm btn btn-primary btn-sm">
          Log out
        </h5>
      </nav>

      <AddAccountModal
        open={showAddAccount}
        onClose={() => setShowAddAccount(false)}
      />
    </header>
  );
};

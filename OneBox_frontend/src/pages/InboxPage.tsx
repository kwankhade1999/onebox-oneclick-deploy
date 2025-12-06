import { MainLayout } from "../layouts/MainLayout";
import { EmailList } from "../components/emails/EmailList";
import { ReplySidebar } from "../components/reply/ReplySidebar";
import { useState, useEffect, useRef } from "react";
import { fetchAccounts } from "../features/accounts/accounts.api";
import type { Email } from "../features/emails/email.types";

export const InboxPage = () => {
  const [pane, setPane] = useState<Email | null>(null);
  const [reply, setReply] = useState("");
  const [syncing, setSyncing] = useState(false);

  const refreshLoop = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopRefresh = useRef(false);

  const startRefreshLoop = () => {
    if (refreshLoop.current) return;

    console.log("⏳ Starting auto-refresh loop...");

    refreshLoop.current = setInterval(() => {
      if (!stopRefresh.current) {
        console.log("🔄 Refreshing inbox page...");
        window.location.reload();
      }
    }, 8000);
  };


  const stopLoop = () => {
    stopRefresh.current = true;

    if (refreshLoop.current) {
      clearInterval(refreshLoop.current);
      refreshLoop.current = null;
    }

    console.log("Auto-refresh stopped");
  };

useEffect(() => {
  return () => {
    stopRefresh.current = true;

    if (refreshLoop.current) {
      clearInterval(refreshLoop.current);
      refreshLoop.current = null;
    }
  };
}, []);




  useEffect(() => {
    const handler = () => stopLoop();

    window.addEventListener("add-account-opened", handler);
    return () => window.removeEventListener("add-account-opened", handler);
  }, []);

  useEffect(() => {
  const handler = () => {
    stopRefresh.current = true;  
    setSyncing(true);

    setTimeout(() => {
      stopRefresh.current = false; 
      window.location.reload();
    }, 8000);
  };

  window.addEventListener("account-added", handler);
  return () => window.removeEventListener("account-added", handler);
}, []);


  useEffect(() => {
    const init = async () => {
      const status = await fetchAccounts();
      const hasAccounts = status.accounts.length > 0;

      if (!hasAccounts) {
        console.log("📭 No accounts — no refresh loop");
        return;
      }

      if (status.emailCount === 0) {
        console.log("⏳ First time syncing...");
        setSyncing(true);

        setTimeout(() => {
          if (!stopRefresh.current) window.location.reload();
        }, 8000);

        return;
      }

   
      stopRefresh.current = false;
      startRefreshLoop();
    };

    init();
  }, []);

 
  useEffect(() => {
    return () => {
      console.log("Leaving InboxPage — stopping refresh");
      stopLoop();
    };
  }, []);



  if (syncing) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center space-y-4 h-[calc(100vh-96px)] text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="font-semibold text-lg">Syncing emails…</p>
          <p className="opacity-70 text-sm">
            Fetching last 30 days of emails. This may take a few seconds.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 h-[calc(100vh-96px)]">
        <div className="bg-base-200 shadow-lg p-5 border border-base-300 rounded-2xl h-full overflow-y-auto">
          <EmailList onSelect={(email: Email) => setPane(email)} />
        </div>
      </div>

      <ReplySidebar
        open={pane !== null}
        onClose={() => setPane(null)}
        email={pane}
        reply={reply}
        setReply={setReply}
      />
    </MainLayout>
  );
};

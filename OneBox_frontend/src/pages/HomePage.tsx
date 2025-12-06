import { Link } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";

export const HomePage = () => {
  return (
    <MainLayout>
      <section className="flex md:flex-row flex-col items-center gap-10 bg-gradient-to-br from-[#111118] to-[#181825] mt-8 md:mt-10 p-8 md:p-12 rounded-3xl">
        <div className="flex-1 space-y-5">
          <p className="font-semibold text-primary text-xs uppercase tracking-[0.25em]">
            AI Email Workspace
          </p>
          <h1 className="font-extrabold lg:text-[3.25rem] text-4xl md:text-5xl leading-tight">
            Your AI-Powered <br />
            <span className="text-primary">Inbox Assistant</span>
          </h1>
          <p className="max-w-xl text-neutral-300 text-sm md:text-base">
            Automate email triage, generate replies, and keep every account
            organized in one intelligent workspace powered by OneBox AI.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link className="px-6 rounded-full btn btn-primary" to="/inbox">
              Get Started
            </Link>
            <button className="px-6 rounded-full text-sm btn btn-ghost">
              View Templates
            </button>
          </div>
        </div>

        <div className="flex flex-1 justify-center">
          <div className="relative bg-gradient-to-br from-primary via-[#c084fc] to-[#4c1d95] rounded-[2rem] w-72 md:w-80 h-72 md:h-80 overflow-hidden">
            <div className="absolute inset-8 bg-black/15 backdrop-blur-3xl rounded-[1.75rem]" />
          </div>
        </div>
      </section>

      <section className="flex flex-wrap justify-center items-center gap-8 mt-10 text-neutral-500 text-xs uppercase tracking-[0.25em]">
        <span>Trusted by teams at</span>
        <div className="flex flex-wrap gap-6 text-[0.7rem]">
          <span>Logoplsum</span>
          <span>NovaCloud</span>
          <span>PixelForge</span>
          <span>BrightStack</span>
          <span>Flowspace</span>
        </div>
      </section>

      <section
        id="features"
        className="space-y-6 md:space-y-8 mx-auto mt-16 max-w-5xl"
      >
        <div>
          <h2 className="font-extrabold text-3xl md:text-4xl">
            Unleash Your <span className="text-primary">Productivity</span>
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-300 text-sm md:text-base">
            See how OneBox turns messy inboxes into focused workspaces. These
            workflows keep you in control while the AI does the heavy lifting.
          </p>
        </div>

        <div className="gap-5 grid grid-cols-1 md:grid-cols-3">
          <div className="space-y-3 bg-[#15151f] px-5 py-6 rounded-2xl">
            <div className="flex justify-center items-center bg-primary/15 rounded-full w-9 h-9 text-primary text-lg">
              1
            </div>
            <h3 className="font-semibold text-lg">Connect Accounts</h3>
            <p className="text-neutral-300 text-sm">
              Plug in multiple IMAP accounts and unify everything into a single
              streamlined inbox in minutes.
            </p>
          </div>
          <div className="space-y-3 bg-[#15151f] px-5 py-6 rounded-2xl">
            <div className="flex justify-center items-center bg-primary/15 rounded-full w-9 h-9 text-primary text-lg">
              2
            </div>
            <h3 className="font-semibold text-lg">Auto Organize</h3>
            <p className="text-neutral-300 text-sm">
              Let AI label, categorize, and surface what matters most so you can
              focus on conversations that move work forward.
            </p>
          </div>
          <div className="space-y-3 bg-[#15151f] px-5 py-6 rounded-2xl">
            <div className="flex justify-center items-center bg-primary/15 rounded-full w-9 h-9 text-primary text-lg">
              3
            </div>
            <h3 className="font-semibold text-lg">Reply Instantly</h3>
            <p className="text-neutral-300 text-sm">
              Generate context-aware replies in one click, then personalize and
              send without leaving your inbox.
            </p>
          </div>
        </div>
      </section>

    </MainLayout>
  );
};

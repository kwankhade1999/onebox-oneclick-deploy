import { Topbar } from "../components/layout/Topbar";

type Props = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="flex justify-center bg-[#050509] min-h-screen text-white">
      <div className="w-full max-w-6xl">
        <Topbar />
        <main className="px-4 md:px-0 pb-20">{children}</main>
      </div>
    </div>
  );
};

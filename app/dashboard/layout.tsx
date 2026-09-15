import Sidebar from "./components/Sidebar";
import { requireUser } from "@/lib/auth/require-user";
import { isSupabaseConfigured } from "@/lib/env";

export default async function Layout({ children }: LayoutProps<"/dashboard">) {
  if (isSupabaseConfigured()) {
    await requireUser();
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

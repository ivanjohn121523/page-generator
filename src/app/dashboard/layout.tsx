import Sidebar from "./components/Sidebar";
import { requireUser } from "@/src/lib/auth/require-user";
import { ClientStoresProvider } from "@/src/lib/stores/hydrate";

export default async function Layout({ children }: LayoutProps<"/dashboard">) {
  await requireUser();

  return (
    <ClientStoresProvider>
      <div className="flex h-[100dvh] overflow-hidden bg-slate-50">
        <Sidebar />
        <div className="relative flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {children}
        </div>
      </div>
    </ClientStoresProvider>
  );
}

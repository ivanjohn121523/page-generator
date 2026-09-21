"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/src/app/auth/actions";

const NAV = [
  { href: "/dashboard", label: "New site", icon: PlusIcon },
  { href: "/dashboard/sites", label: "Sites", icon: CollectionIcon },
  { href: "/dashboard/apis", label: "APIs", icon: KeyIcon },
  { href: "/dashboard/settings", label: "Settings", icon: CogIcon },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Sidebar() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="fixed top-4 left-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 shadow-sm md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <MenuIcon />
      </button>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-gray-900/40 md:hidden"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 shrink-0 flex-col border-r border-gray-200 bg-white transition-transform md:static md:h-full md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-semibold text-white">
            S
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900">Site Generator</p>
            <p className="text-xs text-gray-500">Create sites, then pages</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogoutIcon />
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function CollectionIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5M9.75 20.25V9.75" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 7.5a3.75 3.75 0 1 1-7.43 1.03L3.75 13.1v3.15h3.15l.53-.53v-1.72h1.72V12.3l.97-.97A3.75 3.75 0 0 1 15.75 7.5Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.75h.008v.008H14.25V6.75Z" />
    </svg>
  );
}

function CogIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.148.083.22.127.331.194.72.237 1.085.116l1.25-.415c.533-.176 1.1.12 1.294.643l1.293 2.584c.194.522-.023 1.11-.54 1.36l-1.17.566c-.347.168-.57.505-.57.88 0 .375.223.712.57.88l1.17.566c.517.25.734.838.54 1.36l-1.293 2.584c-.194.523-.76.82-1.294.643l-1.25-.415a1.125 1.125 0 0 0-1.085.116 8.7 8.7 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.644-.87a8.7 8.7 0 0 1-.22-.127c-.332-.194-.72-.237-1.086-.116l-1.25.415c-.532.176-1.099-.12-1.293-.643L3.44 15.66c-.194-.522.023-1.11.54-1.36l1.17-.566c.347-.168.57-.505.57-.88 0-.375-.223-.712-.57-.88l-1.17-.566c-.517-.25-.734-.838-.54-1.36l1.293-2.584c.194-.523.761-.819 1.294-.643l1.25.415a1.125 1.125 0 0 0 1.085-.116c.073-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.213-1.28Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
    </svg>
  );
}

export default Sidebar;

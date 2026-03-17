"use client";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/dashboard":  "Dashboard",
  "/users":      "User Management",
  "/discounts":  "Discounts",
  "/crm":        "CRM Sync",
  "/settings":   "Settings",
};

export default function Topbar() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Admin Console";

  return (
    <header className="h-14 bg-white border-b border-purple-100 flex items-center px-6 gap-4 sticky top-0 z-10">
      <h1 className="font-semibold text-slate-800 text-base">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search..."
            className="pl-8 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg w-48 focus:outline-none focus:border-violet-400 focus:bg-white transition-colors"
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-violet-50 transition-colors">
          <Bell size={16} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full" />
        </button>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-sky-400 flex items-center justify-center text-white text-xs font-bold">
          AD
        </div>
      </div>
    </header>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Mail, Flame, Users, Tag, Database, Settings, ChevronLeft, ChevronRight, Bell, Shield,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/dashboard",   label: "Dashboard",    icon: LayoutDashboard },
  { href: "/users",       label: "Users",        icon: Users            },
  { href: "/email-pool",  label: "Email Pool",   icon: Mail             },
  { href: "/warmup",      label: "Warmup",       icon: Flame            },
  { href: "/discounts",   label: "Discounts",    icon: Tag              },
  { href: "/crm",         label: "CRM Sync",     icon: Database         },
  { href: "/settings",    label: "Settings",     icon: Settings         },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-purple-100 transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      } min-h-screen`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-purple-100 ${collapsed ? "justify-center px-0" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center flex-shrink-0">
          <Shield size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-sm text-violet-900 leading-tight">AIW Admin</p>
            <p className="text-[10px] text-violet-400">Console v1.0</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                active
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-200"
                  : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
              } ${collapsed ? "justify-center px-2" : ""}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-sky-400 flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Super Admin</p>
              <p className="text-[10px] text-slate-400">admin@aiw.io</p>
            </div>
            <Bell size={14} className="ml-auto text-slate-400 hover:text-violet-600 cursor-pointer" />
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-purple-200 flex items-center justify-center shadow-sm hover:border-violet-400 transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} className="text-violet-600" /> : <ChevronLeft size={12} className="text-violet-600" />}
      </button>
    </aside>
  );
}

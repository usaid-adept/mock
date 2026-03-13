"use client";
import { creditServices, users, emailAccounts, CreditService } from "../lib/data";
import { Users, Flame, AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";

function CreditCard({ svc }: { svc: CreditService }) {
  const isUsedOnly   = svc.displayMode === "used_only";
  const isBandwidth  = svc.displayMode === "bandwidth";
  const hasTotal     = svc.totalCredits !== null;
  const pct          = hasTotal ? Math.round((svc.usedCredits / svc.totalCredits!) * 100) : null;
  const remaining    = hasTotal ? svc.totalCredits! - svc.usedCredits : null;
  const isAlert      = hasTotal && pct! >= svc.alertThreshold;

  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{svc.icon}</span>
          <div>
            <p className="font-semibold text-sm text-slate-800">{svc.name}</p>
            <p className="text-[11px] text-slate-400">{svc.unit}</p>
          </div>
        </div>
        {isAlert && (
          <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <AlertTriangle size={10} /> Low
          </span>
        )}
      </div>

      {/* Usage display */}
      {isUsedOnly ? (
        <div className="mb-3">
          <p className="text-2xl font-bold text-violet-700">{svc.usedCredits.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{svc.unit} consumed</p>
          <div className="mt-2 h-1 bg-gradient-to-r from-violet-200 to-sky-200 rounded-full" />
        </div>
      ) : isBandwidth ? (
        <div className="mb-3">
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Used: <strong className="text-slate-700">{svc.usedCredits} {svc.unit}</strong></span>
            <span>Left: <strong className={isAlert ? "text-amber-600" : "text-emerald-600"}>{remaining} {svc.unit}</strong></span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isAlert ? "bg-amber-400" : "bg-gradient-to-r from-violet-500 to-sky-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{pct}% of {svc.totalCredits} {svc.unit} total bandwidth</p>
        </div>
      ) : (
        <div className="mb-3">
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Used: <strong className="text-slate-700">{svc.usedCredits.toLocaleString()}</strong></span>
            <span>Left: <strong className={isAlert ? "text-amber-600" : "text-emerald-600"}>{remaining!.toLocaleString()}</strong></span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isAlert ? "bg-amber-400" : "bg-gradient-to-r from-violet-500 to-sky-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{pct}% of {svc.totalCredits!.toLocaleString()} {svc.unit}</p>
        </div>
      )}

      {/* Breakdown */}
      <div className="space-y-1 border-t border-slate-100 pt-2">
        {svc.usageBreakdown.map((b) => (
          <div key={b.label} className="flex justify-between text-[11px]">
            <span className="text-slate-500">{b.label}</span>
            <span className="font-medium text-slate-700">{b.used.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const totalUsers  = users.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const warmingEmails = emailAccounts.filter(e => e.warmupStatus === "in_progress").length;
  const alertServices = creditServices.filter(s =>
    s.totalCredits !== null && (s.usedCredits / s.totalCredits) * 100 >= s.alertThreshold
  );

  const recentSignups = [...users].sort((a, b) => b.signedUpAt.localeCompare(a.signedUpAt)).slice(0, 6);

  const stats = [
    { label: "Total Users",    value: totalUsers,    sub: `${activeUsers} active`,      icon: Users,         color: "bg-violet-100 text-violet-600" },
    { label: "Warming Up",     value: warmingEmails, sub: "email accounts in warmup",   icon: Flame,         color: "bg-amber-100 text-amber-600"   },
    { label: "Credit Alerts",  value: alertServices.length, sub: "services near limit", icon: AlertTriangle, color: "bg-rose-100 text-rose-600"     },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs font-medium text-slate-600">{s.label}</p>
              <p className="text-[11px] text-slate-400">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Signups */}
        <div className="col-span-1 bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-violet-500" />
            <h2 className="font-semibold text-sm text-slate-800">Recent Signups</h2>
          </div>
          <div className="space-y-3">
            {recentSignups.map((u) => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-sky-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {u.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate">{u.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{u.company}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  u.status === "active"  ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                  u.status === "pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                  "bg-rose-50 text-rose-700 border border-rose-200"
                }`}>{u.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Warmup Status */}
        <div className="col-span-1 bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={16} className="text-orange-500" />
            <h2 className="font-semibold text-sm text-slate-800">Warmup Overview</h2>
          </div>
          <div className="space-y-3">
            {(["not_started","in_progress","completed","assigned"] as const).map((status) => {
              const count = emailAccounts.filter(e => e.warmupStatus === status).length;
              const labels: Record<string, string> = { not_started: "Not Started", in_progress: "In Progress", completed: "Completed", assigned: "Assigned" };
              const colors: Record<string, string> = { not_started: "bg-slate-200", in_progress: "bg-amber-400", completed: "bg-emerald-400", assigned: "bg-violet-500" };
              const pct = Math.round((count / emailAccounts.length) * 100);
              return (
                <div key={status}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{labels[status]}</span>
                    <span className="font-semibold text-slate-800">{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full">
                    <div className={`h-full rounded-full ${colors[status]}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <p className="text-xs text-slate-600">
                <strong>{emailAccounts.filter(e => e.assignedTo).length}</strong> accounts assigned to workflows
              </p>
            </div>
          </div>
        </div>

        {/* Credit Alerts */}
        <div className="col-span-1 bg-white rounded-2xl border border-purple-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-500" />
            <h2 className="font-semibold text-sm text-slate-800">Credit Alerts</h2>
          </div>
          {alertServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 text-slate-400">
              <CheckCircle2 size={24} className="text-emerald-400 mb-2" />
              <p className="text-xs">All services within limits</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alertServices.map((s) => {
                const pct = Math.round((s.usedCredits / s.totalCredits!) * 100);
                return (
                  <div key={s.id} className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-amber-800">{s.icon} {s.name}</span>
                      <span className="text-xs font-bold text-amber-700">{pct}%</span>
                    </div>
                    <p className="text-[11px] text-amber-600">
                      {(s.totalCredits! - s.usedCredits).toLocaleString()} {s.unit} remaining
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-400">Last refreshed: Mar 10, 2026 · 08:00 AM</p>
          </div>
        </div>
      </div>

      {/* Credits Grid */}
      <div>
        <h2 className="font-semibold text-sm text-slate-700 mb-3">API Credit Usage</h2>
        <div className="grid grid-cols-5 gap-4">
          {creditServices.map((svc) => <CreditCard key={svc.id} svc={svc} />)}
        </div>
      </div>
    </div>
  );
}

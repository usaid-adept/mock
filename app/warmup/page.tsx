"use client";
import { useState } from "react";
import { emailAccounts as init, users, EmailAccount } from "../lib/data";
import { Flame, Play, CheckCircle2, X, User, ArrowRight, Lock, Clock } from "lucide-react";

const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  not_started: { label: "Not Started", color: "bg-slate-100 text-slate-500",            dot: "bg-slate-400"   },
  in_progress:  { label: "Warming Up",  color: "bg-amber-50 text-amber-700 border border-amber-200",   dot: "bg-amber-400"   },
  completed:    { label: "Ready",       color: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  assigned:     { label: "Assigned",    color: "bg-violet-50 text-violet-700 border border-violet-200",   dot: "bg-violet-500"  },
};

function ProgressRing({ pct }: { pct: number }) {
  const r = 20, circ = 2 * Math.PI * r;
  return (
    <svg width="52" height="52" className="-rotate-90">
      <circle cx="26" cy="26" r={r} fill="none" stroke="#e9d5ff" strokeWidth="4" />
      <circle cx="26" cy="26" r={r} fill="none" stroke="#7c3aed" strokeWidth="4"
        strokeDasharray={circ} strokeDashoffset={circ - (circ * pct) / 100}
        strokeLinecap="round" className="transition-all duration-500" />
    </svg>
  );
}

function daysElapsed(start: string | null): number {
  if (!start) return 0;
  return Math.min(14, Math.round((Date.now() - new Date(start).getTime()) / 86400000));
}

export default function WarmupPage() {
  const [accounts, setAccounts] = useState<EmailAccount[]>(init);
  const [startModal, setStartModal] = useState<EmailAccount | null>(null);
  const [assignModal, setAssignModal] = useState<EmailAccount | null>(null);
  const [selectedType, setSelectedType] = useState<"1:1 Ratio" | "Ramp Up">("Ramp Up");
  const [assignUserId, setAssignUserId] = useState("");
  const [assignWorkflow, setAssignWorkflow] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const startWarmup = () => {
    if (!startModal) return;
    const today = new Date();
    const ends = new Date(today); ends.setDate(ends.getDate() + 14);
    setAccounts(a => a.map(acc => acc.id === startModal.id ? {
      ...acc,
      warmupStatus: "in_progress",
      warmupType: selectedType,
      warmupStarted: today.toISOString().split("T")[0],
      warmupEndsAt: ends.toISOString().split("T")[0],
      mailiveryId: acc.mailiveryId ?? `mlv_${Date.now().toString().slice(-4)}`,
    } : acc));
    showToast(`✓ Warmup started for ${startModal.email} — ${selectedType} method`);
    setStartModal(null);
  };

  const assignAccount = () => {
    if (!assignModal || !assignUserId) return;
    setAccounts(a => a.map(acc => acc.id === assignModal.id ? {
      ...acc,
      warmupStatus: "assigned",
      assignedTo: assignUserId,
      assignedWorkflow: assignWorkflow || `WF-${Date.now().toString().slice(-4)}`,
    } : acc));
    const userName = users.find(u => u.id === assignUserId)?.name ?? "";
    showToast(`✓ ${assignModal.email} assigned to ${userName}`);
    setAssignModal(null);
    setAssignUserId("");
    setAssignWorkflow("");
  };

  const readyAccounts   = accounts.filter(a => a.warmupStatus === "completed");
  const warmingAccounts = accounts.filter(a => a.warmupStatus === "in_progress");
  const assignedAccounts = accounts.filter(a => a.warmupStatus === "assigned");
  const notStarted      = accounts.filter(a => a.warmupStatus === "not_started");

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-6 z-50 bg-violet-700 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle2 size={14} /> {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Not Started", val: notStarted.length,      color: "bg-slate-50 border-slate-200",         txt: "text-slate-600"   },
          { label: "Warming Up",  val: warmingAccounts.length,  color: "bg-amber-50 border-amber-200",         txt: "text-amber-700"   },
          { label: "Ready",       val: readyAccounts.length,    color: "bg-emerald-50 border-emerald-200",     txt: "text-emerald-700" },
          { label: "Assigned",    val: assignedAccounts.length, color: "bg-violet-50 border-violet-200",       txt: "text-violet-700"  },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 border ${s.color} flex items-center justify-between`}>
            <span className={`text-xs font-semibold ${s.txt}`}>{s.label}</span>
            <span className={`text-2xl font-bold ${s.txt}`}>{s.val}</span>
          </div>
        ))}
      </div>

      {/* Warmup Types Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">1:1</span>
            <h3 className="font-semibold text-sm text-slate-800">1:1 Ratio Warmup</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Send one warmed-up email alongside every cold email. Immediately begins protecting deliverability from day one, without a dedicated warmup period.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xs">↑</span>
            <h3 className="font-semibold text-sm text-slate-800">Ramp Up Warmup</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dedicated 2-week warmup period where volume gradually increases. Account floats to the user post-warmup. Best for brand-new domains and pristine deliverability.
          </p>
        </div>
      </div>

      {/* Active Warmups */}
      {warmingAccounts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Flame size={14} className="text-amber-500" /> Currently Warming Up
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {warmingAccounts.map(acc => {
              const days = daysElapsed(acc.warmupStarted);
              const pct = Math.round((days / 14) * 100);
              return (
                <div key={acc.id} className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{acc.email}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{acc.provider} · {acc.warmupType}</p>
                    </div>
                    <div className="relative flex-shrink-0">
                      <ProgressRing pct={pct} />
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-violet-700">{pct}%</span>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-slate-400">Started</p>
                      <p className="font-semibold text-slate-700">{acc.warmupStarted}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <p className="text-slate-400">Completes</p>
                      <p className="font-semibold text-slate-700">{acc.warmupEndsAt}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-600">
                    <Clock size={11} /> Day {days} of 14 — {14 - days} days remaining
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ready to Assign */}
      {readyAccounts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500" /> Ready to Assign
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {readyAccounts.map(acc => (
              <div key={acc.id} className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{acc.email}</p>
                    <p className="text-[10px] text-slate-400">{acc.warmupType} · Health: {acc.healthScore}</p>
                  </div>
                </div>
                <button onClick={() => setAssignModal(acc)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
                  Assign to User <ArrowRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assigned */}
      {assignedAccounts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Lock size={14} className="text-violet-500" /> Assigned Accounts
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {assignedAccounts.map(acc => {
              const user = users.find(u => u.id === acc.assignedTo);
              return (
                <div key={acc.id} className="bg-white rounded-2xl border border-violet-200 p-4 shadow-sm">
                  <p className="text-xs font-semibold text-slate-800 truncate mb-2">{acc.email}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <User size={11} className="text-violet-500" />
                    <span className="text-[11px] text-slate-600">{user?.name ?? "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight size={11} className="text-violet-400" />
                    <span className="text-[11px] text-slate-500 font-mono">{acc.assignedWorkflow ?? "—"}</span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                    <Lock size={10} /> Locked to workflow
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Not Started */}
      {notStarted.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Not Started</h2>
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-100 bg-violet-50/50">
                  {["Email", "Provider", "Added", "Action"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {notStarted.map(acc => (
                  <tr key={acc.id} className="hover:bg-violet-50/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-slate-800">{acc.email}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{acc.provider}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{acc.createdAt}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setStartModal(acc)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors font-medium">
                        <Play size={11} /> Start Warmup
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Start Warmup Modal */}
      {startModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-800">Start Warmup</h2>
                <p className="text-xs text-slate-400 mt-0.5">{startModal.email}</p>
              </div>
              <button onClick={() => setStartModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-2">Select Warmup Method</label>
                <div className="space-y-2">
                  {(["1:1 Ratio", "Ramp Up"] as const).map(t => (
                    <button key={t} onClick={() => setSelectedType(t)}
                      className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                        selectedType === t ? "bg-violet-600 text-white border-violet-600" : "bg-white text-slate-700 border-slate-200 hover:border-violet-300"
                      }`}>
                      <p className="font-semibold">{t}</p>
                      <p className={`text-xs mt-0.5 ${selectedType === t ? "text-violet-200" : "text-slate-400"}`}>
                        {t === "1:1 Ratio" ? "Send alongside cold emails immediately" : "Dedicated 2-week ramp — locks for 14 days"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              {selectedType === "Ramp Up" && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
                  <strong>Note:</strong> Ramp Up warmup will lock this account for 14 days. Admin will receive an email notification upon completion.
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setStartModal(null)}
                className="flex-1 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={startWarmup}
                className="flex-1 py-2 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-700 flex items-center justify-center gap-1.5">
                <Flame size={14} /> Start Warmup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-800">Assign Account</h2>
                <p className="text-xs text-slate-400 mt-0.5">{assignModal.email}</p>
              </div>
              <button onClick={() => setAssignModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Assign to User</label>
                <select value={assignUserId} onChange={e => setAssignUserId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400">
                  <option value="">— Select user —</option>
                  {users.filter(u => u.status === "active").map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.company})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Workflow Name <span className="text-slate-400 font-normal">(optional)</span></label>
                <input value={assignWorkflow} onChange={e => setAssignWorkflow(e.target.value)}
                  placeholder="e.g. WF-Q1-Outbound"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400" />
              </div>
              <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-xs text-violet-700">
                This account will be locked to the assigned workflow and user. The scheduler will use these credentials for that workflow.
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setAssignModal(null)}
                className="flex-1 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={assignAccount} disabled={!assignUserId}
                className="flex-1 py-2 text-sm font-medium bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Assign & Lock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import { emailAccounts as init, users, EmailAccount } from "../lib/data";
import { Plus, X, CheckCircle2, Wifi, WifiOff, RefreshCw, Trash2, ExternalLink } from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
  not_started: "bg-slate-100 text-slate-500",
  in_progress:  "bg-amber-50 text-amber-700 border border-amber-200",
  completed:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  assigned:     "bg-violet-50 text-violet-700 border border-violet-200",
};
const STATUS_LABEL: Record<string, string> = {
  not_started: "Not Started", in_progress: "Warming Up", completed: "Ready", assigned: "Assigned",
};

export default function EmailPoolPage() {
  const [accounts, setAccounts] = useState<EmailAccount[]>(init);
  const [addModal, setAddModal] = useState(false);
  const [detailModal, setDetailModal] = useState<EmailAccount | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", provider: "Google" as "Google" | "Outlook" });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const addAccount = () => {
    if (!form.email) return;
    const fresh: EmailAccount = {
      id: `e${Date.now()}`,
      email: form.email,
      provider: form.provider,
      mailiveryId: null,
      warmupStatus: "not_started",
      warmupType: "None",
      warmupStarted: null,
      warmupEndsAt: null,
      assignedTo: null,
      assignedWorkflow: null,
      healthScore: 50,
      dailySendLimit: 80,
      sentToday: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAccounts(a => [fresh, ...a]);
    setForm({ email: "", provider: "Google" });
    setAddModal(false);
    showToast(`✓ ${fresh.email} added to pool`);
  };

  const createMailivery = (id: string) => {
    setAccounts(a => a.map(acc => acc.id === id ? { ...acc, mailiveryId: `mlv_${Date.now().toString().slice(-4)}` } : acc));
    showToast("✓ Mailivery account created");
  };

  const removeAccount = (id: string) => {
    const acc = accounts.find(a => a.id === id);
    setAccounts(a => a.filter(x => x.id !== id));
    showToast(`Removed ${acc?.email}`);
  };

  const getUserName = (id: string | null) => id ? (users.find(u => u.id === id)?.name ?? "—") : "Unassigned";

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-4 right-6 z-50 bg-violet-700 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle2 size={14} /> {toast}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Accounts",  val: accounts.length,                                              color: "text-violet-700 bg-violet-50" },
          { label: "Active / Ready",  val: accounts.filter(a => a.warmupStatus === "completed" || a.warmupStatus === "assigned").length, color: "text-emerald-700 bg-emerald-50" },
          { label: "Warming Up",      val: accounts.filter(a => a.warmupStatus === "in_progress").length, color: "text-amber-700 bg-amber-50"   },
          { label: "Uninitialized",   val: accounts.filter(a => a.warmupStatus === "not_started").length, color: "text-slate-600 bg-slate-100"  },
        ].map(c => (
          <div key={c.label} className={`rounded-2xl p-4 ${c.color} flex items-center justify-between`}>
            <span className="text-xs font-semibold opacity-80">{c.label}</span>
            <span className="text-2xl font-bold">{c.val}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button onClick={() => setAddModal(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
          <Plus size={14} /> Add Email Account
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple-100 bg-violet-50/50">
              {["Email","Provider","Mailivery","Warmup","Daily Limit","Assigned To","Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {accounts.map(acc => (
              <tr key={acc.id} className="hover:bg-violet-50/30 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-slate-800 text-xs">{acc.email}</p>
                    <p className="text-[10px] text-slate-400">{acc.createdAt}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 text-xs font-medium ${acc.provider === "Google" ? "text-sky-600" : "text-indigo-600"}`}>
                    {acc.provider === "Google" ? <Wifi size={12}/> : <WifiOff size={12}/>} {acc.provider}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {acc.mailiveryId ? (
                    <span className="text-[11px] font-mono bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">{acc.mailiveryId}</span>
                  ) : (
                    <button onClick={() => createMailivery(acc.id)}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 hover:bg-violet-100 hover:text-violet-700 transition-colors">
                      + Create
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[acc.warmupStatus]}`}>
                    {STATUS_LABEL[acc.warmupStatus]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  <span>{acc.sentToday}</span>
                  <span className="text-slate-300"> / </span>
                  <span>{acc.dailySendLimit}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {acc.assignedTo ? (
                    <div>
                      <p className="font-medium text-slate-700">{getUserName(acc.assignedTo)}</p>
                      {acc.assignedWorkflow && <p className="text-[10px] text-slate-400">{acc.assignedWorkflow}</p>}
                    </div>
                  ) : (
                    <span className="text-slate-300">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setDetailModal(acc)}
                      className="p-1.5 rounded-lg bg-violet-100 text-violet-600 hover:bg-violet-200 transition-colors" title="View Details">
                      <ExternalLink size={12} />
                    </button>
                    <button onClick={() => createMailivery(acc.id)}
                      className="p-1.5 rounded-lg bg-sky-100 text-sky-600 hover:bg-sky-200 transition-colors" title="Sync">
                      <RefreshCw size={12} />
                    </button>
                    <button onClick={() => removeAccount(acc.id)}
                      className="p-1.5 rounded-lg bg-rose-100 text-rose-500 hover:bg-rose-200 transition-colors" title="Remove">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-800">Add Email Account</h2>
              <button onClick={() => setAddModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Email Address</label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="outreach@yourdomain.com"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Google","Outlook"] as const).map(p => (
                    <button key={p} onClick={() => setForm(f => ({ ...f, provider: p }))}
                      className={`py-2 text-sm rounded-xl border font-medium transition-all ${
                        form.provider === p ? "bg-violet-600 text-white border-violet-600" : "bg-white text-slate-600 border-slate-200 hover:border-violet-300"
                      }`}>{p}</button>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-700">
                After adding, you can trigger Mailivery account creation separately from the table.
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setAddModal(false)}
                className="flex-1 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={addAccount}
                className="flex-1 py-2 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-700">Add Account</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-800 text-sm">{detailModal.email}</h2>
                <p className="text-xs text-slate-400">{detailModal.provider} · Added {detailModal.createdAt}</p>
              </div>
              <button onClick={() => setDetailModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Mailivery ID", detailModal.mailiveryId ?? "Not created"],
                ["Warmup Status", STATUS_LABEL[detailModal.warmupStatus]],
                ["Warmup Type", detailModal.warmupType],
                ["Health Score", `${detailModal.healthScore}/100`],
                ["Daily Limit", `${detailModal.sentToday} / ${detailModal.dailySendLimit}`],
                ["Warmup Started", detailModal.warmupStarted ?? "—"],
                ["Warmup Ends", detailModal.warmupEndsAt ?? "—"],
                ["Assigned To", getUserName(detailModal.assignedTo)],
                ["Workflow", detailModal.assignedWorkflow ?? "—"],
              ].map(([k,v]) => (
                <div key={k} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[10px] text-slate-400 font-medium">{k}</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setDetailModal(null)} className="w-full mt-5 py-2 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-700">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

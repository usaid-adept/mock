"use client";
import { useState } from "react";
import { discounts as init, Discount, Plan } from "../lib/data";
import { Plus, X, CheckCircle2, Tag, Calendar, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const PLANS: Plan[] = ["Starter", "Growth", "Scale", "Enterprise"];

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>(init);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    percent: 10,
    appliesTo: [] as Plan[],
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const togglePlan = (p: Plan) => setForm(f => ({
    ...f, appliesTo: f.appliesTo.includes(p) ? f.appliesTo.filter(x => x !== p) : [...f.appliesTo, p],
  }));

  const addDiscount = () => {
    if (!form.endDate || form.appliesTo.length === 0) return;
    const d: Discount = {
      id: `d${Date.now()}`,
      code: `DISC-${Date.now().toString().slice(-5)}`,
      percent: form.percent,
      appliesTo: form.appliesTo,
      startDate: form.startDate,
      endDate: form.endDate,
      active: true,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setDiscounts(prev => [d, ...prev]);
    setModal(false);
    setForm({ percent: 10, appliesTo: [], startDate: new Date().toISOString().split("T")[0], endDate: "" });
    showToast(`✓ ${d.percent}% discount created for ${d.appliesTo.join(", ")}`);
  };

  const toggleActive = (id: string) => {
    setDiscounts(d => d.map(x => x.id === id ? { ...x, active: !x.active } : x));
  };

  const remove = (id: string) => {
    setDiscounts(prev => prev.filter(x => x.id !== id));
    showToast("Discount removed");
  };

  const now = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-4 right-6 z-50 bg-violet-700 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle2 size={14} /> {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-700">Active Discounts</span>
          <span className="text-2xl font-bold text-emerald-700">{discounts.filter(d => d.active).length}</span>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Inactive / Expired</span>
          <span className="text-2xl font-bold text-slate-600">{discounts.filter(d => !d.active || d.endDate < now).length}</span>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-violet-700">Total Created</span>
          <span className="text-2xl font-bold text-violet-700">{discounts.length}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
          <Plus size={14} /> Create Discount
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">
        {discounts.map(d => {
          const expired = d.endDate < now;
          const scheduled = d.startDate > now;
          return (
            <div key={d.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${
              d.active && !expired ? "border-violet-200" : "border-slate-200 opacity-60"
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center">
                    <Tag size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Created {d.createdAt}</p>
                  </div>
                </div>
                <span className={`text-2xl font-black ${d.active && !expired ? "text-violet-600" : "text-slate-300"}`}>
                  {d.percent}%
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex flex-wrap gap-1">
                  {d.appliesTo.map(p => (
                    <span key={p} className="text-[11px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-medium">{p}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Calendar size={11} />
                  <span>{d.startDate} → {d.endDate}</span>
                </div>
                {expired && <span className="text-[11px] text-rose-500 font-medium">Expired</span>}
                {scheduled && !expired && <span className="text-[11px] text-sky-600 font-medium">Scheduled</span>}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => toggleActive(d.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-colors ${
                    d.active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}>
                  {d.active ? <ToggleRight size={13}/> : <ToggleLeft size={13}/>}
                  {d.active ? "Active" : "Inactive"}
                </button>
                <button onClick={() => remove(d.id)}
                  className="ml-auto p-1.5 rounded-xl bg-rose-100 text-rose-500 hover:bg-rose-200 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-800">Create Discount</h2>
              <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Discount Percentage</label>
                <div className="flex items-center gap-3">
                  <input type="range" min={5} max={80} step={5} value={form.percent}
                    onChange={e => setForm(f => ({ ...f, percent: Number(e.target.value) }))}
                    className="flex-1 accent-violet-600" />
                  <span className="text-xl font-black text-violet-600 w-14 text-right">{form.percent}%</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-0.5">
                  <span>5%</span><span>80%</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Applies To Plans</label>
                <div className="grid grid-cols-2 gap-2">
                  {PLANS.map(p => (
                    <button key={p} onClick={() => togglePlan(p)}
                      className={`py-2 text-sm rounded-xl border font-medium transition-all ${
                        form.appliesTo.includes(p) ? "bg-violet-600 text-white border-violet-600" : "bg-white text-slate-600 border-slate-200 hover:border-violet-300"
                      }`}>{p}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1.5">End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-xs text-violet-700">
                This will create a Stripe coupon and apply it to all new charges for the selected plans during the active period.
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setModal(false)}
                className="flex-1 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={addDiscount} disabled={!form.endDate || form.appliesTo.length === 0}
                className="flex-1 py-2 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Create Discount
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

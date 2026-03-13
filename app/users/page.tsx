"use client";
import { useState } from "react";
import { users as initialUsers, User, Plan } from "../lib/data";
import { UserCheck, UserX, Search, ChevronDown, CheckCircle2, X, Plus } from "lucide-react";

const PLANS: Plan[] = ["Starter", "Growth", "Scale", "Enterprise"];
const STATUS_COLORS: Record<string, string> = {
  active:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending:   "bg-amber-50 text-amber-700 border-amber-200",
  suspended: "bg-rose-50 text-rose-700 border-rose-200",
};

function Badge({ status }: { status: string }) {
  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${STATUS_COLORS[status] ?? ""}`}>
      {status}
    </span>
  );
}

type ModalUser = User & { editPlan: Plan };

export default function UsersPage() {
  const [data, setData] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [modal, setModal] = useState<ModalUser | null>(null);
  const [newUserModal, setNewUserModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = data.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    const matchPlan = filterPlan === "all" || u.plan === filterPlan;
    return matchSearch && matchStatus && matchPlan;
  });

  const openEdit = (u: User) => setModal({ ...u, editPlan: u.plan });

  const saveEdit = () => {
    if (!modal) return;
    setData(d => d.map(u => u.id === modal.id ? {
      ...u,
      plan: modal.editPlan,
      adminApproved: true,
      status: "active",
    } : u));
    showToast(`✓ ${modal.name} approved — Plan: ${modal.editPlan}`);
    setModal(null);
  };

  const toggleSuspend = (id: string) => {
    setData(d => d.map(u => u.id === id ? {
      ...u, status: u.status === "suspended" ? "active" : "suspended"
    } : u));
    const u = data.find(x => x.id === id);
    showToast(u?.status === "suspended" ? `✓ ${u.name} reactivated` : `${u?.name} suspended`);
  };

  const [newUser, setNewUser] = useState({ name: "", email: "", company: "" });

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    const fresh: User = {
      id: `u${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      company: newUser.company,
      signedUpAt: new Date().toISOString().split("T")[0],
      status: "pending",
      plan: "None",
      accountManager: null,
      stripeApproved: false,
      adminApproved: false,
    };
    setData(d => [fresh, ...d]);
    setNewUser({ name: "", email: "", company: "" });
    setNewUserModal(false);
    showToast(`✓ ${fresh.name} added as pending user`);
  };

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-4 right-6 z-50 bg-violet-700 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle2 size={14} /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{data.filter(u => u.status === "pending").length} pending approvals</p>
        <button
          onClick={() => setNewUserModal(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={14} /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-purple-100 p-4 flex items-center gap-3 shadow-sm">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, company..."
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400"
          />
        </div>
        <div className="relative">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400 bg-white">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-violet-400 bg-white">
            <option value="all">All Plans</option>
            <option value="None">No Plan</option>
            {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <span className="ml-auto text-xs text-slate-400">{filtered.length} users</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple-100 bg-violet-50/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Company</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Plan</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Approval</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Signed Up</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-violet-50/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-sky-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600 text-xs">{u.company}</td>
                <td className="px-4 py-3"><Badge status={u.status} /></td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${u.plan === "None" ? "text-slate-400" : "text-violet-700"}`}>
                    {u.plan === "None" ? "—" : u.plan}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${u.stripeApproved ? "bg-sky-50 text-sky-700" : "bg-slate-100 text-slate-400"}`}>
                      {u.stripeApproved ? "Stripe ✓" : "Stripe —"}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${u.adminApproved ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-400"}`}>
                      {u.adminApproved ? "Admin ✓" : "Admin —"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">{u.signedUpAt}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => openEdit(u)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-violet-100 text-violet-700 hover:bg-violet-200 font-medium transition-colors">
                      Assign Plan
                    </button>
                    <button onClick={() => toggleSuspend(u.id)}
                      className={`p-1.5 rounded-lg transition-colors ${u.status === "suspended" ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200" : "bg-rose-100 text-rose-500 hover:bg-rose-200"}`}
                      title={u.status === "suspended" ? "Reactivate" : "Suspend"}>
                      {u.status === "suspended" ? <UserCheck size={13} /> : <UserX size={13} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Plan Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-800 text-base">Assign Plan</h2>
                <p className="text-xs text-slate-400">{modal.name} · {modal.company}</p>
              </div>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Select Plan</label>
                <div className="grid grid-cols-2 gap-2">
                  {["None", ...PLANS].map(p => (
                    <button key={p} onClick={() => setModal(m => m ? { ...m, editPlan: p as Plan } : m)}
                      className={`py-2.5 px-3 text-sm rounded-xl border font-medium transition-all ${
                        modal.editPlan === p
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-white text-slate-600 border-slate-200 hover:border-violet-300"
                      }`}>{p}</button>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-violet-50 border border-violet-200">
                <p className="text-xs text-violet-700">
                  <strong>Admin Override:</strong> This will mark the account as admin-approved and set status to active — bypassing the Stripe payment flow.
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setModal(null)}
                className="flex-1 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={saveEdit}
                className="flex-1 py-2 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors">
                Save & Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New User Modal */}
      {newUserModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-800 text-base">Add New User</h2>
              <button onClick={() => setNewUserModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {(["name","email","company"] as const).map(f => (
                <div key={f}>
                  <label className="text-xs font-semibold text-slate-600 block mb-1 capitalize">{f}</label>
                  <input value={newUser[f]} onChange={e => setNewUser(n => ({ ...n, [f]: e.target.value }))}
                    placeholder={f === "email" ? "user@company.com" : f === "name" ? "Full Name" : "Company Name"}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400" />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setNewUserModal(false)}
                className="flex-1 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={addUser}
                className="flex-1 py-2 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors">Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";
import { Shield, Mail, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState("admin@aiw.io");
  const [alertEmail, setAlertEmail] = useState("alerts@aiw.io");
  const [platformUrl, setPlatformUrl] = useState("https://app.aiw.io");
  const [displayName, setDisplayName] = useState("Super Admin");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="space-y-5 max-w-2xl">
      {toast && (
        <div className="fixed top-4 right-6 z-50 bg-violet-700 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle2 size={14} /> {toast}
        </div>
      )}

      {/* Admin Account */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield size={16} className="text-violet-500" />
          <h2 className="font-semibold text-slate-800">Admin Account</h2>
        </div>

        {/* Avatar row */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-400 to-sky-400 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            AD
          </div>
          <div>
            <p className="font-semibold text-slate-800">{displayName}</p>
            <p className="text-xs text-slate-400">{adminEmail}</p>
          </div>
          <button className="ml-auto text-xs px-3 py-1.5 rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors font-medium">
            Change Avatar
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Display Name</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Admin Email</label>
            <input value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Alert Email</label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={alertEmail} onChange={e => setAlertEmail(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Platform URL</label>
            <input value={platformUrl} onChange={e => setPlatformUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400" />
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={16} className="text-violet-500" />
          <h2 className="font-semibold text-slate-800">Change Password</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Current Password</label>
            <input type="password" placeholder="••••••••••••"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">New Password</label>
              <input type="password" placeholder="••••••••••••"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Confirm New Password</label>
              <input type="password" placeholder="••••••••••••"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => showToast("✓ Settings saved successfully")}
          className="px-6 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-sm">
          Save Changes
        </button>
      </div>
    </div>
  );
}

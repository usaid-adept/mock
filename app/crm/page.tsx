"use client";
import { useState } from "react";
import { crmConnections as init, CRMSync } from "../lib/data";
import { RefreshCw, CheckCircle2, X, PlugZap, Unplug, Database, Clock, Lock, Star } from "lucide-react";

const CRM_INFO: Record<string, { color: string; bg: string; description: string }> = {
  HubSpot:        { color: "text-orange-700", bg: "bg-orange-50 border-orange-200",  description: "Marketing, CRM & sales platform. Syncs contacts, deals, and companies." },
  Salesforce:     { color: "text-sky-700",    bg: "bg-sky-50 border-sky-200",        description: "Enterprise CRM. Syncs leads, opportunities, accounts, and contacts." },
  Pipedrive:      { color: "text-emerald-700",bg: "bg-emerald-50 border-emerald-200",description: "Sales pipeline CRM. Syncs deals, persons, and organizations." },
  Zoho:           { color: "text-red-700",    bg: "bg-red-50 border-red-200",        description: "All-in-one business suite. Syncs leads, accounts, and contacts." },
  ActiveCampaign: { color: "text-violet-700", bg: "bg-violet-50 border-violet-200",  description: "Email marketing & CRM. Syncs contacts, lists, and automations." },
};

type CRMProvider = "HubSpot" | "Salesforce" | "Pipedrive" | "Zoho" | "ActiveCampaign";

function fmt(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function CRMPage() {
  const [crms, setCrms] = useState<CRMSync[]>(init);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [connectModal, setConnectModal] = useState<CRMSync | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Admin CRM state
  const [adminCRM, setAdminCRM] = useState<CRMProvider | null>(null);
  const [adminCRMLocked, setAdminCRMLocked] = useState(false);
  const [adminSyncing, setAdminSyncing] = useState(false);
  const [adminRecords, setAdminRecords] = useState(0);
  const [adminLastSynced, setAdminLastSynced] = useState<string | null>(null);
  const [adminCRMModal, setAdminCRMModal] = useState(false);
  const [selectedAdminCRM, setSelectedAdminCRM] = useState<CRMProvider | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const triggerSync = (id: string) => {
    const crm = crms.find(c => c.id === id);
    if (!crm || crm.status === "disconnected") return;
    setSyncing(id);
    setCrms(c => c.map(x => x.id === id ? { ...x, status: "syncing" } : x));
    setTimeout(() => {
      const newRecords = Math.floor(Math.random() * 400) + 100;
      setCrms(c => c.map(x => x.id === id ? {
        ...x, status: "connected", lastSynced: new Date().toISOString(), recordsSynced: x.recordsSynced + newRecords,
      } : x));
      setSyncing(null);
      showToast(`✓ ${crm.provider} synced — ${newRecords} new records`);
    }, 2000);
  };

  const toggleConnect = (crm: CRMSync) => {
    if (crm.status === "disconnected") {
      setConnectModal(crm);
    } else {
      setCrms(c => c.map(x => x.id === crm.id ? { ...x, status: "disconnected", lastSynced: null, recordsSynced: 0 } : x));
      showToast(`Disconnected from ${crm.provider}`);
    }
  };

  const confirmConnect = () => {
    if (!connectModal) return;
    setCrms(c => c.map(x => x.id === connectModal.id ? { ...x, status: "connected" } : x));
    showToast(`✓ Connected to ${connectModal.provider}`);
    setConnectModal(null);
  };

  const lockAdminCRM = () => {
    if (!selectedAdminCRM) return;
    setAdminCRM(selectedAdminCRM);
    setAdminCRMLocked(true);
    setAdminCRMModal(false);
    showToast(`✓ Admin CRM locked to ${selectedAdminCRM}`);
  };

  const syncAdminCRM = () => {
    if (!adminCRM || !adminCRMLocked) return;
    setAdminSyncing(true);
    setTimeout(() => {
      const newRecords = Math.floor(Math.random() * 800) + 200;
      setAdminRecords(r => r + newRecords);
      setAdminLastSynced(new Date().toISOString());
      setAdminSyncing(false);
      showToast(`✓ Admin CRM synced — ${newRecords} records pulled into admin dataset`);
    }, 2500);
  };

  const unlockAdminCRM = () => {
    setAdminCRM(null);
    setAdminCRMLocked(false);
    setAdminRecords(0);
    setAdminLastSynced(null);
    showToast("Admin CRM integration removed");
  };

  const connected = crms.filter(c => c.status !== "disconnected");
  const totalRecords = crms.reduce((s, c) => s + c.recordsSynced, 0);

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed top-4 right-6 z-50 bg-violet-700 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle2 size={14} /> {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-violet-700">Connected CRMs</span>
          <span className="text-2xl font-bold text-violet-700">{connected.length} / {crms.length}</span>
        </div>
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-sky-700">Total Records Synced</span>
          <span className="text-2xl font-bold text-sky-700">{totalRecords.toLocaleString()}</span>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-700">Sync Frequency</span>
          <span className="text-sm font-bold text-emerald-700">Every 3 days</span>
        </div>
      </div>

      {/* Admin CRM Integration */}
      <div className={`rounded-2xl border shadow-sm p-5 ${adminCRMLocked ? "bg-white border-violet-300" : "bg-white border-purple-100"}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-violet-500" />
            <h2 className="font-semibold text-sm text-slate-800">Admin CRM Integration</h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200 font-medium">Admin Dataset</span>
          </div>
          {adminCRMLocked ? (
            <button onClick={unlockAdminCRM}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-rose-100 text-rose-600 hover:bg-rose-200 transition-colors font-medium">
              <Unplug size={12} /> Remove Integration
            </button>
          ) : (
            <button onClick={() => setAdminCRMModal(true)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              <PlugZap size={14} /> Integrate Admin CRM
            </button>
          )}
        </div>

        {adminCRMLocked && adminCRM ? (
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-xl border flex items-center justify-center text-xl font-black flex-shrink-0 ${CRM_INFO[adminCRM].bg} ${CRM_INFO[adminCRM].color}`}>
              {adminCRM.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-slate-800">{adminCRM}</p>
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200 font-medium">
                  <Lock size={9} /> Locked
                </span>
              </div>
              <p className="text-xs text-slate-400">{CRM_INFO[adminCRM].description}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 text-center flex-shrink-0">
              <div>
                <p className="text-xl font-bold text-slate-800">{adminRecords.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">Records in admin dataset</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 flex items-center gap-1 justify-center">
                  <Clock size={11} className="text-slate-400" />
                  {fmt(adminLastSynced)}
                </p>
                <p className="text-[10px] text-slate-400">Last synced</p>
              </div>
            </div>
            <button onClick={syncAdminCRM} disabled={adminSyncing}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-colors flex-shrink-0 ${
                adminSyncing ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-violet-600 text-white hover:bg-violet-700"
              }`}>
              <RefreshCw size={14} className={adminSyncing ? "animate-spin" : ""} />
              {adminSyncing ? "Syncing..." : "Sync All Records"}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-16 text-slate-400">
            <p className="text-xs">No admin CRM integrated. Select a CRM to lock it to the admin dataset.</p>
          </div>
        )}
      </div>

      {/* Platform CRM Connections */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Database size={14} className="text-slate-500" />
          <h2 className="font-semibold text-sm text-slate-700">Platform CRM Connections</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {crms.map(crm => {
            const info = CRM_INFO[crm.provider];
            const isSyncing = syncing === crm.id;
            return (
              <div key={crm.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${crm.status !== "disconnected" ? "border-purple-100" : "border-slate-200"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-lg font-bold flex-shrink-0 ${info.bg} ${info.color}`}>
                    {crm.provider.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-slate-800">{crm.provider}</p>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${
                        crm.status === "connected" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        crm.status === "syncing"   ? "bg-sky-50 text-sky-700 border-sky-200" :
                        "bg-slate-100 text-slate-500 border-slate-200"
                      }`}>
                        {isSyncing ? "Syncing..." : crm.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{info.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center flex-shrink-0">
                    <div>
                      <p className="text-lg font-bold text-slate-800">{crm.recordsSynced.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">Records</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 flex items-center gap-1 justify-center">
                        <Clock size={11} className="text-slate-400" />
                        {fmt(crm.lastSynced)}
                      </p>
                      <p className="text-[10px] text-slate-400">Last synced</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => triggerSync(crm.id)}
                      disabled={crm.status === "disconnected" || isSyncing}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                        crm.status === "disconnected" || isSyncing
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-sky-100 text-sky-700 hover:bg-sky-200"
                      }`}>
                      <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
                      {isSyncing ? "Syncing" : "Sync Now"}
                    </button>
                    <button onClick={() => toggleConnect(crm)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                        crm.status !== "disconnected"
                          ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      }`}>
                      {crm.status !== "disconnected" ? <Unplug size={12} /> : <PlugZap size={12} />}
                      {crm.status !== "disconnected" ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin CRM Select Modal */}
      {adminCRMModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-slate-800">Integrate Admin CRM</h2>
                <p className="text-xs text-slate-400 mt-0.5">This CRM will be locked for admin dataset enrichment</p>
              </div>
              <button onClick={() => setAdminCRMModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={16} /></button>
            </div>
            <div className="space-y-2 mb-5">
              {(Object.keys(CRM_INFO) as CRMProvider[]).map(provider => {
                const info = CRM_INFO[provider];
                const isSelected = selectedAdminCRM === provider;
                return (
                  <button key={provider} onClick={() => setSelectedAdminCRM(provider)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                    }`}>
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center font-bold text-sm flex-shrink-0 ${info.bg} ${info.color}`}>
                      {provider.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${isSelected ? "text-violet-800" : "text-slate-800"}`}>{provider}</p>
                      <p className="text-[11px] text-slate-400 truncate">{info.description}</p>
                    </div>
                    {isSelected && <CheckCircle2 size={16} className="text-violet-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 mb-4">
              <strong>Note:</strong> Once locked, this CRM will be used exclusively for the admin enrichment dataset. You can only have one admin CRM at a time.
            </div>
            <div className="flex gap-2">
              <button onClick={() => setAdminCRMModal(false)}
                className="flex-1 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={lockAdminCRM} disabled={!selectedAdminCRM}
                className="flex-1 py-2 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5">
                <Lock size={13} /> Lock & Integrate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {connectModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-800">Connect {connectModal.provider}</h2>
              <button onClick={() => setConnectModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <p className="text-xs text-slate-500">{CRM_INFO[connectModal.provider].description}</p>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">API Key</label>
                <input placeholder="Enter API key..." className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Workspace / Account ID</label>
                <input placeholder="e.g. hub-123456" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400" />
              </div>
              <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 text-xs text-violet-700">
                Data will sync every 3 days automatically. You can also trigger a manual sync anytime.
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setConnectModal(null)}
                className="flex-1 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={confirmConnect}
                className="flex-1 py-2 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-700">Connect</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

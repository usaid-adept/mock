export type UserStatus = "active" | "pending" | "suspended";
export type Plan = "Starter" | "Growth" | "Scale" | "Enterprise" | "None";
export type WarmupStatus = "not_started" | "in_progress" | "completed" | "assigned";
export type WarmupType = "1:1 Ratio" | "Ramp Up" | "None";

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  signedUpAt: string;
  status: UserStatus;
  plan: Plan;
  accountManager: string | null;
  stripeApproved: boolean;
  adminApproved: boolean;
}

export interface EmailAccount {
  id: string;
  email: string;
  provider: "Google" | "Outlook";
  mailiveryId: string | null;
  warmupStatus: WarmupStatus;
  warmupType: WarmupType;
  warmupStarted: string | null;
  warmupEndsAt: string | null;
  assignedTo: string | null; // user id
  assignedWorkflow: string | null;
  healthScore: number; // 0-100
  dailySendLimit: number;
  sentToday: number;
  createdAt: string;
}

export type CreditDisplayMode = "used_only" | "used_of_total" | "bandwidth";

export interface CreditService {
  id: string;
  name: string;
  icon: string;
  totalCredits: number | null; // null = no total (used_only mode)
  usedCredits: number;
  unit: string;
  displayMode: CreditDisplayMode;
  alertThreshold: number;
  usageBreakdown: { label: string; used: number }[];
  lastRefreshed: string;
}

export interface Discount {
  id: string;
  code: string;
  percent: number;
  appliesTo: Plan[];
  startDate: string;
  endDate: string;
  active: boolean;
  createdAt: string;
}

export interface CRMSync {
  id: string;
  provider: "HubSpot" | "Salesforce" | "Pipedrive" | "Zoho" | "ActiveCampaign";
  lastSynced: string | null;
  recordsSynced: number;
  status: "connected" | "disconnected" | "syncing";
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const ACCOUNT_MANAGERS = [
  "Sarah Mitchell",
  "James Patel",
  "Lena Hoffman",
  "Carlos Rivera",
];

export const users: User[] = [
  { id: "u1",  name: "Alice Johnson",    email: "alice@nexusco.io",       company: "NexusCo",        signedUpAt: "2026-02-01", status: "active",    plan: "Growth",     accountManager: "Sarah Mitchell", stripeApproved: true,  adminApproved: true  },
  { id: "u2",  name: "Bob Chen",         email: "bob@launchpad.dev",      company: "LaunchPad",      signedUpAt: "2026-02-04", status: "active",    plan: "Scale",      accountManager: "James Patel",    stripeApproved: true,  adminApproved: true  },
  { id: "u3",  name: "Clara Diaz",       email: "clara@brightmind.com",   company: "BrightMind",     signedUpAt: "2026-02-10", status: "pending",   plan: "None",       accountManager: null,             stripeApproved: false, adminApproved: false },
  { id: "u4",  name: "David Osei",       email: "david@orbit.io",         company: "Orbit Inc",      signedUpAt: "2026-02-12", status: "active",    plan: "Starter",    accountManager: "Lena Hoffman",   stripeApproved: false, adminApproved: true  },
  { id: "u5",  name: "Elena Marchetti",  email: "elena@fusionlabs.eu",    company: "FusionLabs",     signedUpAt: "2026-02-15", status: "active",    plan: "Enterprise", accountManager: "Carlos Rivera",  stripeApproved: true,  adminApproved: true  },
  { id: "u6",  name: "Frank Nguyen",     email: "frank@stackrise.com",    company: "StackRise",      signedUpAt: "2026-02-18", status: "pending",   plan: "None",       accountManager: null,             stripeApproved: false, adminApproved: false },
  { id: "u7",  name: "Grace Kim",        email: "grace@pingcloud.net",    company: "PingCloud",      signedUpAt: "2026-02-20", status: "active",    plan: "Growth",     accountManager: "Sarah Mitchell", stripeApproved: true,  adminApproved: true  },
  { id: "u8",  name: "Henry Walsh",      email: "henry@datavine.co",      company: "DataVine",       signedUpAt: "2026-02-22", status: "suspended", plan: "Starter",    accountManager: "James Patel",    stripeApproved: true,  adminApproved: true  },
  { id: "u9",  name: "Isabel Santos",    email: "isabel@hyperwave.io",    company: "HyperWave",      signedUpAt: "2026-02-25", status: "pending",   plan: "None",       accountManager: null,             stripeApproved: false, adminApproved: false },
  { id: "u10", name: "Jake Torres",      email: "jake@prismtech.com",     company: "PrismTech",      signedUpAt: "2026-02-27", status: "active",    plan: "Scale",      accountManager: "Lena Hoffman",   stripeApproved: true,  adminApproved: true  },
  { id: "u11", name: "Karen Liu",        email: "karen@zenithai.io",      company: "ZenithAI",       signedUpAt: "2026-03-01", status: "active",    plan: "Growth",     accountManager: "Carlos Rivera",  stripeApproved: false, adminApproved: true  },
  { id: "u12", name: "Liam O'Brien",     email: "liam@cloudnine.dev",     company: "CloudNine",      signedUpAt: "2026-03-03", status: "pending",   plan: "None",       accountManager: null,             stripeApproved: false, adminApproved: false },
  { id: "u13", name: "Maya Patel",       email: "maya@growthspark.com",   company: "GrowthSpark",    signedUpAt: "2026-03-05", status: "active",    plan: "Enterprise", accountManager: "Sarah Mitchell", stripeApproved: true,  adminApproved: true  },
  { id: "u14", name: "Nathan Brooks",    email: "nathan@velocity.io",     company: "Velocity",       signedUpAt: "2026-03-06", status: "active",    plan: "Starter",    accountManager: "James Patel",    stripeApproved: false, adminApproved: true  },
  { id: "u15", name: "Olivia Fernandez", email: "olivia@moonshot.co",     company: "MoonShot",       signedUpAt: "2026-03-07", status: "pending",   plan: "None",       accountManager: null,             stripeApproved: false, adminApproved: false },
  { id: "u16", name: "Paul Nakamura",    email: "paul@revenuepilot.com",  company: "RevenuePilot",   signedUpAt: "2026-03-08", status: "active",    plan: "Scale",      accountManager: "Lena Hoffman",   stripeApproved: true,  adminApproved: true  },
  { id: "u17", name: "Quinn Reeves",     email: "quinn@arclabs.tech",     company: "ArcLabs",        signedUpAt: "2026-03-09", status: "active",    plan: "Growth",     accountManager: "Carlos Rivera",  stripeApproved: true,  adminApproved: true  },
  { id: "u18", name: "Rachel Storm",     email: "rachel@boldmove.io",     company: "BoldMove",       signedUpAt: "2026-03-10", status: "pending",   plan: "None",       accountManager: null,             stripeApproved: false, adminApproved: false },
];

// ─── Email Pool ───────────────────────────────────────────────────────────────

export const emailAccounts: EmailAccount[] = [
  { id: "e1",  email: "outreach1@nexus-send.io",   provider: "Google",  mailiveryId: "mlv_001", warmupStatus: "completed", warmupType: "Ramp Up",    warmupStarted: "2026-01-10", warmupEndsAt: "2026-01-24", assignedTo: "u1",  assignedWorkflow: "WF-Nexus-Q1",     healthScore: 94, dailySendLimit: 150, sentToday: 87,  createdAt: "2026-01-08" },
  { id: "e2",  email: "outreach2@nexus-send.io",   provider: "Google",  mailiveryId: "mlv_002", warmupStatus: "assigned",  warmupType: "1:1 Ratio",  warmupStarted: "2026-01-15", warmupEndsAt: "2026-01-29", assignedTo: "u2",  assignedWorkflow: "WF-Launch-Cold",  healthScore: 88, dailySendLimit: 120, sentToday: 103, createdAt: "2026-01-12" },
  { id: "e3",  email: "mailer1@brightwave.co",     provider: "Outlook", mailiveryId: "mlv_003", warmupStatus: "in_progress", warmupType: "Ramp Up",  warmupStarted: "2026-02-20", warmupEndsAt: "2026-03-06", assignedTo: null,  assignedWorkflow: null,              healthScore: 71, dailySendLimit: 100, sentToday: 45,  createdAt: "2026-02-18" },
  { id: "e4",  email: "mailer2@brightwave.co",     provider: "Outlook", mailiveryId: "mlv_004", warmupStatus: "in_progress", warmupType: "Ramp Up",  warmupStarted: "2026-02-25", warmupEndsAt: "2026-03-11", assignedTo: null,  assignedWorkflow: null,              healthScore: 63, dailySendLimit: 100, sentToday: 38,  createdAt: "2026-02-23" },
  { id: "e5",  email: "growth@fusionlabs.io",      provider: "Google",  mailiveryId: "mlv_005", warmupStatus: "completed", warmupType: "1:1 Ratio",  warmupStarted: "2026-01-20", warmupEndsAt: "2026-02-03", assignedTo: "u5",  assignedWorkflow: "WF-Fusion-EU",    healthScore: 97, dailySendLimit: 200, sentToday: 141, createdAt: "2026-01-18" },
  { id: "e6",  email: "reach@prismtech.co",        provider: "Google",  mailiveryId: "mlv_006", warmupStatus: "completed", warmupType: "Ramp Up",    warmupStarted: "2026-01-28", warmupEndsAt: "2026-02-11", assignedTo: "u10", assignedWorkflow: "WF-Prism-ABM",   healthScore: 91, dailySendLimit: 150, sentToday: 122, createdAt: "2026-01-25" },
  { id: "e7",  email: "contact@zenithai.send",     provider: "Outlook", mailiveryId: null,      warmupStatus: "not_started", warmupType: "None",     warmupStarted: null,         warmupEndsAt: null,         assignedTo: null,  assignedWorkflow: null,              healthScore: 50, dailySendLimit: 80,  sentToday: 0,   createdAt: "2026-03-01" },
  { id: "e8",  email: "outbound@velocity.io",      provider: "Google",  mailiveryId: null,      warmupStatus: "not_started", warmupType: "None",     warmupStarted: null,         warmupEndsAt: null,         assignedTo: null,  assignedWorkflow: null,              healthScore: 50, dailySendLimit: 80,  sentToday: 0,   createdAt: "2026-03-05" },
  { id: "e9",  email: "send@growthspark.mailer",   provider: "Google",  mailiveryId: "mlv_007", warmupStatus: "assigned",  warmupType: "1:1 Ratio",  warmupStarted: "2026-02-10", warmupEndsAt: "2026-02-24", assignedTo: "u13", assignedWorkflow: "WF-Growth-ENT",  healthScore: 85, dailySendLimit: 180, sentToday: 98,  createdAt: "2026-02-08" },
  { id: "e10", email: "campaigns@arclabs.send",    provider: "Outlook", mailiveryId: "mlv_008", warmupStatus: "in_progress", warmupType: "Ramp Up",  warmupStarted: "2026-03-03", warmupEndsAt: "2026-03-17", assignedTo: null,  assignedWorkflow: null,              healthScore: 58, dailySendLimit: 100, sentToday: 22,  createdAt: "2026-03-01" },
];

// ─── Credits ─────────────────────────────────────────────────────────────────

export const creditServices: CreditService[] = [
  {
    id: "cs1",
    name: "VAPI",
    icon: "🎙️",
    totalCredits: null,
    usedCredits: 18420,
    unit: "Tokens",
    displayMode: "used_only",
    alertThreshold: 80,
    usageBreakdown: [
      { label: "Voice Completions", used: 14200 },
      { label: "Real-time Calls", used: 3100 },
      { label: "Transcription", used: 1120 },
    ],
    lastRefreshed: "2026-03-10T08:00:00Z",
  },
  {
    id: "cs2",
    name: "OpenAI",
    icon: "🤖",
    totalCredits: null,
    usedCredits: 312,
    unit: "USD",
    displayMode: "used_only",
    alertThreshold: 80,
    usageBreakdown: [
      { label: "GPT-4o Completions", used: 198 },
      { label: "GPT-3.5 Completions", used: 74 },
      { label: "Embeddings", used: 28 },
      { label: "Image Generation", used: 12 },
    ],
    lastRefreshed: "2026-03-10T08:00:00Z",
  },
  {
    id: "cs3",
    name: "RocketReach",
    icon: "🚀",
    totalCredits: 10000,
    usedCredits: 7430,
    unit: "Lookups",
    displayMode: "used_of_total",
    alertThreshold: 80,
    usageBreakdown: [
      { label: "Email Lookups", used: 5200 },
      { label: "Phone Lookups", used: 1800 },
      { label: "Bulk Enrichment", used: 430 },
    ],
    lastRefreshed: "2026-03-10T08:00:00Z",
  },
  {
    id: "cs4",
    name: "ContactOut",
    icon: "📇",
    totalCredits: 5000,
    usedCredits: 3180,
    unit: "Credits",
    displayMode: "used_of_total",
    alertThreshold: 75,
    usageBreakdown: [
      { label: "Personal Emails", used: 2100 },
      { label: "Work Emails", used: 820 },
      { label: "Phone Numbers", used: 260 },
    ],
    lastRefreshed: "2026-03-10T08:00:00Z",
  },
  {
    id: "cs5",
    name: "GeoNode",
    icon: "🌐",
    totalCredits: 500,
    usedCredits: 312,
    unit: "GB",
    displayMode: "bandwidth",
    alertThreshold: 85,
    usageBreakdown: [
      { label: "Residential Proxies", used: 198 },
      { label: "Datacenter Proxies", used: 86 },
      { label: "Mobile Proxies", used: 28 },
    ],
    lastRefreshed: "2026-03-10T08:00:00Z",
  },
];

// ─── Discounts ────────────────────────────────────────────────────────────────

export const discounts: Discount[] = [
  { id: "d1", code: "LAUNCH30",  percent: 30, appliesTo: ["Starter", "Growth"],            startDate: "2026-02-01", endDate: "2026-02-28", active: false, createdAt: "2026-01-28" },
  { id: "d2", code: "SCALE20",   percent: 20, appliesTo: ["Scale", "Enterprise"],          startDate: "2026-03-01", endDate: "2026-03-31", active: true,  createdAt: "2026-02-25" },
  { id: "d3", code: "WELCOME15", percent: 15, appliesTo: ["Starter"],                      startDate: "2026-03-10", endDate: "2026-04-10", active: true,  createdAt: "2026-03-09" },
];

// ─── CRM ──────────────────────────────────────────────────────────────────────

export const crmConnections: CRMSync[] = [
  { id: "crm1", provider: "HubSpot",       lastSynced: "2026-03-08T14:00:00Z", recordsSynced: 4832, status: "connected"    },
  { id: "crm2", provider: "Salesforce",    lastSynced: null,                   recordsSynced: 0,    status: "disconnected" },
  { id: "crm3", provider: "Pipedrive",     lastSynced: "2026-03-07T09:00:00Z", recordsSynced: 1201, status: "connected"    },
  { id: "crm4", provider: "Zoho",          lastSynced: null,                   recordsSynced: 0,    status: "disconnected" },
  { id: "crm5", provider: "ActiveCampaign",lastSynced: "2026-03-09T11:30:00Z", recordsSynced: 2670, status: "connected"    },
];

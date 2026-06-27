export interface BrandingConfig {
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
}

export interface CompanyInfo {
  country: string;
  sector: string;
  agentCount: number;
}

export type PlanTier = "starter" | "growth" | "enterprise";

export interface ExtendedTenant {
  slug: string;
  name: string;
  email: string;
  color: string;
  branding: BrandingConfig;
  company: CompanyInfo;
  plan: PlanTier;
  trialEndsAt: string;
  createdAt: string;
}

const DEFAULT_BRANDING: BrandingConfig = {
  logoUrl: null,
  primaryColor: "#1E3A5F",
  secondaryColor: "#1D9E75",
};

const PLANS: Record<PlanTier, { price: number; claimsLimit: number; agentsLimit: number }> = {
  starter: { price: 0, claimsLimit: 100, agentsLimit: 2 },
  growth: { price: 299, claimsLimit: 1000, agentsLimit: 10 },
  enterprise: { price: 899, claimsLimit: -1, agentsLimit: -1 },
};

function trialEnds(days = 14): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function createDemoTenant(): ExtendedTenant {
  return {
    slug: "demo",
    name: "Demo Insurance",
    email: "admin@demo-insurance.com",
    color: "#1E3A5F",
    branding: { ...DEFAULT_BRANDING },
    company: { country: "US", sector: "multi", agentCount: 5 },
    plan: "growth",
    trialEndsAt: trialEnds(14),
    createdAt: new Date().toISOString(),
  };
}

function createAllianzTenant(): ExtendedTenant {
  return {
    slug: "allianz",
    name: "Allianz Africa",
    email: "admin@allianz.africa",
    color: "#1E3A5F",
    branding: { ...DEFAULT_BRANDING },
    company: { country: "CI", sector: "auto", agentCount: 25 },
    plan: "enterprise",
    trialEndsAt: trialEnds(14),
    createdAt: new Date().toISOString(),
  };
}

let _store: Record<string, ExtendedTenant> = {
  demo: createDemoTenant(),
  allianz: createAllianzTenant(),
};

export function getAllTenants(): ExtendedTenant[] {
  return Object.values(_store);
}

export function getTenant(slug: string): ExtendedTenant | null {
  return _store[slug] ?? null;
}

export function createTenant(slug: string, data: {
  name: string;
  email: string;
  color: string;
  company: CompanyInfo;
  plan: PlanTier;
}): ExtendedTenant {
  const tenant: ExtendedTenant = {
    slug,
    name: data.name,
    email: data.email,
    color: data.color,
    branding: { ...DEFAULT_BRANDING, primaryColor: data.color },
    company: data.company,
    plan: data.plan,
    trialEndsAt: trialEnds(14),
    createdAt: new Date().toISOString(),
  };
  _store[slug] = tenant;
  return tenant;
}

export function updateTenantBranding(slug: string, branding: Partial<BrandingConfig>): ExtendedTenant | null {
  const t = _store[slug];
  if (!t) return null;
  t.branding = { ...t.branding, ...branding };
  return t;
}

export function updateTenantInfo(slug: string, info: Partial<Pick<ExtendedTenant, "name" | "color"> & CompanyInfo>): ExtendedTenant | null {
  const t = _store[slug];
  if (!t) return null;
  if (info.name) t.name = info.name;
  if (info.color) { t.color = info.color; t.branding.primaryColor = info.color; }
  if (info.country) t.company.country = info.country;
  if (info.sector) t.company.sector = info.sector;
  if (info.agentCount !== undefined) t.company.agentCount = info.agentCount;
  return t;
}

export function getPlan(plan: PlanTier) {
  return PLANS[plan];
}

export interface OnboardingCompany {
  name: string; email: string; country: string; sector: string; agentCount: number;
}
export interface OnboardingBranding {
  primaryColor: string; secondaryColor: string; logoUrl: string | null;
}

export let _onboardingData: {
  company: OnboardingCompany;
  branding: OnboardingBranding;
  plan: PlanTier;
} | null = null;

export function saveOnboardingCompany(data: OnboardingCompany) {
  _onboardingData = { ...(_onboardingData ?? { branding: { primaryColor: "#1E3A5F", secondaryColor: "#1D9E75", logoUrl: null }, plan: "starter" as PlanTier }), company: data };
}

export function saveOnboardingBranding(data: OnboardingBranding) {
  _onboardingData = { ...(_onboardingData ?? { company: { name: "", email: "", country: "", sector: "", agentCount: 1 }, plan: "starter" as PlanTier }), branding: data };
}

export function saveOnboardingPlan(plan: PlanTier) {
  _onboardingData = { ...(_onboardingData ?? { company: { name: "", email: "", country: "", sector: "", agentCount: 1 }, branding: { primaryColor: "#1E3A5F", secondaryColor: "#1D9E75", logoUrl: null } }), plan };
}

export function getOnboardingData() {
  return _onboardingData;
}

export function completeOnboarding(): ExtendedTenant | null {
  if (!_onboardingData) return null;
  const { company, branding, plan } = _onboardingData as NonNullable<typeof _onboardingData>;
  const slug = company.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const tenant = createTenant(slug, {
    name: company.name,
    email: company.email,
    color: branding.primaryColor,
    company: { country: company.country, sector: company.sector, agentCount: company.agentCount },
    plan,
  });
  if (branding.logoUrl) {
    updateTenantBranding(slug, { logoUrl: branding.logoUrl, primaryColor: branding.primaryColor, secondaryColor: branding.secondaryColor });
  }
  _onboardingData = null;
  return tenant;
}

export function resetStore() {
  _store = {
    demo: createDemoTenant(),
    allianz: createAllianzTenant(),
  };
}

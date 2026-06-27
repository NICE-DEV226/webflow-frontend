/**
 * Multi-tenant — résolution par sous-domaine (vraie, pas factice).
 *   allianz.claimflow.com  → tenant "allianz"
 *   mutuelle.localhost:3000 → tenant "mutuelle"  (les *.localhost résolvent en local)
 *   localhost / domaine racine → tenant de démo par défaut
 *
 * En production, ce registre viendrait du backend (table `tenants` / XCore tenancy).
 * Ici on en garde quelques-uns pour démontrer l'isolation par espace.
 */
export interface Tenant {
  slug: string;
  name: string;
  /** Couleur d'accent du tenant (white-label) — non appliquée globalement ici, dispo pour l'UI. */
  color: string;
  /** URL du logo (optionnel — après onboarding). */
  logoUrl?: string | null;
  /** Surnom de marque (ex: "Demo Insurance" → affiché dans les portails). */
  brandName?: string;
}

export const TENANTS: Record<string, Tenant> = {
  demo: { slug: "demo", name: "Demo Insurance", color: "#1E3A5F" },
  allianz: { slug: "allianz", name: "Allianz Africa", color: "#1E3A5F" },
  mutuelle: { slug: "mutuelle", name: "Mutuelle Santé+", color: "#0E7490" },
  axa: { slug: "axa", name: "AXA Partners", color: "#1D4ED8" },
};

export const DEFAULT_TENANT = TENANTS.demo;

/** Extrait le tenant depuis le host (premier label de sous-domaine). */
export function getTenantFromHost(host?: string | null): Tenant {
  if (!host) return DEFAULT_TENANT;
  const hostname = host.split(":")[0];
  const label = hostname.split(".")[0];
  // sur "localhost" seul ou IP → pas de sous-domaine → défaut
  if (label === "localhost" || label === hostname) {
    return TENANTS[label] ?? DEFAULT_TENANT;
  }
  return TENANTS[label] ?? DEFAULT_TENANT;
}

import {
  Bell,
  ClipboardCheck,
  CreditCard,
  FilePlus,
  FileText,
  Files,
  Inbox,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type Role = "claimant" | "agent" | "admin";

export interface NavItem {
  /** Clé i18n sous `nav.<role>.<key>`. */
  key: string;
  href: string;
  icon: LucideIcon;
}

/**
 * Navigation par rôle (brand doc §10.3 + sitemap §2).
 * Les libellés viennent de l'i18n (namespace `nav.<role>`), jamais en dur.
 */
export const NAV: Record<Role, NavItem[]> = {
  claimant: [
    { key: "claims", href: "/dashboard/claims", icon: FileText },
    { key: "newClaim", href: "/dashboard/claims/new", icon: FilePlus },
    { key: "notifications", href: "/dashboard/notifications", icon: Bell },
  ],
  agent: [
    { key: "queue", href: "/agent/queue", icon: Inbox },
    { key: "evaluations", href: "/agent/evaluations", icon: ClipboardCheck },
    { key: "notifications", href: "/agent/notifications", icon: Bell },
  ],
  admin: [
    { key: "dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { key: "claims", href: "/admin/claims", icon: Files },
    { key: "workflow", href: "/admin/workflow", icon: Workflow },
    { key: "agents", href: "/admin/agents", icon: Users },
    { key: "audit", href: "/admin/audit", icon: Shield },
    { key: "settings", href: "/admin/settings", icon: Settings },
    { key: "license", href: "/admin/license", icon: CreditCard },
  ],
};

/** Page d'accueil de chaque rôle (pour la redirection post-login). */
export const ROLE_HOME: Record<Role, string> = {
  claimant: "/dashboard/claims",
  agent: "/agent/queue",
  admin: "/admin/dashboard",
};

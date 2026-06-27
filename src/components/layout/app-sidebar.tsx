"use client";

import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { useTenant } from "@/components/tenant-provider";
import { NAV, type Role } from "@/lib/nav";
import { cn } from "@/lib/utils";

export interface SidebarUser {
  name: string;
  email: string;
}

export function AppSidebar({
  role,
  user,
  onNavigate,
}: {
  role: Role;
  user: SidebarUser;
  /** Appelé au clic sur un lien (utile pour fermer le drawer mobile). */
  onNavigate?: () => void;
}) {
  const t = useTranslations(`nav.${role}`);
  const tRoles = useTranslations("roles");
  const pathname = usePathname();
  const tenant = useTenant();

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Un seul item actif : le préfixe le plus long qui matche (évite que "Mes sinistres"
  // et "Nouveau sinistre" soient actifs en même temps sur /dashboard/claims/new).
  const activeHref = NAV[role]
    .map((i) => i.href)
    .filter((h) => pathname === h || pathname.startsWith(`${h}/`))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-4">
        <Link href="/" onClick={onNavigate}>
          <Logo variant="negative" />
        </Link>
        {/* Espace tenant — preuve qu'on est dans l'environnement isolé d'une compagnie */}
        <div className="mt-3 flex items-center gap-2 rounded-md bg-sidebar-accent/50 px-2.5 py-1.5">
          <span className="flex size-5 shrink-0 items-center justify-center rounded bg-sidebar-primary text-[10px] font-bold text-white">
            {tenant.name.charAt(0)}
          </span>
          <span className="truncate text-xs font-medium text-white">
            {tenant.name}
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV[role].map((item) => {
          const active = item.href === activeHref;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex h-12 items-center gap-3 rounded-md border-l-[3px] border-transparent px-3 text-sm font-medium transition-colors",
                active
                  ? "border-sidebar-primary bg-sidebar-primary/20 text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-semibold text-white">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              {tRoles(role)}
            </p>
          </div>
          <Link
            href="/login"
            aria-label="Logout"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-white"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

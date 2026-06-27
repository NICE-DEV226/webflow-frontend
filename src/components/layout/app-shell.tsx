"use client";

import { useState } from "react";
import { Bell, Menu } from "lucide-react";

import { AppSidebar, type SidebarUser } from "@/components/layout/app-sidebar";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Role } from "@/lib/nav";

const NOTIF_HREF: Record<Role, string> = {
  claimant: "/dashboard/notifications",
  agent: "/agent/notifications",
  admin: "/admin/dashboard",
};

export function AppShell({
  role,
  user,
  title,
  actions,
  unread = 0,
  children,
}: {
  role: Role;
  user: SidebarUser;
  title: string;
  actions?: React.ReactNode;
  unread?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:pl-60">
      {/* Sidebar fixe (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 lg:block">
        <AppSidebar role={role} user={user} />
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex min-h-16 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b bg-background/85 px-4 py-2.5 backdrop-blur-md md:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Menu"
                  >
                    <Menu />
                  </Button>
                }
              />
              <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <AppSidebar
                  role={role}
                  user={user}
                  onNavigate={() => setOpen(false)}
                />
              </SheetContent>
            </Sheet>
            <h1 className="truncate text-lg font-semibold text-primary">
              {title}
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {actions}
            <Link
              href={NOTIF_HREF[role]}
              aria-label="Notifications"
              className="relative flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Bell className="size-5" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </header>

        <main className="mx-auto w-full min-w-0 max-w-[1280px] flex-1 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

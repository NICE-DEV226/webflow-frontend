"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Copy, Link2, Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTenant } from "@/components/tenant-provider";
import {
  getPublicLinks,
  createPublicLink,
  togglePublicLink,
  deletePublicLink,
  type PublicFormLink,
} from "@/lib/mock-public-links";
import { cn } from "@/lib/utils";

export function PublicLinksTab() {
  const t = useTranslations("adminPages.settings");
  const tenant = useTenant();
  const [links, setLinks] = useState<PublicFormLink[]>(() => getPublicLinks(tenant.slug));
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");

  function handleCreate() {
    if (!newTitle.trim() || !newSlug.trim()) {
      toast.error(t("publicLinks.errors.required"));
      return;
    }
    const existing = links.find((l) => l.slug === newSlug.trim());
    if (existing) {
      toast.error(t("publicLinks.errors.duplicate"));
      return;
    }
    const link = createPublicLink({
      slug: newSlug.trim(),
      tenantSlug: tenant.slug,
      title: newTitle.trim(),
    });
    setLinks((prev) => [...prev, link]);
    setNewTitle("");
    setNewSlug("");
    setShowNew(false);
    toast.success(t("publicLinks.created"));
  }

  function handleToggle(id: string) {
    const updated = togglePublicLink(id);
    if (updated) {
      setLinks((prev) => prev.map((l) => (l.id === id ? updated : l)));
    }
  }

  function handleDelete(id: string) {
    deletePublicLink(id);
    setLinks((prev) => prev.filter((l) => l.id !== id));
    toast.success(t("publicLinks.deleted"));
  }

  function copyUrl(slug: string) {
    const url = `${window.location.origin}/f/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success(t("publicLinks.copied"));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t("publicLinks.description")}</p>
        </div>
        <Button variant="success" onClick={() => setShowNew(true)}>
          <Plus className="size-4" />
          {t("publicLinks.new")}
        </Button>
      </div>

      {/* New link form */}
      {showNew && (
        <Card size="sm">
          <CardHeader>
            <CardTitle>{t("publicLinks.createTitle")}</CardTitle>
            <CardDescription>{t("publicLinks.createDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="linkTitle">{t("publicLinks.formTitle")}</Label>
                <Input
                  id="linkTitle"
                  placeholder="Ex: Déclaration sinistre auto"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="linkSlug">{t("publicLinks.formSlug")}</Label>
                <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <span>/f/</span>
                  <Input
                    id="linkSlug"
                    placeholder="sinistre-auto"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.replace(/\s+/g, "-"))}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="success" onClick={handleCreate}>
                {t("publicLinks.create")}
              </Button>
              <Button variant="outline" onClick={() => setShowNew(false)}>
                {t("publicLinks.cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Links list */}
      {links.length === 0 && !showNew && (
        <div className="flex flex-col items-center gap-2 rounded-xl border py-12 text-center">
          <Link2 className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">{t("publicLinks.empty")}</p>
        </div>
      )}

      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className={cn(
              "flex items-center justify-between rounded-lg border px-4 py-3 transition-colors",
              !link.active && "opacity-50",
            )}
          >
            <div>
              <p className="text-sm font-medium text-primary">{link.title}</p>
              <p className="font-mono text-xs text-muted-foreground">
                /f/{link.slug}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => copyUrl(link.slug)}
                title={t("publicLinks.copy")}
              >
                <Copy className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleToggle(link.id)}
                title={link.active ? t("publicLinks.deactivate") : t("publicLinks.activate")}
              >
                {link.active ? (
                  <ToggleRight className="size-3.5 text-emerald" />
                ) : (
                  <ToggleLeft className="size-3.5 text-muted-foreground" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleDelete(link.id)}
                title={t("publicLinks.delete")}
              >
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

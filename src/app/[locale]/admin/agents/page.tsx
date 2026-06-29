"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Loader2, Mail, Plus, X, UserMinus, Clock,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppShell } from "@/components/layout/app-shell";
import {
  getTenantMembers,
  inviteMember,
  cancelInvite,
  removeMember,
  getTenantInvites,
  getTenantRoles,
  getAllRoles,
  setMemberRole,
  type MemberResponse,
  type InviteResponse,
  type RoleResponse,
} from "@/lib/api/agents";
import { useAuth } from "@/components/auth-provider";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

type Tab = "members" | "invites";

export default function AdminAgentsPage() {
  const t = useTranslations("adminPages.agents");
  const { user, tenantId } = useAuth();

  const [tab, setTab] = useState<Tab>("members");
  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [invites, setInvites] = useState<InviteResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite modal
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [inviting, setInviting] = useState(false);

  // Remove confirmation
  const [removing, setRemoving] = useState<string | null>(null);

  // Role change
  const [changingRole, setChangingRole] = useState<string | null>(null);

  function fetchAll() {
    if (!tenantId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      getTenantMembers(tenantId).then(setMembers).catch(() => {}),
      getTenantInvites(tenantId).then(setInvites).catch(() => {}),
      getTenantRoles(tenantId).then((r) => setRoles(r)).catch(() => {}),
      getAllRoles().then((global) => {
        setRoles((prev) => {
          const ids = new Set(prev.map((r) => r.id));
          const merged = [...prev, ...global.filter((r) => !ids.has(r.id))];
          return merged;
        });
      }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }

  useEffect(() => { fetchAll() }, [tenantId]);

  async function handleInvite() {
    if (!inviteEmail.trim()) return;
    if (!tenantId) {
      toast.error("Session non disponible");
      return;
    }
    setInviting(true);
    try {
      await inviteMember({
        tenant_id: tenantId,
        email: inviteEmail.trim(),
        role_id: inviteRole || undefined,
      });
      toast.success(t("inviteSuccess"));
      setShowInvite(false);
      setInviteEmail("");
      setInviteRole("");
      fetchAll();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : t("inviteError"));
    } finally {
      setInviting(false);
    }
  }

  async function handleCancelInvite(inviteId: string) {
    try {
      await cancelInvite(inviteId);
      toast.success(t("cancelSuccess") || "Invitation annulée");
      fetchAll();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : t("cancelError") || "Erreur");
    }
  }

  async function handleRemoveMember(userId: string) {
    if (!tenantId) return;
    try {
      await removeMember(tenantId, userId);
      toast.success(t("removeSuccess") || "Membre retiré");
      setRemoving(null);
      fetchAll();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : t("removeError") || "Erreur");
    }
  }

  async function handleRoleChange(userId: string, roleId: string) {
    if (!tenantId) return;
    try {
      await setMemberRole(tenantId, userId, { role_id: roleId });
      toast.success(t("roleSuccess") || "Rôle mis à jour");
      setChangingRole(null);
      fetchAll();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : t("roleError") || "Erreur");
    }
  }

  const sidebarUser = user
    ? { name: user.email, email: user.email }
    : { name: "", email: "" };

  const pendingInvites = invites.filter((i) => i.is_active && !i.used_at);

  return (
    <AppShell
      role="admin"
      user={sidebarUser}
      title={t("title")}
      actions={
        <Button size="sm" onClick={() => setShowInvite(true)}>
          <Plus />
          {t("invite")}
        </Button>
      }
    >
      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">{t("inviteTitle")}</h2>
              <button type="button" onClick={() => setShowInvite(false)}>
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t("inviteBody")}</p>
            <div className="mt-4 space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="inviteEmail">{t("emailLabel")}</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="agent@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inviteRole">{t("roleLabel") || "Rôle"}</Label>
                <select
                  id="inviteRole"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">{t("defaultRole") || "Rôle par défaut"}</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInvite(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}>
                {inviting && <Loader2 className="mr-1.5 size-4 animate-spin" />}
                {t("sendInvite")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-4 flex items-center gap-1 rounded-lg bg-muted p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab("members")}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
            tab === "members" ? "bg-background text-primary shadow-sm" : "text-muted-foreground",
          )}
        >
          {t("membersTab") || "Membres"} ({members.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("invites")}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
            tab === "invites" ? "bg-background text-primary shadow-sm" : "text-muted-foreground",
          )}
        >
          {t("invitesTab") || "Invitations"}
          {pendingInvites.length > 0 && (
            <span className="ml-1.5 rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white">
              {pendingInvites.length}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-emerald" />
        </div>
      ) : tab === "members" ? (
        <MembersTable
          members={members}
          roles={roles}
          t={t}
          removing={removing}
          changingRole={changingRole}
          onRemove={(uid) => setRemoving(uid)}
          onCancelRemove={() => setRemoving(null)}
          onConfirmRemove={handleRemoveMember}
          onChangeRole={(uid) => setChangingRole(uid)}
          onCancelRole={() => setChangingRole(null)}
          onConfirmRole={handleRoleChange}
        />
      ) : (
        <InvitesTable
          invites={invites}
          t={t}
          onCancel={handleCancelInvite}
        />
      )}
    </AppShell>
  );
}

// ── Members table ──

function MembersTable({
  members, roles, t, removing, changingRole,
  onRemove, onCancelRemove, onConfirmRemove,
  onChangeRole, onCancelRole, onConfirmRole,
}: {
  members: MemberResponse[];
  roles: RoleResponse[];
  t: ReturnType<typeof useTranslations>;
  removing: string | null;
  changingRole: string | null;
  onRemove: (uid: string) => void;
  onCancelRemove: () => void;
  onConfirmRemove: (uid: string) => void;
  onChangeRole: (uid: string) => void;
  onCancelRole: () => void;
  onConfirmRole: (uid: string, roleId: string) => void;
}) {
  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border bg-card py-20 text-center shadow-sm">
        <Mail className="mb-3 size-10 text-muted-foreground/60" />
        <p className="text-lg font-semibold text-primary">{t("emptyTitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("emptyBody")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <th className="px-5 py-3 text-left">{t("name")}</th>
              <th className="px-5 py-3 text-left">{t("email")}</th>
              <th className="px-5 py-3 text-left">{t("status")}</th>
              <th className="px-5 py-3 text-left">{t("role")}</th>
              <th className="px-5 py-3 text-right">{t("actions") || "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const initials = (m.email ?? "?").charAt(0).toUpperCase();
              const memberRoles = roles.filter((r) => r.id === m.role_id);
              const roleName = memberRoles.length > 0
                ? memberRoles[0].name
                : m.is_owner
                  ? t("owner")
                  : t("agent");
              return (
                <tr key={m.id} className="border-b last:border-0 hover:bg-accent/40">
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-2.5">
                      <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {initials}
                      </span>
                      <span className="font-medium text-foreground">{m.email ?? "—"}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                    {m.email ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-2 py-0.5 text-[11px] font-medium text-emerald">
                      <span className="size-1.5 rounded-full bg-emerald" />
                      {t("active")}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {changingRole === m.user_id ? (
                      <RoleSelector
                        roles={roles}
                        currentRoleId={m.role_id}
                        onConfirm={(roleId) => onConfirmRole(m.user_id, roleId)}
                        onCancel={onCancelRole}
                      />
                    ) : (
                      <span className="font-medium text-foreground">{roleName}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onChangeRole(m.user_id)}
                        className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                        title={t("changeRole") || "Changer le rôle"}
                      >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </button>
                      {!m.is_owner && (
                        removing === m.user_id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onConfirmRemove(m.user_id)}
                              className="rounded px-2 py-1 text-[11px] font-medium text-destructive hover:bg-destructive/10"
                            >
                              {t("confirmRemove") || "Retirer"}
                            </button>
                            <button
                              type="button"
                              onClick={onCancelRemove}
                              className="rounded px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-accent"
                            >
                              {t("cancel")}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onRemove(m.user_id)}
                            className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            title={t("remove") || "Retirer"}
                          >
                            <UserMinus className="size-4" />
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Invites table ──

function InvitesTable({
  invites, t, onCancel,
}: {
  invites: InviteResponse[];
  t: ReturnType<typeof useTranslations>;
  onCancel: (id: string) => void;
}) {
  const active = invites.filter((i) => i.is_active && !i.used_at);
  const used = invites.filter((i) => i.used_at);

  if (active.length === 0 && used.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border bg-card py-20 text-center shadow-sm">
        <Mail className="mb-3 size-10 text-muted-foreground/60" />
        <p className="text-lg font-semibold text-primary">{t("noInvites") || "Aucune invitation"}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("inviteBody")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {active.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t("pendingInvites") || "Invitations en attente"} ({active.length})
          </h3>
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <th className="px-5 py-3 text-left">{t("email")}</th>
                  <th className="px-5 py-3 text-left">{t("status")}</th>
                  <th className="px-5 py-3 text-right">{t("actions") || "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {active.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3 font-mono text-sm text-foreground">{inv.email}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/10 px-2 py-0.5 text-[11px] font-medium text-amber">
                        <Clock className="size-3" />
                        {t("pending") || "En attente"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onCancel(inv.id)}
                        className="rounded px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                      >
                        {t("cancelInvite") || "Annuler"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {used.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t("acceptedInvites") || "Invitations acceptées"} ({used.length})
          </h3>
          <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  <th className="px-5 py-3 text-left">{t("email")}</th>
                  <th className="px-5 py-3 text-left">{t("status")}</th>
                </tr>
              </thead>
              <tbody>
                {used.map((inv) => (
                  <tr key={inv.id} className="border-b last:border-0 hover:bg-accent/40">
                    <td className="px-5 py-3 font-mono text-sm text-foreground">{inv.email}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 px-2 py-0.5 text-[11px] font-medium text-emerald">
                        <span className="size-1.5 rounded-full bg-emerald" />
                        {t("accepted") || "Acceptée"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Role selector ──

function RoleSelector({
  roles, currentRoleId, onConfirm, onCancel,
}: {
  roles: RoleResponse[];
  currentRoleId: string | null;
  onConfirm: (roleId: string) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState(currentRoleId ?? "");

  return (
    <div className="flex items-center gap-1">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="h-8 rounded border bg-background px-2 text-xs"
      >
        <option value="">{roles.length === 0 ? "Aucun rôle" : "Sélectionner..."}</option>
        {roles.map((r) => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => selected && onConfirm(selected)}
        disabled={!selected}
        className="rounded px-2 py-1 text-[11px] font-medium text-emerald hover:bg-emerald/10 disabled:opacity-50"
      >
        OK
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-accent"
      >
        X
      </button>
    </div>
  );
}

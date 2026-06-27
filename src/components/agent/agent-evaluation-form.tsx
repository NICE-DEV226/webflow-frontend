"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { CheckCircle, MinusCircle, XCircle } from "lucide-react";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Decision = "approve" | "partial" | "reject";

export function AgentEvaluationForm({
  claimedAmount,
  currency,
}: {
  claimedAmount: number;
  currency: string;
}) {
  const t = useTranslations("agent.evaluation");
  const locale = useLocale();
  const router = useRouter();

  const [decision, setDecision] = useState<Decision>("approve");
  const [amount, setAmount] = useState(String(claimedAmount));
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const money = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);

  const options: {
    key: Decision;
    label: string;
    icon: typeof CheckCircle;
    variant: "success" | "warning" | "danger";
  }[] = [
    { key: "approve", label: t("approve"), icon: CheckCircle, variant: "success" },
    { key: "partial", label: t("partial"), icon: MinusCircle, variant: "warning" },
    { key: "reject", label: t("reject"), icon: XCircle, variant: "danger" },
  ];

  async function submit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    const label =
      decision === "reject"
        ? t("reject")
        : `${t("approve")} ${money(Number(amount) || 0)}`;
    toast.success(`${t("submitted")} · ${label}`);
    router.push("/agent/queue");
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">{t("title")}</h2>

      {/* Decision segmented control */}
      <div className="mt-4">
        <Label className="mb-1.5 block">{t("decision")}</Label>
        <div className="grid grid-cols-3 gap-2">
          {options.map((o) => {
            const Icon = o.icon;
            const active = decision === o.key;
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => setDecision(o.key)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg border-2 px-2 py-3 text-xs font-medium transition-colors",
                  active
                    ? o.variant === "success"
                      ? "border-emerald bg-emerald/10 text-emerald"
                      : o.variant === "warning"
                        ? "border-warning bg-warning/10 text-warning"
                        : "border-destructive bg-destructive/10 text-destructive"
                    : "border-border text-muted-foreground hover:border-input",
                )}
              >
                <Icon className="size-5" />
                {o.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Approved amount (hidden for reject) */}
      {decision !== "reject" && (
        <div className="mt-4 space-y-1.5">
          <Label htmlFor="amount">{t("amountApproved")}</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      )}

      {/* Reason */}
      <div className="mt-4 space-y-1.5">
        <Label htmlFor="reason">{t("reason")}</Label>
        <Textarea
          id="reason"
          rows={3}
          placeholder={t("reasonPlaceholder")}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      {/* Internal notes */}
      <div className="mt-4 space-y-1.5">
        <Label htmlFor="notes">{t("notes")}</Label>
        <Textarea
          id="notes"
          rows={2}
          placeholder={t("notesPlaceholder")}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button
        className="mt-5 w-full"
        size="lg"
        variant={
          decision === "approve"
            ? "success"
            : decision === "partial"
              ? "warning"
              : "danger"
        }
        disabled={submitting || reason.trim().length === 0}
        onClick={submit}
      >
        {t("submit")}
      </Button>
    </div>
  );
}

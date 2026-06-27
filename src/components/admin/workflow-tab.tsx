"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Save, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WorkflowTab() {
  const t = useTranslations("adminPages.settings");
  const [threshold, setThreshold] = useState("5000");
  const [routing, setRouting] = useState("round-robin");
  const [autoRejectDays, setAutoRejectDays] = useState("7");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    toast.success(t("workflow.saved"));
    setSaving(false);
  }

  function handleReset() {
    setThreshold("5000");
    setRouting("round-robin");
    setAutoRejectDays("7");
  }

  return (
    <div className="space-y-8">
      {/* Auto-approval threshold */}
      <div className="max-w-md space-y-1.5">
        <Label htmlFor="threshold">{t("autoApprove")}</Label>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">$</span>
          <Input
            id="threshold"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">{t("autoApproveHelp")}</p>
      </div>

      {/* Routing strategy */}
      <div className="max-w-md space-y-1.5">
        <Label>{t("workflow.routing")}</Label>
        <Select value={routing} onValueChange={(v) => v && setRouting(v)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="round-robin">{t("workflow.roundRobin")}</SelectItem>
            <SelectItem value="load-balanced">{t("workflow.loadBalanced")}</SelectItem>
            <SelectItem value="manual">{t("workflow.manual")}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">{t("workflow.routingHelp")}</p>
      </div>

      {/* Auto-reject after */}
      <div className="max-w-md space-y-1.5">
        <Label htmlFor="autoReject">{t("workflow.autoReject")}</Label>
        <div className="mt-1.5 flex items-center gap-2">
          <Input
            id="autoReject"
            type="number"
            min={1}
            value={autoRejectDays}
            onChange={(e) => setAutoRejectDays(e.target.value)}
            className="max-w-20"
          />
          <span className="text-sm text-muted-foreground">{t("workflow.days")}</span>
        </div>
        <p className="text-xs text-muted-foreground">{t("workflow.autoRejectHelp")}</p>
      </div>

      <div className="flex items-center gap-3 border-t pt-6">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="size-4" />
          {t("workflow.save")}
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          <RotateCcw className="size-4" />
          {t("workflow.reset")}
        </Button>
      </div>
    </div>
  );
}

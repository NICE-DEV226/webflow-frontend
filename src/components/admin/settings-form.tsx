"use client";

import { useTranslations } from "next-intl";
import { Palette, Link2, Workflow } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandingTab } from "@/components/admin/branding-tab";
import { PublicLinksTab } from "@/components/admin/public-links-tab";
import { WorkflowTab } from "@/components/admin/workflow-tab";

export function SettingsForm() {
  const t = useTranslations("adminPages.settings");

  return (
    <Tabs defaultValue="branding">
      <TabsList variant="line">
        <TabsTrigger value="branding">
          <Palette className="size-4" />
          {t("tabs.branding")}
        </TabsTrigger>
        <TabsTrigger value="public-links">
          <Link2 className="size-4" />
          {t("tabs.publicLinks")}
        </TabsTrigger>
        <TabsTrigger value="workflow">
          <Workflow className="size-4" />
          {t("tabs.workflow")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="branding" className="mt-6">
        <BrandingTab />
      </TabsContent>

      <TabsContent value="public-links" className="mt-6">
        <PublicLinksTab />
      </TabsContent>

      <TabsContent value="workflow" className="mt-6">
        <WorkflowTab />
      </TabsContent>
    </Tabs>
  );
}

"use client";

import { useMemo, useRef, useState } from "react";
import {
  Controller,
  useForm,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CheckCircle2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { buildFormSchema } from "@/lib/xform/schema";
import { isDataField, isFieldVisible } from "@/lib/xform/logic";
import type { FormData, FormDefinition, FormField } from "@/lib/xform/types";

const WIDTH_CLASS: Record<FormField["width"], string> = {
  full: "col-span-6",
  half: "col-span-6 sm:col-span-3",
  third: "col-span-6 sm:col-span-2",
};

const NATIVE_INPUT =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

const HTML_INPUT_TYPE: Partial<Record<FormField["type"], string>> = {
  text: "text",
  email: "email",
  number: "number",
  date: "date",
  phone: "tel",
  url: "url",
};

function defaultValuesFor(fields: FormField[]): FormData {
  const out: FormData = {};
  for (const f of fields) {
    if (!isDataField(f)) continue;
    if (f.type === "checkbox") out[f.name] = (f.default_value as string[]) ?? [];
    else out[f.name] = (f.default_value as string) ?? "";
  }
  return out;
}

export interface XFormRendererProps {
  form: FormDefinition;
  /** Si fourni, reçoit les données (et la durée). Sinon, toast de succès local. */
  onSubmit?: (data: FormData, meta: { duration_sec: number }) => Promise<void> | void;
  className?: string;
}

/**
 * Renderer XForm — consomme une FormDefinition (data-driven) et la rend en shadcn.
 * Gère : tous les types de champs, validation zod i18n, logique conditionnelle (showIf),
 * largeurs (full/half/third), sections/dividers, et l'état de succès.
 * Le multi-step (settings.multi_step / steps) sera ajouté en couche au-dessus.
 */
export function XFormRenderer({ form, onSubmit, className }: XFormRendererProps) {
  const te = useTranslations("xform.errors");
  const tx = useTranslations("xform");

  const schema = useMemo(() => buildFormSchema(form.fields, te), [form.fields, te]);
  const defaults = useMemo(() => defaultValuesFor(form.fields), [form.fields]);

  // Resolver custom : évite le couplage de versions zod ↔ @hookform/resolvers.
  const resolver = useMemo<Resolver<FormData>>(
    () => async (vals) => {
      const res = schema.safeParse(vals);
      if (res.success) return { values: res.data, errors: {} };
      const errs: Record<string, { type: string; message: string }> = {};
      for (const issue of res.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !errs[key]) {
          errs[key] = { type: "validation", message: issue.message };
        }
      }
      return { values: {}, errors: errs as FieldErrors<FormData> };
    },
    [schema],
  );

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver,
    defaultValues: defaults,
    mode: "onBlur",
  });

  const values = watch();
  const [done, setDone] = useState(false);
  const startRef = useRef(Date.now());

  const submit = handleSubmit(async (data) => {
    const meta = {
      duration_sec: Math.round((Date.now() - startRef.current) / 1000),
    };
    if (onSubmit) await onSubmit(data, meta);
    else toast.success(tx("success"));
    setDone(true);
  });

  if (done) {
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-3 rounded-xl border bg-card p-10 text-center",
          className,
        )}
      >
        <CheckCircle2 className="size-12 text-emerald" />
        <p className="text-base font-medium text-foreground">
          {form.settings.confirmation_message || tx("success")}
        </p>
      </div>
    );
  }

  const sorted = [...form.fields].sort((a, b) => a.order - b.order);

  return (
    <form onSubmit={submit} className={cn("grid grid-cols-6 gap-4", className)} noValidate>
      {form.description && (
        <p className="col-span-6 -mt-1 text-sm text-muted-foreground">
          {form.description}
        </p>
      )}

      {sorted.map((field) => {
        if (field.type === "section") {
          return (
            <h3
              key={field.id}
              className="col-span-6 mt-2 border-b pb-2 text-base font-semibold"
            >
              {field.label}
            </h3>
          );
        }
        if (field.type === "divider") {
          return <hr key={field.id} className="col-span-6 border-border" />;
        }
        if (field.type === "hidden") return null;
        if (!isFieldVisible(field, values)) return null;

        const error = errors[field.name]?.message as string | undefined;
        const fieldId = `xf_${field.name}`;
        const required = field.validation?.required;

        return (
          <div key={field.id} className={cn(WIDTH_CLASS[field.width], "space-y-1.5")}>
            <Label htmlFor={fieldId} className="flex items-center gap-1">
              {field.label}
              {required ? (
                <span className="text-destructive">*</span>
              ) : (
                <span className="text-xs font-normal text-muted-foreground">
                  ({tx("optional")})
                </span>
              )}
            </Label>

            {renderControl(field, fieldId)}

            {field.help_text && !error && (
              <p className="text-xs text-muted-foreground">{field.help_text}</p>
            )}
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
          </div>
        );
      })}

      <div className="col-span-6 mt-2">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          style={
            form.theme?.primary_color
              ? { backgroundColor: form.theme.primary_color, color: "#fff" }
              : undefined
          }
        >
          {isSubmitting ? tx("sending") : tx("submit")}
        </Button>
      </div>
    </form>
  );

  function renderControl(field: FormField, fieldId: string) {
    const aria = errors[field.name] ? { "aria-invalid": true } : {};

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={fieldId}
            placeholder={field.placeholder ?? undefined}
            rows={4}
            {...aria}
            {...register(field.name)}
          />
        );

      case "select":
        return (
          <select id={fieldId} className={NATIVE_INPUT} {...aria} {...register(field.name)}>
            <option value="">{field.placeholder ?? tx("selectPlaceholder")}</option>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: f }) => (
              <RadioGroup
                value={(f.value as string) ?? ""}
                onValueChange={f.onChange}
                className="flex flex-col gap-2 pt-1"
              >
                {field.options.map((o) => (
                  <Label
                    key={o.value}
                    className="flex items-center gap-2 font-normal"
                  >
                    <RadioGroupItem value={o.value} />
                    {o.label}
                  </Label>
                ))}
              </RadioGroup>
            )}
          />
        );

      case "checkbox":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: f }) => {
              const arr = Array.isArray(f.value) ? (f.value as string[]) : [];
              return (
                <div className="flex flex-col gap-2 pt-1">
                  {field.options.map((o) => (
                    <Label
                      key={o.value}
                      className="flex items-center gap-2 font-normal"
                    >
                      <Checkbox
                        checked={arr.includes(o.value)}
                        onCheckedChange={(c) =>
                          f.onChange(
                            c
                              ? [...arr, o.value]
                              : arr.filter((v) => v !== o.value),
                          )
                        }
                      />
                      {o.label}
                    </Label>
                  ))}
                </div>
              );
            }}
          />
        );

      case "file":
        return (
          <Controller
            control={control}
            name={field.name}
            render={({ field: f }) => {
              const file = f.value as File | undefined;
              return (
                <label
                  htmlFor={fieldId}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-input px-3 py-3 text-sm text-muted-foreground transition-colors hover:border-ring hover:bg-accent"
                >
                  <UploadCloud className="size-5 shrink-0" />
                  <span className="truncate">
                    {file ? file.name : tx("fileDrop")}
                  </span>
                  <input
                    id={fieldId}
                    type="file"
                    accept={field.accept ?? undefined}
                    className="hidden"
                    onChange={(e) => f.onChange(e.target.files?.[0] ?? null)}
                  />
                </label>
              );
            }}
          />
        );

      default:
        return (
          <Input
            id={fieldId}
            type={HTML_INPUT_TYPE[field.type] ?? "text"}
            placeholder={field.placeholder ?? undefined}
            {...aria}
            {...register(field.name)}
          />
        );
    }
  }
}

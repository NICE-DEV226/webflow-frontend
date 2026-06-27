import { z } from "zod";

import { isDataField, isFieldVisible } from "./logic";
import type { FormData, FormField, FormValue } from "./types";

type Translator = (
  key: string,
  params?: Record<string, string | number>,
) => string;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Construit un schéma zod dynamique à partir des champs XForm.
 *
 * La validation est faite dans un superRefine afin de respecter la LOGIQUE
 * CONDITIONNELLE : un champ masqué (showIf non satisfait) n'est jamais validé,
 * même s'il est marqué requis. Les messages sont localisés (i18n) et un
 * `custom_msg` défini par l'auteur du formulaire a priorité.
 */
export function buildFormSchema(fields: FormField[], te: Translator) {
  return z.record(z.string(), z.custom<FormValue>()).superRefine((raw, ctx) => {
    const data = raw as FormData;

    for (const field of fields) {
      if (!isDataField(field)) continue;
      if (!isFieldVisible(field, data)) continue;

      const v = data[field.name];
      const val = field.validation ?? {};
      const add = (message: string) =>
        ctx.addIssue({ code: "custom", message, path: [field.name] });

      const empty =
        v === undefined ||
        v === null ||
        v === "" ||
        (Array.isArray(v) && v.length === 0);

      if (val.required && empty) {
        add(val.custom_msg || te("required"));
        continue;
      }
      if (empty) continue;

      if (field.type === "email" && typeof v === "string" && !EMAIL_RE.test(v)) {
        add(te("email"));
      }

      if (typeof v === "string") {
        if (val.min_length != null && v.length < val.min_length) {
          add(te("minLength", { min: val.min_length }));
        }
        if (val.max_length != null && v.length > val.max_length) {
          add(te("maxLength", { max: val.max_length }));
        }
        if (val.pattern) {
          try {
            if (!new RegExp(val.pattern).test(v)) {
              add(val.custom_msg || te("pattern"));
            }
          } catch {
            /* regex invalide côté définition — on ignore */
          }
        }
      }

      if (field.type === "number") {
        const n = Number(v);
        if (Number.isNaN(n)) {
          add(te("number"));
        } else {
          if (val.min_value != null && n < val.min_value) {
            add(te("minValue", { min: val.min_value }));
          }
          if (val.max_value != null && n > val.max_value) {
            add(te("maxValue", { max: val.max_value }));
          }
        }
      }
    }
  });
}

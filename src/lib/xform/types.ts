/**
 * Types XForm — miroir TypeScript du schéma Pydantic du plugin xcore-form
 * (src/schemas/form.py) et du SDK (xform-sdk.js).
 *
 * Le formulaire de sinistre est PILOTÉ PAR XFORM (data-driven) : on consomme une
 * FormDefinition renvoyée par l'API et on la rend nous-mêmes en shadcn. Ces types
 * garantissent que notre renderer reste fidèle au contrat backend.
 */

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "date"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "file"
  | "signature"
  | "phone"
  | "url"
  | "hidden"
  | "section"
  | "divider";

export type FormStatus = "active" | "paused" | "archived" | "draft";

export type SubmissionStatus = "pending" | "processed" | "failed";

export type LogicOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "not_empty"
  | "is_empty";

export interface ConditionalRule {
  field_id: string;
  operator: LogicOperator;
  value?: unknown;
  action: "show" | "hide";
}

export interface FieldLogic {
  rules: ConditionalRule[];
  match_all: boolean; // AND (true) vs OR (false)
}

export interface FieldValidation {
  required?: boolean;
  min_length?: number | null;
  max_length?: number | null;
  min_value?: number | null;
  max_value?: number | null;
  pattern?: string | null; // regex
  custom_msg?: string | null;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string; // clé dans les données soumises
  placeholder?: string | null;
  help_text?: string | null;
  default_value?: unknown;
  options: FieldOption[];
  order: number;
  width: "full" | "half" | "third";
  validation: FieldValidation;
  logic?: FieldLogic | null;
  // Spécifique FILE
  accept?: string | null; // ex ".pdf,.jpg"
  max_size_mb?: number | null;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string | null;
  field_ids: string[];
  order: number;
}

export interface FormSettings {
  multi_step?: boolean;
  confirmation_email?: boolean;
  confirmation_message?: string;
  redirect_url?: string | null;
  workflow_id?: string | null; // déclenche XFlow à la soumission
  create_ticket?: boolean;
  ticket_assignee?: string | null;
  notify_owner?: boolean;
  max_submissions?: number | null;
  close_after?: string | null;
  allow_edit?: boolean;
  one_submission_per_user?: boolean;
}

export interface FormTheme {
  primary_color?: string;
  bg_color?: string;
  text_color?: string;
  font?: string;
  border_radius?: string;
  logo_url?: string | null;
  cover_url?: string | null;
}

export interface FormDefinition {
  id: string;
  title: string;
  description?: string | null;
  slug?: string | null;
  owner_id: string;
  fields: FormField[];
  steps: FormStep[];
  settings: FormSettings;
  theme: FormTheme;
  status: FormStatus;
  tags: string[];
  created_at?: string | null;
  updated_at?: string | null;
}

/** Valeur d'un champ dans le state du formulaire (texte, nombre, liste, ou fichier). */
export type FormValue = string | number | boolean | string[] | File | null | undefined;

export type FormData = Record<string, FormValue>;

export interface SubmitResult {
  submission_id: string;
  message: string;
  redirect_url?: string;
}

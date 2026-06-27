import type { FormDefinition, FormField } from "./types";

/** Traducteur scopé au namespace `claimForm`. */
type Translator = (key: string) => string;

const f = (
  field: Partial<FormField> & Pick<FormField, "type" | "name" | "label">,
): FormField => ({
  id: `field_${field.name}`,
  placeholder: null,
  help_text: null,
  default_value: null,
  options: [],
  order: 0,
  width: "full",
  validation: {},
  logic: null,
  accept: null,
  max_size_mb: null,
  ...field,
});

/**
 * Construit la FormDefinition du formulaire de déclaration de sinistre à partir
 * des traductions (namespace `claimForm`). Sert à prévisualiser le XFormRenderer
 * tant que l'API XForm n'est pas branchée — et démontre le rendu 100 % localisé
 * (EN/FR) d'un formulaire data-driven, avec logique conditionnelle par type.
 */
export function buildClaimForm(t: Translator): FormDefinition {
  return {
    id: "claim-intake",
    title: t("title"),
    description: t("description"),
    slug: "claim-intake",
    owner_id: "tenant-demo",
    status: "active",
    tags: ["claim"],
    steps: [],
    settings: {
      multi_step: false,
      workflow_id: "claim_processing_pipeline",
    },
    theme: { primary_color: "#1E3A5F" },
    fields: [
      f({
        type: "select",
        name: "claim_type",
        label: t("fields.claim_type.label"),
        order: 1,
        width: "half",
        validation: { required: true },
        options: [
          { label: t("fields.claim_type.options.health"), value: "health" },
          { label: t("fields.claim_type.options.vehicle"), value: "vehicle" },
          { label: t("fields.claim_type.options.property"), value: "property" },
          {
            label: t("fields.claim_type.options.liability"),
            value: "liability",
          },
          { label: t("fields.claim_type.options.other"), value: "other" },
        ],
      }),
      f({
        type: "text",
        name: "policy_number",
        label: t("fields.policy_number.label"),
        order: 2,
        width: "half",
        placeholder: t("fields.policy_number.placeholder"),
        validation: { required: true },
      }),

      // — Champs conditionnels par type —
      f({
        type: "text",
        name: "mutual_number",
        label: t("fields.mutual_number.label"),
        order: 3,
        width: "half",
        validation: { required: true },
        logic: {
          match_all: true,
          rules: [
            { field_id: "claim_type", operator: "eq", value: "health", action: "show" },
          ],
        },
      }),
      f({
        type: "text",
        name: "plate_number",
        label: t("fields.plate_number.label"),
        order: 3,
        width: "half",
        placeholder: t("fields.plate_number.placeholder"),
        validation: { required: true },
        logic: {
          match_all: true,
          rules: [
            { field_id: "claim_type", operator: "eq", value: "vehicle", action: "show" },
          ],
        },
      }),
      f({
        type: "text",
        name: "property_address",
        label: t("fields.property_address.label"),
        order: 3,
        width: "full",
        validation: { required: true },
        logic: {
          match_all: true,
          rules: [
            { field_id: "claim_type", operator: "eq", value: "property", action: "show" },
          ],
        },
      }),

      f({
        type: "section",
        name: "sec_details",
        label: t("fields.sec_details.label"),
        order: 4,
      }),
      f({
        type: "date",
        name: "incident_date",
        label: t("fields.incident_date.label"),
        order: 5,
        width: "half",
        validation: { required: true },
      }),
      f({
        type: "number",
        name: "amount_claimed",
        label: t("fields.amount_claimed.label"),
        order: 6,
        width: "third",
        placeholder: t("fields.amount_claimed.placeholder"),
        validation: { required: true, min_value: 1 },
      }),
      f({
        type: "select",
        name: "currency",
        label: t("fields.currency.label"),
        order: 7,
        width: "third",
        default_value: "USD",
        validation: { required: true },
        options: [
          { label: "USD", value: "USD" },
          { label: "EUR", value: "EUR" },
          { label: "XOF", value: "XOF" },
        ],
      }),
      f({
        type: "textarea",
        name: "description",
        label: t("fields.description.label"),
        order: 8,
        width: "full",
        placeholder: t("fields.description.placeholder"),
        help_text: t("fields.description.help"),
        validation: { required: true, min_length: 10, max_length: 500 },
      }),
      f({
        type: "file",
        name: "document",
        label: t("fields.document.label"),
        order: 9,
        width: "full",
        accept: "image/*,application/pdf",
        help_text: t("fields.document.help"),
      }),
    ],
  };
}

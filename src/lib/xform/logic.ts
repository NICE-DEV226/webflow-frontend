import type {
  ConditionalRule,
  FormData,
  FormField,
  FormValue,
  LogicOperator,
} from "./types";

/**
 * Évalue une règle conditionnelle d'un champ XForm contre la valeur d'un autre champ.
 * Reproduit la sémantique des opérateurs du plugin (schemas/form.py · LogicOperator).
 */
function evalRule(rule: ConditionalRule, value: FormValue): boolean {
  const op: LogicOperator = rule.operator;
  const target = rule.value;

  switch (op) {
    case "eq":
      return String(value ?? "") === String(target ?? "");
    case "neq":
      return String(value ?? "") !== String(target ?? "");
    case "gt":
      return Number(value) > Number(target);
    case "gte":
      return Number(value) >= Number(target);
    case "lt":
      return Number(value) < Number(target);
    case "lte":
      return Number(value) <= Number(target);
    case "contains":
      if (Array.isArray(value)) return value.includes(String(target));
      return String(value ?? "").includes(String(target ?? ""));
    case "not_empty":
      return Array.isArray(value)
        ? value.length > 0
        : value !== null && value !== undefined && value !== "";
    case "is_empty":
      return Array.isArray(value)
        ? value.length === 0
        : value === null || value === undefined || value === "";
    default:
      return true;
  }
}

/**
 * Détermine si un champ doit être affiché compte tenu des valeurs courantes.
 * - Pas de logique → toujours visible.
 * - action "show" : visible quand les règles matchent.
 * - action "hide" : masqué quand les règles matchent.
 * `match_all` combine les règles en AND (true) ou OR (false).
 */
export function isFieldVisible(field: FormField, values: FormData): boolean {
  const logic = field.logic;
  if (!logic || logic.rules.length === 0) return true;

  const results = logic.rules.map((rule) =>
    evalRule(rule, values[rule.field_id]),
  );
  const matched = logic.match_all
    ? results.every(Boolean)
    : results.some(Boolean);

  // Les règles SDK partagent la même action ; on se base sur la première.
  const action = logic.rules[0].action;
  return action === "hide" ? !matched : matched;
}

/** Champs de layout sans valeur (ne participent pas aux données soumises). */
export const LAYOUT_FIELD_TYPES = new Set(["section", "divider", "hidden"]);

export function isDataField(field: FormField): boolean {
  return !LAYOUT_FIELD_TYPES.has(field.type);
}

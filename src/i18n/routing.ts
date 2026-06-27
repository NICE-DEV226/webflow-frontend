import { defineRouting } from "next-intl/routing";

/**
 * Routing i18n ClaimFlow.
 * - Anglais par défaut (jury hackathon international) → pas de préfixe URL pour /en.
 * - Français secondaire → préfixe /fr.
 */
export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // Jury international : l'anglais prime. Pas de bascule auto selon la langue du navigateur.
  // L'utilisateur choisit le français via le switch (ou /fr).
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

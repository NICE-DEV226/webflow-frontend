import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Wrappers de navigation conscients de la locale.
 * Utiliser ces `Link` / `useRouter` / `usePathname` partout (jamais ceux de next/link
 * ou next/navigation) pour préserver la langue active.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

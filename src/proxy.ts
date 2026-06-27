import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

// Next 16 : convention "proxy" (remplace "middleware"). next-intl reste compatible.
export default createMiddleware(routing);

export const config = {
  // Tout sauf les API, les internes Next, et les fichiers statiques (avec extension).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

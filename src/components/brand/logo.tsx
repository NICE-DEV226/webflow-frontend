import { cn } from "@/lib/utils";

/**
 * Monogramme CF — version vectorielle mono-couleur (hérite de `color` via currentColor).
 * Tracé issu de icon.svg fourni par le brand. Utilisable sur n'importe quel fond :
 *   <LogoMark className="text-primary" />     → navy
 *   <LogoMark className="text-white" />        → négatif (sidebar navy)
 *   <LogoMark className="text-emerald" />      → accent
 */
export function LogoMark({
  className,
  title = "ClaimFlow",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      className={cn("size-8", className)}
      role="img"
      aria-label={title}
      fill="currentColor"
    >
      <g transform="translate(0,1024) scale(0.1,-0.1)" stroke="none">
        <path d="M3730 7611 c-770 -118 -1377 -694 -1481 -1407 -19 -131 -20 -177 -16 -1148 4 -1100 1 -1051 62 -1261 134 -464 489 -875 938 -1085 95 -45 271 -106 333 -116 38 -6 42 -4 48 19 7 28 -2 1036 -9 1048 -3 4 -30 21 -62 39 -126 71 -239 219 -294 385 l-24 70 -3 840 c-2 575 1 867 8 925 22 165 93 331 193 447 140 162 302 257 522 305 l100 22 1570 -2 c932 -2 1575 1 1583 6 11 7 286 726 331 865 24 73 192 67 -1848 66 -1699 -1 -1845 -2 -1951 -18z" />
        <path d="M7332 6198 c-8 -8 -12 -50 -12 -125 l0 -113 -1392 0 c-1326 0 -1397 -1 -1485 -19 -237 -49 -450 -232 -532 -456 -47 -128 -52 -201 -49 -624 3 -346 5 -385 20 -394 19 -12 5 -20 418 242 191 121 275 168 335 189 l80 27 1303 3 1302 2 0 -164 c0 -133 3 -166 15 -176 8 -7 20 -10 27 -7 11 4 118 95 498 426 47 40 163 141 258 223 94 83 172 156 172 163 0 18 -917 815 -938 815 -4 0 -13 -5 -20 -12z" />
        <path d="M4620 4340 c-109 -9 -140 -25 -400 -203 -328 -226 -338 -233 -350 -275 -13 -49 -14 -1241 0 -1276 l10 -26 355 0 356 0 42 39 42 40 5 360 c5 344 6 361 26 388 47 65 28 63 675 63 457 0 589 3 596 13 13 16 283 827 283 849 0 9 -5 20 -12 24 -16 10 -1517 14 -1628 4z" />
      </g>
    </svg>
  );
}

/**
 * Logo complet (lockup) : monogramme + wordmark « ClaimFlow ».
 * - variant="color"    → fond clair : CF + Claim en navy, Flow en emerald.
 * - variant="negative" → fond sombre (sidebar navy) : CF + Claim en blanc, Flow en emerald.
 */
export function Logo({
  variant = "color",
  className,
  markClassName,
}: {
  variant?: "color" | "negative";
  className?: string;
  markClassName?: string;
}) {
  const isNegative = variant === "negative";
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark
        className={cn(
          "size-7",
          isNegative ? "text-white" : "text-primary",
          markClassName,
        )}
      />
      <span className="text-lg font-bold tracking-tight">
        <span className={isNegative ? "text-white" : "text-primary"}>Claim</span>
        <span className="text-emerald">Flow</span>
      </span>
    </span>
  );
}

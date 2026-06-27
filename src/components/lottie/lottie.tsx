"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { cn } from "@/lib/utils";

export interface LottieProps {
  /** Chemin vers un .lottie / .json (ex: "/animations/hero-pipeline.lottie") ou URL LottieFiles. */
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  /** Doit définir une taille (ex: "size-44" ou "w-full aspect-[800/460]"). */
  className?: string;
  /** Affiché si pas de src ou si l'utilisateur préfère réduire les animations. */
  fallback?: React.ReactNode;
  /** false = joue toujours (animation = contenu, ex. hero). true (défaut) = respecte reduced-motion. */
  respectReducedMotion?: boolean;
  "aria-label"?: string;
}

/**
 * Wrapper Lottie (player officiel LottieFiles dotlottie).
 * Rend le player directement (il gère son propre chargement). Le fallback ne sert
 * qu'au cas "reduced-motion" ou "pas de src". Le conteneur DOIT être dimensionné.
 */
export function Lottie({
  src,
  loop = true,
  autoplay = true,
  className,
  fallback,
  respectReducedMotion = true,
  "aria-label": ariaLabel,
}: LottieProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!src || (respectReducedMotion && reduceMotion)) {
    return (
      <div
        className={cn("flex items-center justify-center", className)}
        role="img"
        aria-label={ariaLabel}
      >
        {fallback}
      </div>
    );
  }

  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay={autoplay}
      className={cn(className)}
      aria-label={ariaLabel}
    />
  );
}

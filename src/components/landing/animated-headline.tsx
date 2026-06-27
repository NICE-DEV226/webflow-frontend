"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

/**
 * Titre du hero avec un bénéfice qui défile (adapté du pattern "animated hero",
 * mais branché sur NOTRE design system : motion.dev, Emerald, Inter, et du sens
 * — on fait défiler de vrais bénéfices, pas des adjectifs génériques).
 */
export function AnimatedHeadline() {
  const t = useTranslations("landing.hero");
  const words = t.raw("rotating") as string[];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setTimeout(
      () => setIndex((p) => (p + 1) % words.length),
      2200,
    );
    return () => clearTimeout(id);
  }, [index, words.length]);

  return (
    <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-[3.25rem] sm:leading-[1.05]">
      {t("titleLead")}
      <span className="relative mt-1 flex min-h-[1.15em] w-full overflow-hidden">
        {words.map((word, i) => (
          <motion.span
            key={word}
            className="absolute left-0 text-balance text-emerald"
            initial={{ opacity: 0, y: "-110%" }}
            animate={
              index === i
                ? { y: "0%", opacity: 1 }
                : { y: index > i ? "-150%" : "150%", opacity: 0 }
            }
            transition={{ type: "spring", stiffness: 60, damping: 13 }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}

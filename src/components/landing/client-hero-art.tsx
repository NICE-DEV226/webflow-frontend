"use client";

import dynamic from "next/dynamic";

const HeroArt = dynamic(() => import("@/components/landing/hero-art").then((m) => ({ default: m.HeroArt })), { ssr: false });

export function ClientHeroArt() {
  return <HeroArt />;
}

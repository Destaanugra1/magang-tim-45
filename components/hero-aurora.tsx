"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SoftAurora = dynamic(() => import("./SoftAurora"), {
  ssr: false,
});

const fallbackClassName =
  "absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(225,0,255,0.18),_transparent_45%),linear-gradient(180deg,_rgba(248,250,252,0.96),_rgba(255,255,255,1))]";

export default function HeroAurora() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isLargeViewport = window.matchMedia("(min-width: 1024px)").matches;

    if (prefersReducedMotion || !isLargeViewport) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsEnabled(true);
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (!isEnabled) {
    return <div className={fallbackClassName} aria-hidden="true" />;
  }

  return (
    <>
      <div className={fallbackClassName} aria-hidden="true" />
      <SoftAurora
        speed={0.45}
        scale={1.35}
        brightness={0.85}
        color1="#f7f7f7"
        color2="#e100ff"
        noiseFrequency={1.8}
        noiseAmplitude={0.7}
        bandHeight={0.5}
        bandSpread={1}
        octaveDecay={0.1}
        layerOffset={0}
        colorSpeed={0.75}
        enableMouseInteraction={false}
        mouseInfluence={0.12}
      />
    </>
  );
}

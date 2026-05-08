"use client";

import dynamic from "next/dynamic";

const WavyBackground = dynamic(
  () =>
    import("@/components/ui/wavy-background").then(
      (mod) => mod.WavyBackground
    ),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#ffffff_48%,#ffffff_100%)]" />
    ),
  }
);

export default function OptimizedWavyBackground() {
  return (
    <WavyBackground
      containerClassName="h-[520px]"
      className="h-full w-full"
      backgroundFill="white"
      speed="slow"
      blur={0}
      waveOpacity={0.18}
      waveWidth={100}
    />
  );
}
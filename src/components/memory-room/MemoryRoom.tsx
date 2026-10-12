"use client";

import { useMemo } from "react";
import { asset } from "@/lib/asset";
import { TiltedGridHero } from "./TiltedGridHero";

export type Memory = {
  id: string;
  year: string | null;
  label: string;
  title: string;
  caption: string;
  image: string;
  alt: string;
  href: string | null;
};
type Labels = {
  region: string;
  live: string;
  prev: string;
  next: string;
  open: string;
  loading: string;
  yearUnknown: string;
};

/**
 * SUN-FAI: the supplied continuous curved image band, within the brand's
 * paper/mint treatment. The band neither scroll-jacks the page nor makes
 * inaccessible or misleading next/previous controls: the next page section
 * provides a full interactive, chronological milestones carousel.
 */
export function MemoryRoom({ items, labels }: { items: Memory[]; labels: Labels }) {
  const images = useMemo(() => items.map((m) => ({ src: asset(m.image), alt: m.alt })), [items]);
  if (!images.length) return null;

  return (
    <div role="region" aria-label={labels.region} className="mx-auto w-full max-w-[1440px]">
      <TiltedGridHero
        images={images}
        speed={4.8}
        tileHeight={43}
        aspectRatio={1.52}
        gap={8}
        axis={50}
        curve={70}
        fade={11}
        className="memory-band relative h-[clamp(265px,58vw,590px)] w-full rounded-[26px] sm:rounded-[34px]"
      />
      <ol className="sr-only">
        {items.map((m) => (
          <li key={m.id}>{m.year ?? labels.yearUnknown}: {m.title}. {m.caption}</li>
        ))}
      </ol>
    </div>
  );
}

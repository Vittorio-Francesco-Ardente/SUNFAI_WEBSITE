"use client";

import { useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type Slide = { key: string; label: string; content: ReactNode };

/** Profile gallery, V3 (CONCEPT_PROFILE_V3): a row of tiles on a tinted plate, 4 visible, arrows (48 px) and dots (44 px hit area), swipe on touch. Tile labels are for screen readers. */
export function ProfileGallery({ slides, labels }: { slides: Slide[]; labels: { region: string; prev: string; next: string } }) {
  const ref = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(slides.length - 1, i));
    const child = el.children[idx] as HTMLElement | undefined;
    if (child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || "0"), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    setActive(idx);
  };
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    let best = 0;
    children.forEach((c, i) => {
      if (Math.abs(c.offsetLeft - el.offsetLeft - el.scrollLeft) < Math.abs(children[best].offsetLeft - el.offsetLeft - el.scrollLeft)) best = i;
    });
    setActive(best);
  };
  return (
    <div role="region" aria-roledescription="carousel" aria-label={labels.region} className="rounded-[30px] bg-[#FFF7F0]/90 p-3 sm:p-4">
      <ul ref={ref} onScroll={onScroll} tabIndex={0} className="rail rail--small pb-2 lg:[--rail-item:calc((100%-36px)/4)]">
        {slides.map((s) => (
          <li key={s.key} aria-label={s.label} className="relative aspect-[1/0.95] overflow-hidden rounded-[20px] bg-white shadow-[0_12px_24px_-20px_rgb(5_42_34/.5)]">
            {s.content}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-between gap-4">
        <div className="flex">
          {slides.map((s, i) => (
            <button key={s.key} type="button" data-hit-area aria-label={`${i + 1} / ${slides.length}: ${s.label}`} aria-current={i === active ? "true" : undefined} onClick={() => go(i)} className="grid h-11 w-6 place-items-center">
              <span className={cn("block h-2 rounded-full transition-all", i === active ? "w-5 bg-orange" : "w-2 bg-ink/15")} />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => go(active - 1)} aria-label={labels.prev} className="paper-round">
            <ArrowLeft aria-hidden />
          </button>
          <button type="button" onClick={() => go(active + 1)} aria-label={labels.next} className="paper-round paper-round--dark">
            <ArrowRight aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

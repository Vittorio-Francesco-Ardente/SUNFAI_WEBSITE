"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/cn";

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
 * SUN-FAI — "La stanza dei ricordi" must be moved by the user, not autoplayed.
 * A manual, scroll-snap photo rail driven by touch / trackpad / mouse drag and arrow buttons.
 * Uses the real attached event photos mapped to the milestones.
 */
export function MemoryRoom({ items, labels }: { items: Memory[]; labels: Labels }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const cards = useMemo(
    () => items.map((m) => ({ ...m, src: m.image, yearLabel: m.year ?? labels.yearUnknown })),
    [items, labels.yearUnknown],
  );

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const update = () => {
      const card = el.querySelector<HTMLElement>("[data-memory-card]");
      if (!card) return;
      const step = card.offsetWidth + 16;
      if (step <= 0) return;
      setIndex(Math.max(0, Math.min(cards.length - 1, Math.round(el.scrollLeft / step))));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [cards.length]);

  const scrollByDir = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-memory-card]");
    const amount = (card?.offsetWidth ?? el.clientWidth * 0.72) + 16;
    el.scrollBy({ left: dir * amount, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  if (!cards.length) return null;

  return (
    <section aria-label={labels.region} className="mx-auto w-full max-w-[1440px]">
      <p className="sr-only" aria-live="polite">
        {labels.live.replace("{n}", String(index + 1)).replace("{total}", String(cards.length)).replace("{title}", cards[index]?.title ?? "")}
      </p>

      <div className="relative overflow-hidden rounded-[28px] border border-[var(--color-hairline)] bg-white/70 px-3 py-5 shadow-[var(--shadow-soft)] sm:px-4 sm:py-6 lg:px-6 lg:py-7">
        {/* Crop the rail inside the rounded panel without background gradients. */}

        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 pt-1 no-scrollbar"
          style={{ scrollPaddingInline: "max(4px, 1rem)" }}
        >
          {cards.map((m, i) => (
            <article
              key={m.id}
              data-memory-card
              className={cn(
                "group relative shrink-0 snap-start overflow-hidden rounded-[24px] bg-[#fcfbf7] shadow-[0_0_0_1px_var(--color-hairline),var(--shadow-soft)]",
                "w-[72vw] max-w-[320px] sm:w-[46vw] sm:max-w-[370px] lg:w-[29vw] lg:max-w-[380px] xl:w-[23vw]",
                i % 4 === 1 ? "sm:translate-y-2" : i % 4 === 2 ? "sm:-translate-y-1" : "",
              )}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] m-2 sm:m-2.5">
                <Img src={m.src} alt={m.alt} sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 28vw, (min-width: 640px) 44vw, 72vw" className="h-full w-full object-cover" draggable={false} />
              </div>
              <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-ink px-3 py-1 text-[12px] font-semibold text-white">{m.yearLabel}</span>
                  <span className="pill !max-w-full truncate">{m.label}</span>
                </div>
                <h3 className="font-display text-[1.1rem] font-extrabold leading-tight tracking-[-0.03em] text-ink sm:text-[1.22rem]">
                  {m.title}
                  <span className="dot">.</span>
                </h3>
                <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-slate sm:text-[15px]">{m.caption}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <span className="min-w-[64px] text-right tabular-nums text-slate">
            <b className="text-[20px] text-ink">{String(index + 1).padStart(2, "0")}</b> / {String(cards.length).padStart(2, "0")}
          </span>
          <button type="button" onClick={() => scrollByDir(-1)} aria-label={labels.prev} className="paper-round">
            <ArrowLeft aria-hidden />
          </button>
          <div className="hidden sm:flex" role="group" aria-label={labels.region}>
            {cards.map((m, i) => (
              <button key={m.id} type="button" data-hit-area aria-current={i === index ? "true" : undefined} aria-label={`${i + 1}: ${m.title}`} onClick={() => railRef.current?.children[i]?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest", inline: "start" })} className="grid h-11 w-6 place-items-center">
                <span className={cn("block h-2.5 rounded-full transition-all duration-300", i === index ? "w-7 bg-orange" : "w-2.5 bg-ink/20")} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => scrollByDir(1)} aria-label={labels.next} className="paper-round paper-round--dark">
            <ArrowRight aria-hidden />
          </button>
        </div>
      </div>

      <ol className="sr-only">
        {items.map((m) => (
          <li key={m.id}>
            {m.year ?? labels.yearUnknown}: {m.title}. {m.caption}
          </li>
        ))}
      </ol>
    </section>
  );
}

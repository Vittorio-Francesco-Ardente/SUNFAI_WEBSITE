"use client";

import Link from "next/link";
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Trophy } from "lucide-react";
import { Badge } from "@/components/geometry/shapes";
import { Img } from "@/components/ui/Img";
import { lhref, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { pad2, SPRING_SOFT } from "@/lib/motion";
import type { Dict } from "@/content/dict";

export type SqueezeItem = { id: string; year: string | null; label: string; kind: string; title: string; caption: string; href: string | null; image: string; alt: string };

/**
 * Demo "carousel squeeze", restyled (pack 07.1 §5): one milestone large (image frame + white text panel),
 * the others compressed into paper-2 strips with a vertical label and a small geometry badge.
 * Arrows, keyboard, drag; no autoplay. Phones: vertical list (pack 15.2).
 */
export function AwardsSqueeze({ items, t, locale, yearUnknown, height = "h-[560px]", phoneLimit }: { items: SqueezeItem[]; t: Dict["riconoscimenti"]["squeeze"]; locale: Locale; yearUnknown: string; height?: string; phoneLimit?: number }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const go = useCallback((i: number) => setIndex((i + items.length) % items.length), [items.length]);
  const startX = useRef<number | null>(null);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") (e.preventDefault(), go(index + 1));
    if (e.key === "ArrowLeft") (e.preventDefault(), go(index - 1));
  };
  const onDown = (e: PointerEvent) => (startX.current = e.clientX);
  const onUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
  };
  const kindLabel = (k: string) => (k === "premio" ? t.premio : t.traguardo);
  const year = (y: string | null) => y ?? yearUnknown;

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={t.region}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerUp={onUp}
        className={cn("hidden touch-pan-y select-none gap-2.5 rounded-[var(--radius-feature)] md:flex lg:gap-3", height)}
      >
        {items.map((m, i) => {
          const active = i === index;
          return (
            <motion.div
              key={m.id}
              className={cn("relative min-w-11 overflow-hidden rounded-[28px]", active ? "card" : "bg-paper-2 shadow-[inset_0_0_0_1px_var(--color-hairline)]")}
              style={{ flexBasis: 0 }}
              initial={false}
              animate={{ flexGrow: active ? 8.5 : 1 }}
              transition={reduce ? { duration: 0 } : SPRING_SOFT}
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${items.length}: ${m.title}`}
            >
              {active ? (
                <div className="flex h-full">
                  <div className="relative h-full w-[46%] shrink-0 overflow-hidden p-3">
                    <Img src={m.image} alt={m.alt} sizes="(min-width: 1280px) 420px, 34vw" className="h-full w-full rounded-[20px] object-cover" draggable={false} />
                  </div>
                  <motion.div key={`c-${m.id}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.42 }} className="relative flex min-w-[17rem] flex-1 flex-col justify-between p-7 lg:p-9">
                    <Badge n={m.kind === "premio" ? 1 : 3} className="absolute right-0 top-0 w-24 rounded-tr-[28px]" />
                    <p className="flex flex-wrap items-center gap-2.5 pr-20 text-[14px] font-medium text-slate">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-bold uppercase tracking-[0.06em]", m.kind === "premio" ? "bg-solar text-ink" : "bg-sage text-leaf-text")}>
                        {m.kind === "premio" ? <Trophy className="size-3.5" aria-hidden /> : null}
                        {kindLabel(m.kind)}
                      </span>
                      {m.label}
                    </p>
                    <div>
                      <p className="font-display text-[clamp(3rem,2rem+2.4vw,4.6rem)] font-extrabold leading-none tracking-[-0.05em] text-orange">{year(m.year)}</p>
                      <h3 className="mt-3 max-w-[18ch] font-display text-[clamp(1.6rem,1.1rem+1.2vw,2.4rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-ink">{m.title}</h3>
                      <p className="t-body mt-3 max-w-[42ch]">{m.caption}</p>
                      {m.href ? (
                        <Link href={lhref(locale, m.href)} className="tlink mt-3">
                          <span>{t.more}</span>
                          <ArrowUpRight aria-hidden />
                        </Link>
                      ) : null}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <button type="button" onClick={() => go(i)} className="group absolute inset-0 flex flex-col items-center justify-between py-5 text-ink" aria-label={t.show.replace("{title}", m.title).replace("{year}", year(m.year))}>
                  <span className="rounded-full bg-card px-2 py-0.5 text-[13px] font-bold">{m.year ?? "—"}</span>
                  <span className="max-h-[60%] overflow-hidden whitespace-nowrap font-display text-[15px] font-bold tracking-[-0.01em] [writing-mode:vertical-rl] rotate-180">{m.title}</span>
                  <Badge n={(((i % 4) + 1) as 1 | 2 | 3 | 4)} className="w-10 rounded-full transition-transform duration-300 group-hover:rotate-[8deg]" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 hidden items-center justify-between md:flex">
        <p className="text-[15px] text-slate">
          <span className="font-display text-lg font-extrabold text-ink">{pad2(index + 1)}</span> / {pad2(items.length)}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => go(index - 1)} aria-label={t.prevLabel} className="paper-round">
            <ArrowLeft aria-hidden />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label={t.nextLabel} className="paper-round paper-round--dark">
            <ArrowRight aria-hidden />
          </button>
        </div>
      </div>

      {/* Smartphone: photographic milestone cards with separate content; ornaments never cover text. */}
      <ol className="grid gap-4 pb-3 md:hidden" aria-label={t.region}>
        {items.slice(0, phoneLimit ?? items.length).map((m, i) => (
          <li key={m.id} className="card min-w-0 overflow-hidden">
            <article className="min-w-0">
              <div className="relative overflow-hidden bg-paper-2">
                <Img src={m.image} alt={m.alt} sizes="(max-width: 767px) 90vw, 180px" className="aspect-[16/9] h-auto w-full object-cover" />
                <span className="absolute bottom-3 left-3 rounded-full bg-ink px-3 py-1 text-[12px] font-extrabold tabular-nums text-white">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="min-w-0 px-5 pb-6 pt-5 sm:px-6">
                <p className="text-[13px] font-semibold leading-snug text-orange-text">{m.label}</p>
                <h3 className="mt-2 break-words font-display text-[clamp(1.15rem,5vw,1.5rem)] font-extrabold leading-tight tracking-[-0.025em] text-ink">{m.title}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-slate">{m.caption}</p>
                {m.href ? <Link href={lhref(locale, m.href)} className="tlink mt-3"><span>{t.more}</span><ArrowUpRight aria-hidden /></Link> : null}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}

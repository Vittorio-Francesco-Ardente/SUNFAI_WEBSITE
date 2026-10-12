"use client";

/**
 * SUN-FAI — Achievements carousel ("Traguardi"), ported from pack 07 code/achievements-carousel.tsx (already
 * restyled from the client's 21st.dev TestimonialCarousel): one item at a time, image tile on a member backdrop
 * (radius 40) + overlapping warm-white card, counter, paper round buttons, dots, keyboard + swipe, reduced motion.
 * Adjusted for this codebase: <Img> (static-export srcset), dictionary labels, 44 px dot hit areas, text ≥ 13 px.
 */
import { useCallback, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { MemberBackdrop } from "@/components/geometry/shapes";
import { Img } from "@/components/ui/Img";
import { pad2 } from "@/lib/motion";

export interface Achievement {
  id: string;
  year: string;
  label: string;
  title: string;
  description: string;
  image: { src: string; alt: string };
  backdrop?: 1 | 2 | 3 | 4 | 5 | 6;
  links?: { label: string; href: string; external?: boolean }[];
}

export function AchievementsCarousel({ items, labels, className }: { items: Achievement[]; labels: { region: string; live: string; prev: string; next: string }; className?: string }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const total = items.length;
  const go = useCallback((i: number) => setIndex(((i % total) + total) % total), [total]);
  const item = items[index];
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") (e.preventDefault(), go(index + 1));
    if (e.key === "ArrowLeft") (e.preventDefault(), go(index - 1));
  };
  const fade = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } };
  const bd = item.backdrop ?? (((index % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6);
  const link = (l: NonNullable<Achievement["links"]>[number]) =>
    l.external ? (
      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="tlink">
        <span>{l.label}</span>
        <ArrowUpRight aria-hidden />
      </a>
    ) : (
      <Link key={l.href} href={l.href} className="tlink">
        <span>{l.label}</span>
        <ArrowUpRight aria-hidden />
      </Link>
    );

  return (
    <div tabIndex={0} role="region" aria-roledescription="carousel" aria-label={labels.region} onKeyDown={onKey} className={cn("mx-auto w-full max-w-[1180px] outline-none", className)}>
      <p className="sr-only" aria-live="polite">
        {labels.live.replace("{n}", String(index + 1)).replace("{total}", String(total)).replace("{title}", item.title)}
      </p>

      {/* Desktop: image tile left, overlapping card right */}
      <div className="relative hidden items-center gap-6 md:grid md:grid-cols-[minmax(0,500px)_minmax(0,1fr)] xl:flex xl:gap-0">
        <motion.div
          className="relative aspect-square w-full max-w-[500px] shrink-0 overflow-hidden rounded-[40px]"
          drag={reduce ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(index + 1);
            if (info.offset.x > 60) go(index - 1);
          }}
        >
          <MemberBackdrop n={bd} className="absolute inset-0 h-full w-full" />
          <AnimatePresence mode="wait">
            <motion.div key={item.id} className="absolute inset-[7%] overflow-hidden rounded-[28px] bg-white shadow-[var(--shadow-soft)]" {...fade}>
              <Img src={item.image.src} alt={item.image.alt} sizes="(min-width: 1024px) 460px, 86vw" className="h-full w-full object-cover" draggable={false} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <div className="z-10 max-w-xl flex-1 rounded-[28px] bg-card-warm p-8 shadow-[0_0_0_1px_var(--color-hairline),var(--shadow-lift)] lg:p-9 xl:-ml-16">
          <AnimatePresence mode="wait">
            <motion.div key={item.id} {...fade}>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-ink px-3 py-1 text-[13px] font-semibold tabular-nums text-white">{item.year}</span>
                <span className="pill">{item.label}</span>
              </div>
              <h3 className="font-display text-[clamp(1.75rem,1.2rem+1.6vw,2.6rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-ink">
                {item.title}
                <span className="dot">.</span>
              </h3>
              <p className="mt-4 text-[17px] leading-relaxed text-slate">{item.description}</p>
              {item.links?.length ? <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1">{item.links.map(link)}</div> : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Phones: one card per view, backdrop on top (4:3), text below, swipe */}
      <div className="mx-auto max-w-sm md:hidden">
        <motion.div
          className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[32px]"
          drag={reduce ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) go(index + 1);
            if (info.offset.x > 50) go(index - 1);
          }}
          style={{ touchAction: "pan-y" }}
        >
          <MemberBackdrop n={bd} className="absolute inset-0 h-full w-full" />
          <AnimatePresence mode="wait">
            <motion.div key={item.id} className="absolute inset-[7%] overflow-hidden rounded-[22px] bg-white" {...fade}>
              <Img src={item.image.src} alt={item.image.alt} sizes="86vw" className="h-full w-full object-cover" draggable={false} />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={item.id} {...fade} className="px-1">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-ink px-3 py-1 text-[13px] font-semibold text-white">{item.year}</span>
              <span className="pill">{item.label}</span>
            </div>
            <h3 className="font-display text-[1.75rem] font-extrabold leading-none tracking-[-0.04em]">
              {item.title}
              <span className="dot">.</span>
            </h3>
            <p className="mt-3 text-[16px] leading-relaxed text-slate">{item.description}</p>
            {item.links?.length ? <div className="mt-3 flex flex-wrap gap-x-5">{item.links.map(link)}</div> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls: counter · prev · dots · next (paper buttons, no glow) */}
      <div className="mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <span className="min-w-[64px] text-right tabular-nums text-slate">
          <b className="text-[20px] text-ink">{pad2(index + 1)}</b> / {pad2(total)}
        </span>
        <button type="button" onClick={() => go(index - 1)} aria-label={labels.prev} className="paper-round">
          <ArrowLeft aria-hidden />
        </button>
        <div className="hidden sm:flex" role="group">
          {items.map((it, i) => (
            <button key={it.id} type="button" data-hit-area aria-current={i === index ? "true" : undefined} aria-label={`${i + 1}: ${it.title}`} onClick={() => go(i)} className="grid h-11 w-6 place-items-center">
              <span className={cn("block h-2.5 rounded-full transition-all duration-300", i === index ? "w-7 bg-orange" : "w-2.5 bg-ink/20")} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(index + 1)} aria-label={labels.next} className="paper-round paper-round--dark">
          <ArrowRight aria-hidden />
        </button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Eyebrow, GhostNumeral, Headline, type Tagname } from "@/components/ui/primitives";
import { lhref, type Locale } from "@/lib/i18n";
import { EASE_OUT_SOFT, SPRING_LAYOUT, pad2 } from "@/lib/motion";
import { MemberVisual, type MemberLite } from "./MemberVisual";
import type { Dict } from "@/content/dict";

/**
 * "Le persone dietro l'energia." — CONCEPT_3 (target), CONCEPT_2 (art direction), CONCEPT_4 (initials).
 * Featured card left (5/12) with overlapping info card + optional real quote bubble; counter "01 / 12",
 * orange progress, paper prev/next. Right (7/12): eyebrow, headline + ghost numeral, body + dark CTA,
 * the NEXT 4 people as small cards. Clicking a small card morphs it into the featured card (layoutId).
 * Arrows, ←/→, swipe on the featured card. No autoplay. No handwritten notes.
 * V3 (16.4): this IS the whole team — no grid of members anywhere. Optional group switch (pills, 44 px) filters what
 * the carousel cycles through: "Tutti · Consiglio di Amministrazione · Team operativo".
 */
export function TeamShowcase({
  members: all,
  t,
  locale,
  as = "h2",
  ctaHref = "/team/",
  initial = 0,
  filters,
}: {
  members: MemberLite[];
  t: Dict["team"]["section"];
  locale: Locale;
  as?: Tagname;
  ctaHref?: string;
  initial?: number;
  /** group switch labels; omit to hide the switch */
  filters?: { label: string; all: string; board: string; team: string };
}) {
  const [group, setGroup] = useState<"all" | "board" | "team">("all");
  const members = group === "all" ? all : all.filter((m) => m.group === group);
  const [index, setIndex] = useState(initial);
  const total = members.length;
  const featured = members[index];
  const next4 = Array.from({ length: Math.min(4, total - 1) }, (_, i) => members[(index + 1 + i) % total]);
  const reduce = useReducedMotion();
  const go = useCallback((i: number) => setIndex(((i % total) + total) % total), [total]);
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

  return (
    <LayoutGroup id="team-showcase">
      <div role="region" aria-roledescription="carousel" aria-label={t.region} onKeyDown={onKey} className="grid gap-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8">
        {/* Header (phones first) */}
        <div className="relative lg:col-span-7 lg:col-start-6 lg:row-start-1">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute right-0 top-[-0.1em]">
              <GhostNumeral n={pad2(index + 1)} className="static !text-[clamp(6rem,3rem+9vw,13rem)]" />
            </motion.span>
          </AnimatePresence>
          <Eyebrow className="relative">{t.eyebrow}</Eyebrow>
          <Headline text={t.title} as={as} size="h1" className="relative mt-5 lg:mt-6" />
          <div className="relative mt-6 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end lg:mt-8">
            <p className="t-lead max-w-[52ch]">{t.body}</p>
            <Link href={lhref(locale, ctaHref)} className="btn btn--dark btn--lg justify-self-start max-sm:w-full">
              {t.cta}
              <ArrowRight aria-hidden strokeWidth={2.2} />
            </Link>
          </div>
        </div>

        {/* Featured member */}
        <div className={`min-w-0 lg:col-span-5 lg:row-start-1 ${filters ? "lg:row-span-3" : "lg:row-span-2"}`}>
          <div className="relative" onPointerDown={onDown} onPointerUp={onUp} style={{ touchAction: "pan-y" }}>
            <motion.div
              layoutId={`m-${featured.slug}`}
              transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
              className="hover-card relative aspect-[1/0.92] overflow-hidden rounded-[32px] lg:aspect-[1/0.98] lg:rounded-[var(--radius-feature)]"
            >
              <MemberVisual m={featured} framing="feature" sizes="(max-width: 1023px) calc(100vw - 40px), 40vw" photoComing={t.photoComing} priority={index === initial} />
            </motion.div>
            {featured.quote ? (
              <figure className="absolute -left-2 -top-4 max-w-[15rem] rounded-[20px] bg-white/90 p-4 shadow-[var(--shadow-soft)] lg:-left-6 lg:-top-6">
                <Quote className="size-5 text-ink" aria-hidden />
                <blockquote className="mt-2 text-[15px] leading-snug text-ink">{featured.quote}</blockquote>
                <span aria-hidden className="mt-3 block h-[2px] w-6 rounded bg-orange" />
              </figure>
            ) : null}
            <Link
              href={lhref(locale, `/team/${featured.slug}/`)}
              className="hover-card relative z-[2] mx-[4%] -mt-[58px] flex items-center justify-between gap-4 rounded-[var(--radius-card)] bg-card p-5 shadow-[0_0_0_1px_var(--color-hairline),var(--shadow-lift)] sm:p-6 lg:-mt-[70px]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={featured.slug} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }} className="min-w-0">
                  <p className="font-display text-[clamp(1.25rem,1.1rem+.6vw,1.6rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink">{featured.name}</p>
                  <p className="text-[15px] text-slate">{featured.group === "board" ? featured.roleLine : featured.groupLabel}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {featured.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
              <span className="hc-arrow grid size-12 shrink-0 place-items-center rounded-full bg-peach-light text-ink">
                <ArrowRight className="size-5" aria-hidden />
                <span className="sr-only">{t.open.replace("{name}", featured.name)}</span>
              </span>
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-4 sm:gap-5">
            <p className="shrink-0 text-[15px] text-slate" aria-hidden>
              <span className="font-display text-[1.35rem] font-extrabold text-ink">{pad2(index + 1)}</span> / {pad2(total)}
            </p>
            <p className="sr-only" aria-live="polite">
              {t.live.replace("{n}", String(index + 1)).replace("{total}", String(total)).replace("{name}", featured.name).replace("{role}", featured.group === "board" ? featured.role : featured.groupLabel)}
            </p>
            <div className="relative h-[2px] flex-1 rounded-full bg-ink/12" aria-hidden>
              <motion.span className="absolute inset-y-[-1px] left-0 rounded-full bg-orange" animate={{ width: `${((index + 1) / total) * 100}%` }} transition={{ duration: reduce ? 0 : 0.45, ease: EASE_OUT_SOFT }} />
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => go(index - 1)} aria-label={t.prev} className="paper-round">
                <ArrowLeft aria-hidden strokeWidth={2.1} />
              </button>
              <button type="button" onClick={() => go(index + 1)} aria-label={t.next} className="paper-round paper-round--dark">
                <ArrowRight aria-hidden strokeWidth={2.1} />
              </button>
            </div>
          </div>
        </div>

        {filters ? (
          <div role="group" aria-label={filters.label} className="flex flex-wrap gap-2 lg:col-span-7 lg:col-start-6 lg:row-start-2 lg:self-end">
            {(["all", "board", "team"] as const).map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={group === g}
                onClick={() => (setGroup(g), setIndex(0))}
                className={group === g ? "inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-[15px] font-semibold text-white" : "inline-flex min-h-11 items-center rounded-full bg-white px-5 text-[15px] font-semibold text-ink shadow-[inset_0_0_0_1.5px_rgb(5_42_34/.14)] hover:bg-cream"}
              >
                {filters[g]}
              </button>
            ))}
          </div>
        ) : null}

        {/* The next 4 people */}
        <ul className={`rail rail--small min-w-0 pb-2 md:[--rail-item:calc((100%-36px)/4)] lg:col-span-7 lg:col-start-6 ${filters ? "lg:row-start-3" : "lg:row-start-2"} lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-3.5 lg:self-end lg:overflow-visible lg:px-0`}>
          <AnimatePresence mode="popLayout" initial={false}>
            {next4.map((m) => (
              <motion.li key={m.slug} layout={!reduce} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35, ease: EASE_OUT_SOFT }}>
                <button
                  type="button"
                  onClick={() => go(members.indexOf(m))}
                  className="card hover-card flex h-full w-full flex-col overflow-hidden text-left !rounded-[22px]"
                  aria-label={`${m.name}, ${m.group === "board" ? m.roleLine : m.groupLabel}`}
                >
                  <motion.div layoutId={`m-${m.slug}`} transition={reduce ? { duration: 0 } : SPRING_LAYOUT} className="relative aspect-[1/1.05] w-full overflow-hidden">
                    <MemberVisual m={m} usePose={!!m.pose} sizes="(max-width: 767px) 40vw, 14vw" photoComing={t.photoComing} />
                  </motion.div>
                  <span className="flex flex-1 flex-col gap-2 p-3.5">
                    <span className="flex items-start justify-between gap-2">
                      <span className="hc-name font-display text-[15px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[16px]">
                        <span className="block">{m.firstName}</span>
                        <span className="block">{m.lastName}</span>
                      </span>
                      <span className="hc-arrow grid size-8 shrink-0 place-items-center rounded-full bg-peach-light">
                        <ArrowRight className="size-4" aria-hidden />
                      </span>
                    </span>
                    <span className="text-[13px] leading-snug text-slate">{m.group === "board" ? m.role : m.groupLabel}</span>
                    <span className="pill mt-auto self-start !text-[13px]">{m.tags[0]}</span>
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </LayoutGroup>
  );
}

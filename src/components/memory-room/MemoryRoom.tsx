"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/cn";

export type Memory = { id: string; year: string | null; label: string; title: string; caption: string; image: string; alt: string; href: string | null };
type Labels = { region: string; live: string; prev: string; next: string; open: string; loading: string; yearUnknown: string };

const STEP = 30; // degrees between cards: an open arc that loops, ±2 neighbours visible

/**
 * "La stanza dei ricordi", V3 (16.9) — port of prompt-packs/16_FIX_VISUAL_OVERHAUL/code/memory-room-prototype.html.
 * CSS 3D only (no three.js). Each card is a RIGID plane: one element, transform on that element only; the 7 px white
 * frame and the radius are drawn inside it (never on a perspective-transformed wrapper, never -webkit-box-reflect).
 * Card i sits at rotateY(s·30°) translateZ(R) scale(1 − min(|s|,2)·0.07), s = signed shortest offset; R keeps
 * neighbours from touching; the ring is translateZ(−R) rotateX(−4°) in a 1500 px (phones 1100 px) perspective stage.
 * Reflection: a flipped copy at 18 %, masked + 1.5 px blur, on a flat floor with a 1 px horizon.
 * Drag (dx / 260 = cards) with inertia 0.92 and a spring snap; ← →; prev/next; dots (44 px); click a side card.
 * Card 0 starts in front, no initial spin. rAF runs only while moving. Reduced motion: instant positioning.
 */
export function MemoryRoom({ items, labels }: { items: Memory[]; labels: Labels }) {
  const n = items.length;
  const [pos, setPos] = useState(0);
  const [radius, setRadius] = useState(420);
  const st = useRef({ pos: 0, vel: 0, target: 0, dragging: false, moved: false, lastX: 0, raf: 0, reduce: false });
  const stage = useRef<HTMLDivElement>(null);
  const firstCard = useRef<HTMLDivElement>(null);

  const idx = ((Math.round(pos) % n) + n) % n;
  const cur = items[idx];

  const tick = useCallback(() => {
    const s = st.current;
    if (!s.dragging) {
      if (Math.abs(s.vel) > 0.002) {
        s.pos += s.vel;
        s.vel *= 0.92;
        s.target = Math.round(s.pos);
      } else {
        s.vel = 0;
        s.pos += (s.target - s.pos) * (s.reduce ? 1 : 0.14);
        if (Math.abs(s.target - s.pos) < 0.001) s.pos = s.target;
      }
    }
    setPos(s.pos);
    s.raf = s.dragging || s.vel || s.pos !== s.target ? requestAnimationFrame(tick) : 0;
  }, []);
  const kick = useCallback(() => {
    if (!st.current.raf) st.current.raf = requestAnimationFrame(tick);
  }, [tick]);
  const goTo = useCallback(
    (t: number) => {
      const s = st.current;
      s.vel = 0;
      s.target = t;
      if (s.reduce) s.pos = t;
      kick();
    },
    [kick],
  );
  const nearest = (i: number) => {
    const c = Math.round(st.current.pos);
    let d = (((i - c) % n) + n) % n;
    if (d > n / 2) d -= n;
    return c + d;
  };

  useEffect(() => {
    const s = st.current;
    s.reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const layout = () => {
      const cw = firstCard.current?.offsetWidth ?? 230;
      setRadius(Math.round((cw + 56) / (2 * Math.sin((STEP * Math.PI) / 360))));
    };
    layout();
    window.addEventListener("resize", layout);
    return () => {
      window.removeEventListener("resize", layout);
      cancelAnimationFrame(s.raf);
    };
  }, []);

  const onDown = (e: RPointerEvent) => {
    const s = st.current;
    s.dragging = true;
    s.moved = false;
    s.lastX = e.clientX;
    s.vel = 0;
    stage.current?.setPointerCapture(e.pointerId);
    kick();
  };
  const onMove = (e: RPointerEvent) => {
    const s = st.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    s.lastX = e.clientX;
    if (Math.abs(dx) > 2) s.moved = true;
    const dp = -dx / 260;
    s.pos += dp;
    s.vel = dp;
  };
  const onUp = () => {
    const s = st.current;
    if (!s.dragging) return;
    s.dragging = false;
    if (s.reduce) {
      s.vel = 0;
      s.target = Math.round(s.pos);
    }
    kick();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") (e.preventDefault(), goTo(Math.round(st.current.pos) - 1));
    if (e.key === "ArrowRight") (e.preventDefault(), goTo(Math.round(st.current.pos) + 1));
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={labels.region}>
      <div
        ref={stage}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="relative mt-6 h-[420px] cursor-grab select-none overflow-x-clip outline-offset-4 [perspective-origin:50%_32%] [perspective:1100px] [touch-action:pan-y] active:cursor-grabbing md:h-[520px] md:[perspective:1500px]"
      >
        <div aria-hidden className="absolute inset-x-0 bottom-0 top-[64%] bg-[#EEF4E6] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[rgb(5_42_34/.06)]" />
        <div className="absolute left-1/2 top-10 size-0 [transform-style:preserve-3d]" style={{ transform: `translateZ(${-radius}px) rotateX(-4deg)` }}>
          {items.map((m, i) => {
            let s = (((i - pos) % n) + n) % n;
            if (s > n / 2) s -= n;
            const d = Math.abs(s);
            const active = i === idx;
            return (
              <div
                key={m.id}
                ref={i === 0 ? firstCard : undefined}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${n}: ${m.title}`}
                aria-hidden={!active}
                onClick={() => !st.current.moved && goTo(nearest(i))}
                className="absolute left-[-95px] top-0 h-[252px] w-[190px] [backface-visibility:hidden] [transform-style:preserve-3d] md:left-[-115px] md:h-[306px] md:w-[230px]"
                style={{
                  transform: `rotateY(${s * STEP}deg) translateZ(${radius}px) scale(${1 - Math.min(d, 2) * 0.07})`,
                  zIndex: 100 - Math.round(d * 10),
                  opacity: d > 2.6 ? 0 : 1 - d * 0.16,
                  pointerEvents: d > 2.6 ? "none" : undefined,
                }}
              >
                <span className="absolute inset-x-0 bottom-[calc(100%+12px)] whitespace-nowrap text-center text-[13px] font-semibold uppercase lg:text-[11px] tracking-[0.14em] text-slate">{m.label}</span>
                <div className={cn("absolute inset-0 rounded-[22px] bg-white p-[7px]", active ? "shadow-[0_0_0_3px_#FECF49,0_26px_40px_-24px_rgb(5_42_34/.55)]" : "shadow-[0_18px_30px_-22px_rgb(5_42_34/.5)]")}>
                  <Img src={m.image} alt={m.alt} sizes="(max-width: 767px) 190px, 230px" draggable={false} className="pointer-events-none h-full w-full rounded-[16px] object-cover" />
                </div>
                {/* reflection: flipped copy, 18 %, masked (the only functional fade), 1.5 px blur */}
                <div aria-hidden className="mr-refl absolute inset-x-0 top-full mt-[10px] h-full">
                  <div className="absolute inset-0 rounded-[22px] bg-white p-[7px]">
                    <Img src={m.image} alt="" sizes="(max-width: 767px) 190px, 230px" className="h-full w-full rounded-[16px] object-cover" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* caption: date chip, title, one line */}
      <div className="mx-auto mt-1 min-h-[120px] max-w-[40rem] px-4 text-center" aria-live="polite">
        <span className="inline-flex rounded-full bg-ink px-3 py-1.5 text-[13px] font-bold tabular-nums text-white">{cur.year ?? labels.yearUnknown}</span>
        <p className="mt-2.5 font-display text-[26px] font-bold leading-tight tracking-[-0.02em] text-ink">{cur.title}</p>
        <p className="mt-1.5 text-[16px] leading-normal text-slate">{cur.caption}</p>
        {cur.href ? (
          <Link href={cur.href} className="tlink">
            <span>{labels.open}</span>
            <ArrowUpRight aria-hidden />
          </Link>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button type="button" onClick={() => goTo(Math.round(st.current.pos) - 1)} aria-label={labels.prev} className="paper-round">
          <ArrowLeft aria-hidden />
        </button>
        <div className="flex">
          {items.map((m, i) => (
            <button key={m.id} type="button" data-hit-area onClick={() => goTo(nearest(i))} aria-label={`${i + 1}: ${m.title}`} aria-current={i === idx ? "true" : undefined} className="grid h-11 w-5 place-items-center">
              <span className={cn("block h-2 rounded-full transition-all", i === idx ? "w-[22px] bg-orange" : "w-2 bg-[#B9CDA8]")} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => goTo(Math.round(st.current.pos) + 1)} aria-label={labels.next} className="paper-round paper-round--dark">
          <ArrowRight aria-hidden />
        </button>
      </div>
    </div>
  );
}

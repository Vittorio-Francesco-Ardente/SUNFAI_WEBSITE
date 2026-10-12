"use client";

import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type WheelEvent } from "react";
import { ArrowLeft, ArrowRight, Hand } from "lucide-react";
import { Img } from "@/components/ui/Img";

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

type DragStart = { x: number; y: number; pointerId: number };

/**
 * La stanza dei ricordi: a USER-CONTROLLED curved photography wall.
 * No timers, autoplay, scroll hijack or CSS keyframe movement.
 * Change photos with arrows, swipe/drag, horizontal trackpad or keyboard.
 * Preserve vertical page scrolling on touch devices.
 */
export function MemoryRoom({ items, labels }: { items: Memory[]; labels: Labels }) {
  const [active, setActive] = useState(0);
  const start = useRef<DragStart | null>(null);
  const wheelTravel = useRef(0);
  const wheelLast = useRef(0);
  const count = items.length;

  const move = useCallback((direction: number) => {
    if (!count) return;
    setActive((previous) => (previous + direction % count + count) % count);
  }, [count]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    start.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const origin = start.current;
    start.current = null;
    if (!origin || origin.pointerId !== event.pointerId) return;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) move(dx < 0 ? 1 : -1);
  };
  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    // Only a true horizontal gesture moves the gallery. Never steal vertical scrolling.
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.25) return;
    const now = performance.now();
    if (now - wheelLast.current > 380) wheelTravel.current = 0;
    wheelLast.current = now;
    wheelTravel.current += event.deltaX;
    if (Math.abs(wheelTravel.current) >= 85) {
      move(wheelTravel.current > 0 ? 1 : -1);
      wheelTravel.current = 0;
    }
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
  };

  if (!count) return null;

  return (
    <section className="mx-auto w-full max-w-[1440px]" aria-label={labels.region}>
      <p className="sr-only" aria-live="polite">
        {labels.live.replace("{n}", String(active + 1)).replace("{total}", String(count)).replace("{title}", items[active].title)}
      </p>
      <div
        data-memory-manual="true"
        data-memory-active={active}
        role="region"
        aria-label={labels.region}
        aria-roledescription="galleria fotografica manuale"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { start.current = null; }}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        className="relative isolate mx-auto h-[265px] w-full cursor-grab select-none overflow-hidden rounded-[26px] border border-ink/10 bg-[#f9fbf6] shadow-[0_10px_30px_-26px_rgb(5_42_34/.3)] outline-offset-4 active:cursor-grabbing sm:h-[340px] sm:rounded-[30px] lg:h-[460px] lg:rounded-[36px]"
        style={{ perspective: "1100px", touchAction: "pan-y", ['--memory-step' as string]: "clamp(185px, 26vw, 354px)" }}
      >
        {items.map((item, i) => {
          let distance = i - active;
          if (distance > count / 2) distance -= count;
          if (distance < -count / 2) distance += count;
          const delta = Math.abs(distance);
          if (delta > 3) return null;
          const tilt = distance === 0 ? 0 : distance < 0 ? Math.min(30, delta * 12) : -Math.min(30, delta * 12);
          const visible = delta <= 2.5;
          const photoStyle: CSSProperties = {
            left: "50%",
            top: "50%",
            zIndex: 10 - delta,
            opacity: visible ? 1 : 0,
            transform: `translate(-50%, -50%) translateX(calc(var(--memory-step) * ${distance})) translateY(${delta * 5}px) rotateY(${tilt}deg) scale(${1 - delta * 0.085})`,
            pointerEvents: "none",
            backfaceVisibility: "hidden",
          };
          return (
            <figure
              data-memory-image={item.id}
              key={item.id}
              aria-hidden={i !== active}
              className="absolute aspect-[1.35] w-[min(65vw,390px)] overflow-hidden rounded-[18px] border-[3px] border-white bg-white shadow-[0_14px_30px_-22px_rgb(5_42_34/.32)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none sm:aspect-[1.55] sm:w-[min(45vw,395px)] lg:aspect-[1.57] lg:w-[min(31vw,420px)]"
              style={photoStyle}
            >
              <Img src={item.image} alt={i === active ? item.alt : ""} sizes="(min-width: 1024px) 420px, (min-width: 640px) 45vw, 65vw" className="h-full w-full object-cover" draggable={false} />
            </figure>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <button type="button" onClick={() => move(-1)} aria-label={labels.prev} className="paper-round"><ArrowLeft aria-hidden /></button>
        <span className="min-w-[78px] text-center font-display text-[17px] font-bold tabular-nums text-ink">
          {String(active + 1).padStart(2, "0")} <span className="text-slate">/ {String(count).padStart(2, "0")}</span>
        </span>
        <button type="button" onClick={() => move(1)} aria-label={labels.next} className="paper-round paper-round--dark"><ArrowRight aria-hidden /></button>
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate sm:ml-3"><Hand aria-hidden className="size-4" /> Trascina per sfogliare</span>
      </div>
      <ol className="sr-only">
        {items.map((item) => <li key={item.id}>{item.year ?? labels.yearUnknown}: {item.title}. {item.caption}</li>)}
      </ol>
    </section>
  );
}

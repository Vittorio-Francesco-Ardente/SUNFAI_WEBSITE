"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode, type TouchEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type Slide = { key: string; label: string; content: ReactNode };

/**
 * SUN-FAI member-profile gallery.
 * Finite, responsive pages instead of a clipped scroll-snap rail:
 * every thumbnail is fully contained in the plate, on every member profile.
 * A click advances ONE image, preserving a full 4/3/2/1-image viewport.
 * Dots now represent valid start positions, so the last state is never a half-visible image.
 */
export function ProfileGallery({ slides, labels }: { slides: Slide[]; labels: { region: string; prev: string; next: string } }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [slots, setSlots] = useState(1);
  const [requestedStart, setRequestedStart] = useState(0);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const measure = () => {
      const width = node.clientWidth;
      // The actual profile column width is more important than window width:
      // this rail lives inside a 58%-width desktop column.
      setSlots(width >= 760 ? 4 : width >= 550 ? 3 : width >= 385 ? 2 : 1);
    };
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const visible = Math.min(Math.max(1, slots), Math.max(1, slides.length));
  const lastStart = Math.max(0, slides.length - visible);
  const first = Math.min(requestedStart, lastStart);
  const canBack = first > 0;
  const canNext = first < lastStart;

  const go = useCallback((next: number) => {
    setRequestedStart(Math.max(0, Math.min(lastStart, next)));
  }, [lastStart]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(first - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(first + 1);
    }
  };

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    const end = event.changedTouches[0];
    touchStart.current = null;
    if (!start || !end) return;
    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    // Ignore normal vertical page scrolling and very small accidental drags.
    if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
    go(first + (dx < 0 ? 1 : -1));
  };

  return (
    <div
      ref={frameRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.region}
      aria-keyshortcuts="ArrowLeft ArrowRight"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="min-w-0 w-full max-w-full overflow-hidden rounded-[28px] bg-[#FFF7F0]/90 p-3 outline-offset-4 sm:p-4"
      style={{ touchAction: "pan-y" }}
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {first + 1}–{Math.min(first + visible, slides.length)} / {slides.length}
      </p>
      <ul
        className="grid min-w-0 w-full gap-3"
        style={{ gridTemplateColumns: `repeat(${visible}, minmax(0, 1fr))` }}
      >
        {slides.slice(first, first + visible).map((slide) => (
          <li
            key={slide.key}
            aria-label={slide.label}
            className="relative min-w-0 aspect-square overflow-hidden rounded-[18px] bg-white shadow-[0_12px_24px_-20px_rgb(5_42_34/.5)] sm:rounded-[20px]"
          >
            {slide.content}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-1" role="group" aria-label={labels.region}>
          {Array.from({ length: lastStart + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1} / ${lastStart + 1}`}
              aria-current={i === first ? "true" : undefined}
              onClick={() => go(i)}
              className="grid h-11 w-7 shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-orange"
            >
              <span aria-hidden className={cn("block h-2 rounded-full transition-[width,background-color] duration-150", i === first ? "w-5 bg-orange" : "w-2 bg-ink/20")} />
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => go(first - 1)} disabled={!canBack} aria-label={labels.prev} className="paper-round disabled:opacity-35">
            <ArrowLeft aria-hidden />
          </button>
          <button type="button" onClick={() => go(first + 1)} disabled={!canNext} aria-label={labels.next} className="paper-round paper-round--dark disabled:opacity-35">
            <ArrowRight aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

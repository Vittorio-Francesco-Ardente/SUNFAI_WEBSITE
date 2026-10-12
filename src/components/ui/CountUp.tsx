"use client";

import { useEffect, useRef, useState } from "react";

const fmt = (v: number, decimals: number) => {
  const fixed = v.toFixed(decimals);
  const [i, dec] = fixed.split(".");
  return `${i.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${dec ? `,${dec}` : ""}`;
};

/**
 * Counter (pack 01.4 §5): counts up once when 50 % visible (800 ms ease-out, time-based), tabular numerals.
 * SSR/no-JS/reduced motion show the final value. Hovered again after 10 s → quick 300 ms recount.
 */
export function CountUp({ value, decimals = 0, className }: { value: number; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const last = useRef(0);

  const run = (ms: number) => {
    if (matchMedia("(prefers-reduced-motion: reduce), (hover: none), (max-width: 767px)").matches) return;
    const t0 = performance.now();
    last.current = Date.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      setShown(value * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce), (hover: none), (max-width: 767px)").matches || /[?&]test/.test(location.search)) return;
    let started = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          started = true;
          setShown(0);
          run(Math.min(1200, 800));
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
      onMouseEnter={() => {
        if (Date.now() - last.current > 10000) run(300);
      }}
    >
      {fmt(shown, decimals)}
    </span>
  );
}

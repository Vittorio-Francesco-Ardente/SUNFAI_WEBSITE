"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { pad2 } from "@/lib/motion";
import type { Locale } from "@/lib/i18n";
import { MemberCard } from "./MemberCard";
import type { MemberLite } from "./MemberVisual";

/**
 * Team rail (demo team-rail.tsx): native scroll-snap (smooth on touch, no vertical scroll trap), arrows,
 * counter and progress bar; ←/→ on the focused rail. aria-roledescription="carousel".
 */
export function TeamRail({ members, locale, labels, photoComing }: { members: MemberLite[]; locale: Locale; labels: { region: string; prev: string; next: string }; photoComing: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [first, setFirst] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(4);

  const step = () => {
    const el = ref.current;
    const card = el?.querySelector("li");
    return card ? card.getBoundingClientRect().width + 12 : 260;
  };
  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const s = step();
    setFirst(Math.min(members.length - 1, Math.round(el.scrollLeft / s)));
    setVisible(Math.max(1, Math.round(el.clientWidth / s)));
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
  }, [members.length]);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const by = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * step(), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

  return (
    <div role="region" aria-roledescription="carousel" aria-label={labels.region}>
      <ul
        ref={ref}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") (e.preventDefault(), by(1));
          if (e.key === "ArrowLeft") (e.preventDefault(), by(-1));
        }}
        className="rail rail--small pb-3 md:[--rail-item:calc((100%-36px)/4)]"
      >
        {members.map((m) => (
          <li key={m.slug}>
            <MemberCard m={m} locale={locale} photoComing={photoComing} usePose={!!m.pose} />
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center gap-5">
        <p className="shrink-0 text-[15px] text-slate">
          <span className="font-display text-lg font-extrabold text-ink">{pad2(Math.min(members.length, first + visible))}</span> / {pad2(members.length)}
        </p>
        <div className="relative h-[2px] flex-1 rounded-full bg-ink/12" aria-hidden>
          <span className="absolute inset-y-[-1px] left-0 rounded-full bg-orange transition-[width] duration-300" style={{ width: `${Math.max(12, progress * 100)}%` }} />
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => by(-1)} aria-label={labels.prev} className="paper-round" disabled={progress <= 0.001}>
            <ArrowLeft aria-hidden />
          </button>
          <button type="button" onClick={() => by(1)} aria-label={labels.next} className="paper-round paper-round--dark" disabled={progress >= 0.999}>
            <ArrowRight aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

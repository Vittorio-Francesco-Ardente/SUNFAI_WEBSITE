"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Img } from "@/components/ui/Img";

export interface OltreCarouselItem {
  image: string;
  alt: string;
  text: string;
}

function getCols() {
  if (typeof window === "undefined") return 1;
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

export function OltreCarousel({ items }: { items: OltreCarouselItem[] }) {
  const [cols, setCols] = useState(1);
  const [page, setPage] = useState(0);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const sync = () => setCols(getCols());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const pages = useMemo(() => {
    const groups: OltreCarouselItem[][] = [];
    for (let i = 0; i < items.length; i += cols) groups.push(items.slice(i, i + cols));
    return groups;
  }, [cols, items]);

  useEffect(() => {
    setPage((current) => Math.min(current, Math.max(0, pages.length - 1)));
  }, [pages.length]);

  const prev = () => setPage((current) => Math.max(0, current - 1));
  const next = () => setPage((current) => Math.min(pages.length - 1, current + 1));

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Altri servizi SUN-FAI" tabIndex={0} onKeyDown={onKey} className="reveal outline-offset-4">
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-slate">
          {page + 1}/{Math.max(1, pages.length)}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={page === 0}
            aria-label="Slide precedente"
            className="paper-round disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={page === pages.length - 1}
            aria-label="Slide successiva"
            className="paper-round disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] touch-pan-y" onTouchStart={(e) => { touchX.current = e.touches[0]?.clientX ?? null; }} onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const delta = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
        touchX.current = null;
        if (delta < -45) next();
        else if (delta > 45) prev();
      }}>
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${page * 100}%)` }}>
          {pages.map((group, groupIndex) => (
            <div key={groupIndex} className="min-w-full">
              <ul className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${group.length === 2 && cols === 3 ? "lg:mx-auto lg:max-w-[840px] lg:grid-cols-2" : ""}`}>
                {group.map((item) => (
                  <li key={item.text}>
                    <article className="card hover-card flex h-full flex-col overflow-hidden">
                      <div className="border-b border-[var(--color-hairline)] bg-[#fcfbf7] p-5">
                        <Img src={item.image} alt={item.alt} sizes="(max-width: 639px) 88vw, (max-width: 1023px) 42vw, 28vw" className="hc-scene aspect-[4/3] h-auto w-full object-contain" />
                      </div>
                      <div className="flex flex-1 items-start p-5 sm:p-6">
                        <p className="text-[16px] font-medium leading-relaxed text-ink">{item.text}</p>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {pages.length > 1 ? (
        <div className="mt-5 flex justify-center gap-2" aria-label="Pagine carosello">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Vai alla pagina ${i + 1}`}
              aria-pressed={i === page}
              className={`h-2.5 rounded-full transition-all ${i === page ? "w-8 bg-ink" : "w-2.5 bg-ink/20"}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

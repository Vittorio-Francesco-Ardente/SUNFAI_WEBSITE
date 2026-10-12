"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Globe2, X } from "lucide-react";
import { LinkedinIcon } from "@/components/ui/SocialIcons";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/cn";

const LINKEDIN = "https://www.linkedin.com/in/vittorio-ardente-812775388/";
const PORTFOLIO = "https://vittorio-francesco-ardente.github.io/";

/** Easter egg accessibile: la mascotte resta il trigger; la scheda è consultabile anche con tastiera. */
export function CreatorEasterEgg({ children, className, label = "Scopri un piccolo segreto di SUN-FAI" }: { children: ReactNode; className?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => close.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key !== "Tab") return;
      const nodes = Array.from(dialog.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        ref={opener}
        aria-label={label}
        title={label}
        onClick={() => setOpen(true)}
        className={cn("group cursor-pointer focus-visible:rounded-[24px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange", className)}
      >
        <span className="pointer-events-none block transition-transform duration-200 ease-out group-hover:scale-[1.025] group-active:scale-[.98] motion-reduce:transition-none">{children}</span>
      </button>
      {open && typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-3 py-4 sm:px-6 sm:py-8" data-creator-modal>
          <button type="button" tabIndex={-1} className="absolute inset-0 cursor-default bg-[#052A22]/80" aria-label="Chiudi i crediti" onClick={() => setOpen(false)} />
          <section
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="creator-title"
            aria-describedby="creator-desc"
            className="relative z-[1] max-h-[min(94dvh,800px)] w-full max-w-[660px] overflow-y-auto rounded-[28px] border border-ink/10 bg-[#FAF8F2] p-5 shadow-[0_24px_90px_-22px_rgb(0_0_0/.4)] sm:rounded-[32px] sm:p-9"
          >
            <button
              type="button"
              ref={close}
              aria-label="Chiudi"
              onClick={() => setOpen(false)}
              className="paper-round absolute right-4 top-4 z-[2] !size-10 bg-white sm:right-6 sm:top-6"
            >
              <X aria-hidden className="size-5" />
            </button>

            <p className="pr-12 text-[12px] font-bold uppercase tracking-[.15em] text-orange-text">Una firma nascosta nel sito</p>
            <div className="mt-6 grid items-center gap-6 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-8">
              <div className="relative mx-auto w-full max-w-[220px] overflow-hidden rounded-[22px] border border-ink/10 bg-white sm:max-w-none">
                <Img
                  src="/people/creator-vittorio-francesco-ardente.webp"
                  alt="Ritratto di Vittorio Francesco Ardente"
                  sizes="(max-width: 639px) 220px, 220px"
                  eager
                  className="aspect-[4/5] h-auto w-full object-cover object-center"
                />
              </div>
              <div className="min-w-0 text-center sm:text-left">
                <p className="font-display text-[13px] font-bold uppercase tracking-[.1em] text-leaf-text">Dietro il progetto</p>
                <h2 id="creator-title" className="mt-2 font-display text-[clamp(1.85rem,4.4vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-ink">Vittorio Francesco Ardente<span className="text-orange-text">.</span></h2>
                <p id="creator-desc" className="mt-4 text-[15px] leading-relaxed text-slate">
                  Ideazione, identità visiva, design e sviluppo del sito web SUN-FAI.
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-slate">Un progetto digitale pensato per raccontare in modo più chiaro le persone, il territorio e l'energia condivisa.</p>
              </div>
            </div>

            <div className="mt-7 border-t border-ink/10 pt-6">
              <p className="mb-3 text-[12px] font-bold uppercase tracking-[.1em] text-slate">Trovi altri progetti qui</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <a
                  href={LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Profilo LinkedIn di Vittorio Francesco Ardente, apre una nuova scheda"
                  className="group flex min-h-14 items-center gap-3 rounded-[16px] border border-ink/10 bg-white px-4 text-[15px] font-semibold text-ink transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange motion-reduce:transform-none"
                >
                  <LinkedinIcon className="size-5 shrink-0" />
                  <span className="flex-1">LinkedIn</span>
                  <ArrowUpRight aria-hidden className="size-4 text-ink/60" />
                </a>
                <a
                  href={PORTFOLIO}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Portfolio di Vittorio Francesco Ardente, apre una nuova scheda"
                  className="group flex min-h-14 items-center gap-3 rounded-[16px] border border-ink/10 bg-white px-4 text-[15px] font-semibold text-ink transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange motion-reduce:transform-none"
                >
                  <Globe2 aria-hidden className="size-5 shrink-0" />
                  <span className="flex-1">Portfolio</span>
                  <ArrowUpRight aria-hidden className="size-4 text-ink/60" />
                </a>
              </div>
            </div>
            <div className="mt-6 flex justify-center sm:justify-end">
              <button type="button" onClick={() => setOpen(false)} className="btn btn--dark btn--sm">Torna al sito</button>
            </div>
          </section>
        </div>, document.body) : null}
    </>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/cn";

/** Hidden, accessible creator credits. The mascot itself is the trigger. */
export function CreatorEasterEgg({ children, className, label = "Scopri un piccolo segreto di SUN-FAI" }: { children: ReactNode; className?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focus = requestAnimationFrame(() => close.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab") {
        // Both controls are deliberately kept in this small dialog.
        const nodes = document.querySelectorAll<HTMLElement>("[data-creator-modal] section button");
        const first = nodes[0]; const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(focus);
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      opener.current?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <button type="button" ref={opener} aria-label={label} title={label} onClick={() => setOpen(true)} className={cn("group cursor-pointer focus-visible:rounded-[24px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange", className)}>
        <span className="pointer-events-none block transition-transform duration-200 ease-out group-hover:scale-[1.025] group-active:scale-[.98] motion-reduce:transition-none">{children}</span>
      </button>
      {open && typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6" data-creator-modal>
          <button type="button" className="absolute inset-0 cursor-default bg-[#052A22]/75" aria-label="Chiudi i crediti" onClick={() => setOpen(false)} />
          <section role="dialog" aria-modal="true" aria-labelledby="creator-title" aria-describedby="creator-desc" className="relative z-[1] w-full max-w-[440px] overflow-hidden rounded-[30px] border border-ink/10 bg-[#faf7f0] p-6 shadow-[0_24px_90px_-22px_rgb(0_0_0/.45)] sm:p-8">
            <button type="button" ref={close} aria-label="Chiudi" onClick={() => setOpen(false)} className="paper-round absolute right-4 top-4 z-[2] !size-10 bg-white"><X aria-hidden /></button>
            <p className="mb-4 text-[12px] font-bold uppercase tracking-[.16em] text-orange-text">Un piccolo segreto SUN-FAI</p>
            <div className="mx-auto mb-5 size-[clamp(160px,44vw,220px)] overflow-hidden rounded-[26px] bg-white shadow-[inset_0_0_0_1px_rgb(5_42_34/.1)]">
              <Img src="/people/creator-vittorio-francesco-ardente.webp" alt="Fotografia del creatore del sito" sizes="220px" className="h-full w-full object-cover" />
            </div>
            <p className="text-center text-[13px] font-semibold uppercase tracking-[.10em] text-leaf-text">Dietro queste pagine</p>
            <h2 id="creator-title" className="mt-2 text-center font-display text-[clamp(1.65rem,5vw,2rem)] font-extrabold leading-tight tracking-[-0.04em] text-ink">Vittorio Francesco Ardente<span className="dot">.</span></h2>
            <p id="creator-desc" className="mt-3 text-center text-[15px] leading-relaxed text-slate">Ideazione, design e sviluppo del sito web SUN-FAI.</p>
            <div className="mt-6 flex justify-center"><button type="button" onClick={() => setOpen(false)} className="btn btn--dark btn--md">Torna al sito</button></div>
          </section>
        </div>, document.body) : null}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/cn";
import { EASE_OUT_SOFT } from "@/lib/motion";

export type Step = { title: string; text: string; image?: string; alt?: string; tag?: string };

/**
 * Pinned storytelling (pack 01.4 §6): desktop ≥ 1024 px only, ≈ 150 vh, the step illustrations cross-fade and a
 * progress arc fills. Phones, reduced motion and no-JS: a plain vertical numbered list (the SSR markup).
 */
export function PinnedSteps({ steps, progressLabel, tone = "orange", numbered = true }: { steps: readonly Step[]; progressLabel: string; tone?: "orange" | "leaf"; numbered?: boolean }) {
  const [pin, setPin] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(min-width: 1024px) and (min-height: 670px) and (prefers-reduced-motion: no-preference)");
    const set = () => setPin(mq.matches && !/[?&]test/.test(location.search));
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return pin ? <Pinned steps={steps} progressLabel={progressLabel} tone={tone} numbered={numbered} /> : <List steps={steps} tone={tone} numbered={numbered} />;
}

function List({ steps, tone, numbered }: { steps: readonly Step[]; tone: string; numbered: boolean }) {
  return (
    <ol className="grid min-w-0 gap-4 md:gap-6">
      {steps.map((s, i) => (
        <li key={s.title} className="reveal min-w-0">
          <article className="card min-w-0 overflow-hidden">
            {s.image ? (
              <div className="border-b border-[var(--color-hairline)] bg-[#fcfbf7] p-4 sm:p-5">
                <Img src={s.image} alt={s.alt ?? ""} sizes="(max-width: 1023px) 85vw, 40vw" className="mx-auto aspect-[4/3] h-auto w-full max-w-[420px] object-contain" />
              </div>
            ) : null}
            <div className="min-w-0 p-5 sm:p-6">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                {numbered ? (
                  <span className={cn("grid size-10 shrink-0 place-items-center rounded-full border-[3px] border-white font-display text-[15px] font-extrabold text-white shadow-sm sm:size-11", tone === "leaf" ? "bg-logo-green" : "bg-orange-btn")} aria-hidden>
                    {i + 1}
                  </span>
                ) : null}
                <div className="min-w-0 flex-1">
                  {s.tag ? <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-orange-text">{s.tag}</p> : null}
                  <h3 className="t-h3 !m-0 break-words">{s.title}</h3>
                </div>
              </div>
              <p className="t-body mt-3 !text-[16px]">{s.text}</p>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}

function Pinned({ steps, progressLabel, tone, numbered }: { steps: readonly Step[]; progressLabel: string; tone: string; numbered: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const [p, setP] = useState(0);
  const lastP = useRef(-1);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (Math.abs(v - lastP.current) > .025 || v <= 0 || v >= 1) {
      lastP.current = v;
      setP(v);
    }
    const next = Math.min(steps.length - 1, Math.floor(v * steps.length * 0.999));
    setActive((previous) => previous === next ? previous : next);
  });
  const r = 44;
  const c = Math.PI * r; // half arc (sun-like)
  const color = tone === "leaf" ? "#478A2B" : "#F26722";
  return (
    <div ref={ref} style={{ height: `${Math.max(220, steps.length * 75)}vh` }} className="relative">
      <div className="sticky top-[clamp(78px,10vh,118px)] grid min-h-[min(73vh,710px)] items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <svg viewBox="0 0 100 56" className="w-[150px]" aria-hidden>
            <path d={`M6 50 A${r} ${r} 0 0 1 94 50`} fill="none" stroke="rgb(5 42 34 / .1)" strokeWidth="9" strokeLinecap="round" />
            <path d={`M6 50 A${r} ${r} 0 0 1 94 50`} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${c * Math.max(0.02, p)} ${c}`} />
            <text x="50" y="49" textAnchor="middle" fontSize="16" fontWeight="800" fill="var(--color-ink)">
              {active + 1}/{steps.length}
            </text>
          </svg>
          <p className="sr-only" aria-live="polite">
            {progressLabel.replace("{n}", String(active + 1)).replace("{total}", String(steps.length))}
          </p>
          <ol className="mt-6 grid gap-2">
            {steps.map((s, i) => (
              <li key={s.title} className={cn("flex gap-4 rounded-[20px] p-4 transition-colors duration-300", i === active ? "card" : "opacity-55")}>
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-full font-display text-[15px] font-extrabold", i === active ? (tone === "leaf" ? "bg-logo-green text-white" : "bg-orange-btn text-white") : "bg-paper-2 text-ink")}>
                  {numbered ? i + 1 : ""}
                </span>
                <div>
                  {s.tag ? <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-orange-text">{s.tag}</p> : null}
                  <h3 className="t-h3">{s.title}</h3>
                  <AnimatePresence initial={false}>
                    {i === active ? (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: EASE_OUT_SOFT }} className="t-body overflow-hidden pt-2 !text-[16px]">
                        {s.text}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative lg:col-span-7">
          <article className="card relative mx-auto flex w-full max-w-[760px] flex-col overflow-hidden bg-[#fcfbf7] shadow-[0_16px_45px_-35px_rgba(5,42,34,.28)]">
            <div className="relative flex h-[clamp(230px,30vw,390px)] items-center justify-center overflow-hidden border-b border-[var(--color-hairline)] bg-[#fcfbf7] p-5 lg:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={`visual-${active}`} className="absolute inset-5 lg:inset-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: EASE_OUT_SOFT }}>
                  {steps[active].image ? <Img src={steps[active].image!} alt={steps[active].alt ?? steps[active].title} sizes="(min-width:1024px) 46vw, 85vw" className="h-full w-full object-contain" /> : <div className="flex h-full items-center justify-center rounded-2xl bg-mint text-center font-display text-3xl font-bold text-ink">{steps[active].title}</div>}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="min-w-0 p-5 lg:p-8">
              <span className="text-[13px] font-bold uppercase tracking-[.08em] text-orange-text">{String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
              <h3 className="mt-2 font-display text-[clamp(1.35rem,1.1rem+1vw,1.85rem)] font-extrabold leading-tight text-ink">{steps[active].title}</h3>
              <p className="mt-2 max-w-[58ch] text-[16px] leading-relaxed text-slate">{steps[active].text}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

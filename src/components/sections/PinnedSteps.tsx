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
    const mq = matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const set = () => setPin(mq.matches && !/[?&]test/.test(location.search));
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return pin ? <Pinned steps={steps} progressLabel={progressLabel} tone={tone} numbered={numbered} /> : <List steps={steps} tone={tone} numbered={numbered} />;
}

function List({ steps, tone, numbered }: { steps: readonly Step[]; tone: string; numbered: boolean }) {
  return (
    <ol className="relative grid gap-6 pl-12 before:absolute before:bottom-6 before:left-[19px] before:top-4 before:w-[2px] before:rounded before:bg-ink/10">
      {steps.map((s, i) => (
        <li key={s.title} className="reveal relative">
          <span className={cn("absolute -left-12 top-0 grid size-10 place-items-center rounded-full font-display text-[15px] font-extrabold text-white", tone === "leaf" ? "bg-logo-green" : "bg-orange-btn")}>
            {numbered ? i + 1 : ""}
          </span>
          <div className="card overflow-hidden">
            {s.image ? (
              <div className="border-b border-[var(--color-hairline)] bg-[#fcfbf7] p-4">
                <Img src={s.image} alt={s.alt ?? ""} sizes="(max-width: 1023px) 85vw, 40vw" className="mx-auto aspect-[4/3] h-auto w-full max-w-[420px] object-contain" />
              </div>
            ) : null}
            <div className="p-5 sm:p-6">
              {s.tag ? <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-orange-text">{s.tag}</p> : null}
              <h3 className="t-h3 mt-1">{s.title}</h3>
              <p className="t-body mt-2 !text-[16px]">{s.text}</p>
            </div>
          </div>
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
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setP(v);
    setActive(Math.min(steps.length - 1, Math.floor(v * steps.length * 0.999)));
  });
  const r = 44;
  const c = Math.PI * r; // half arc (sun-like)
  const color = tone === "leaf" ? "#478A2B" : "#F26722";
  const hasImages = steps.some((s) => s.image);
  return (
    <div ref={ref} style={{ height: `${Math.max(150, steps.length * 45)}vh` }} className="relative">
      <div className="sticky top-[12vh] grid min-h-[70vh] items-center gap-12 lg:grid-cols-12">
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
          {hasImages ? (
            <div className="card relative aspect-[4/3] overflow-hidden bg-[#fcfbf7] p-8">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div key={active} className="absolute inset-8" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: EASE_OUT_SOFT }}>
                  {steps[active].image ? <Img src={steps[active].image!} alt={steps[active].alt ?? ""} sizes="50vw" className="h-full w-full object-contain" /> : null}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="relative grid aspect-[4/3] place-items-center">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45, ease: EASE_OUT_SOFT }} className="font-display text-[clamp(8rem,6rem+8vw,16rem)] font-extrabold leading-none tracking-[-0.06em]" style={{ color }}>
                  0{active + 1}
                </motion.p>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

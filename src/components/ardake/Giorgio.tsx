"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Route, X } from "lucide-react";
import { Img } from "@/components/ui/Img";
import { lhref, type Locale } from "@/lib/i18n";
import { EASE_OUT_SOFT } from "@/lib/motion";
import { presenters } from "@/content/team";
import type { Dict } from "@/content/dict";

type G = Dict["ardake"]["giorgio"];
type TopicKey = keyof G["topics"];
type Topic = { title: string; body: string; more?: string };
type Mode = "idle" | "tour" | "single" | "outro";
type State = { mode: Mode; step: number; total: number; topic: Topic | null; topicKey: string; side: "left" | "right"; el: HTMLElement | null };
type Ctx = { explain: (topic: TopicKey, el: HTMLElement | null) => void; start: () => void; label: (topic: TopicKey) => string; startLabel: string; tour: boolean };

const GiorgioCtx = createContext<Ctx | null>(null);
const IDLE: State = { mode: "idle", step: -1, total: 0, topic: null, topicKey: "", side: "right", el: null };
const doneKey = (page: string) => `sf-tour-done:${page}`;
const safeGet = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const safeSet = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};
const STAGE = { w: 260, h: 346 };

/** Only on smartphones: short, complete explanations; the full text is unchanged on tablets/desktop. */
function compactTopicBody(topicKey: string, body: string, locale: Locale): string {
  const italian: Record<string, string> = {
    ardake: "Ardaké, sviluppata da SUN-FAI, ti mostra produzione, consumi ed energia condivisa della tua comunità.",
    configurazione: "Ogni configurazione riunisce i soci collegati alla stessa cabina primaria, che condividono energia tra loro.",
    "cabina-primaria": "È la cabina elettrica della tua zona. Il suo codice identifica la configurazione a cui puoi aderire.",
    "quarto-orario": "L'energia condivisa viene calcolata ogni 15 minuti, confrontando produzione e consumi nello stesso intervallo.",
    "ultimi-15-minuti": "Mostra l'energia prodotta nell'ultimo quarto d'ora registrato.",
    "totale-periodo": "È l'energia prodotta nel periodo scelto. Cambia il filtro per confrontare i risultati.",
    "potenza-istantanea": "Il grafico mostra quanti kW producono gli impianti nei diversi momenti della giornata.",
    "energia-condivisa": "È l'energia prodotta da alcuni soci e consumata da altri nella stessa cabina e nello stesso quarto d'ora.",
    incentivi: "Gli incentivi del GSE arrivano alla cooperativa, che li ripartisce secondo il regolamento dei soci.",
    "prosumer-consumer": "Il prosumer produce e consuma energia; il consumer la consuma soltanto. Entrambi possono aderire.",
    kwp: "Il kWp indica la potenza massima teorica di un impianto fotovoltaico in condizioni ideali.",
    kwh: "I kW misurano la potenza istantanea, i kWh l'energia prodotta o consumata nel tempo.",
    "stato-configurazione": "La configurazione può essere attiva, in valutazione o ancora in progetto.",
  };
  if (locale === "it" && italian[topicKey]) return italian[topicKey];
  // Preserve the original language for any Bergamasco topic.
  const firstSentence = body.trim().split(/(?<=[.!?])\s+/)[0] || body;
  return firstSentence.length <= 155 ? firstSentence : `${firstSentence.slice(0, 152).trimEnd()}…`;
}

/**
 * Giorgio, V3 (pack 16.6 — controller from prompt-packs/16_FIX_VISUAL_OVERHAUL/code/giorgio-tour.ts).
 * TOUR: sections marked `data-tour-step="<topic>" data-tour-order="n"`; on the first visit (after the hero has scrolled
 * out) or from the "Fammi fare un giro" pill, Giorgio WALKS to each section in turn (spring + 2° lean), explains it,
 * follows it while the user scrolls; Indietro / Avanti / Salta il giro. At the end he leaves with a friendly final message; if the user skips early, he uses a lighter skip message. Stored as done → it never auto-starts again (only the pill restarts it).
 * SINGLE: an InfoDot opens Giorgio next to that element with ONLY that topic ([Ho capito, grazie] and ✕, no cycling).
 * Stage: a complete ground pill under him (never cut flat). Phones: 180 × 240 above the dock, panel above, he slides.
 * Non-modal dialog, focus to the title on each step, Esc closes, ← / → in the tour, live region "Passo 2 di 6".
 * Reduced motion: no walking/tilt/waving, opacity only, instant scroll.
 */
export function GiorgioProvider({ g, locale, tour, children }: { g: G; locale: Locale; /** enables the guided tour on this page */ tour?: string; topics?: TopicKey[]; greeting?: boolean; children: ReactNode }) {
  const [s, setS] = useState<State>(IDLE);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mobileMinimized, setMobileMinimized] = useState(false);
  const [vw, setVw] = useState({ w: 1440, h: 900 });
  const reduce = useReducedMotion();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const outroTimer = useRef(0);
  const topics = g.topics as Record<string, Topic>;

  const steps = useCallback(
    () =>
      [...document.querySelectorAll<HTMLElement>("[data-tour-step]")]
        .sort((a, b) => Number(a.dataset.tourOrder ?? 0) - Number(b.dataset.tourOrder ?? 0))
        .filter((el) => topics[el.dataset.tourStep!]),
    [topics],
  );

  const scrollTo = useCallback(
    (el: HTMLElement) => {
      const top = el.getBoundingClientRect().top + scrollY - Math.max(96, innerHeight * 0.14);
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    },
    [reduce],
  );

  const outro = useCallback(
    (kind: "done" | "skip" = "done") => {
      if (tour) safeSet(doneKey(tour), "1");
      const title = kind === "skip" ? g.skipTitle : g.doneTitle;
      const body = kind === "skip" ? g.skipBody : g.doneBody;
      setS((cur) => ({ ...cur, mode: "outro", step: -1, topic: { title, body }, topicKey: kind === "skip" ? "outro-skip" : "outro" }));
      window.clearTimeout(outroTimer.current);
      outroTimer.current = window.setTimeout(() => setS(IDLE), kind === "skip" ? 7600 : 5800);
    },
    [g, tour, reduce],
  );

  const go = useCallback(
    (i: number) => {
      const list = steps();
      if (i >= list.length) return outro();
      const el = list[i];
      const key = el.dataset.tourStep!;
      setS({ mode: "tour", step: i, total: list.length, topic: topics[key], topicKey: key, side: (el.dataset.tourSide as "left" | "right") ?? (i % 2 === 0 ? "right" : "left"), el });
      scrollTo(el);
    },
    [steps, topics, scrollTo, outro],
  );

  const sRef = useRef(s);
  sRef.current = s;
  /** ✕ / Esc / "Ho capito": in the tour it ends with the outro; in single mode it just closes (focus back to the "i"). */
  const close = useCallback(() => {
    const cur = sRef.current;
    if (cur.mode === "tour") return outro("skip");
    if (cur.mode === "single") {
      cur.el?.focus?.();
      setS(IDLE);
    }
    if (cur.mode === "outro") setS(IDLE);
  }, [outro]);

  const explain = useCallback((topic: TopicKey, el: HTMLElement | null) => {
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight * 0.6) window.scrollBy({ top: r.top - innerHeight * 0.3, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    const r = el?.getBoundingClientRect();
    setS({ mode: "single", step: -1, total: 1, topic: g.topics[topic] as Topic, topicKey: String(topic), side: r && r.left + r.width / 2 > innerWidth / 2 ? "left" : "right", el });
  }, [g]);

  // auto-start once per browser, after the hero has scrolled out (never in ?test, never again once done)
  useEffect(() => {
    if (!tour || safeGet(doneKey(tour)) || /[?&]test/.test(location.search)) return;
    const onScroll = () => {
      if (scrollY > innerHeight * 0.9) {
        window.removeEventListener("scroll", onScroll);
        if (sRef.current.mode === "idle") go(0);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [tour, go]);

  // A single animation-frame update PER SCROLL/RESIZE event. Never re-render React at 60fps.
  useEffect(() => {
    const size = () => setVw((old) => old.w === innerWidth && old.h === innerHeight ? old : { w: innerWidth, h: innerHeight });
    size();
    window.addEventListener("resize", size, { passive: true });
    return () => window.removeEventListener("resize", size);
  }, []);
  useEffect(() => {
    if (!s.el || (s.mode !== "tour" && s.mode !== "single")) { setRect(null); return; }
    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = s.el!.getBoundingClientRect();
      setRect((old) => old && Math.abs(old.top - r.top) < 2 && Math.abs(old.left - r.left) < 2 ? old : r);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(measure); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [s.el, s.mode]);

  // focus + keys
  useEffect(() => {
    if (s.mode === "idle") return;
    const id = requestAnimationFrame(() => titleRef.current?.focus({ preventScroll: true }));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (s.mode === "tour" && e.key === "ArrowRight") go(s.step + 1);
      if (s.mode === "tour" && e.key === "ArrowLeft" && s.step > 0) go(s.step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => (cancelAnimationFrame(id), window.removeEventListener("keydown", onKey));
  }, [s.mode, s.step, s.topicKey, close, go]);

  useEffect(() => () => window.clearTimeout(outroTimer.current), []);
  useEffect(() => setMobileMinimized(false), [s.topicKey]);

  // The mobile dock and header must not compete with Giorgio's explanation.
  // This is deliberately a CSS media-query state: desktop and tablet are untouched.
  useEffect(() => {
    document.documentElement.dataset.giorgioOpen = s.mode !== "idle" ? "true" : "false";
    return () => { delete document.documentElement.dataset.giorgioOpen; };
  }, [s.mode]);

  // Only smartphones get the compact floating guide. Tablet/desktop keeps the existing layout.
  const phone = vw.w < 768;
  const tablet = vw.w >= 768 && vw.w < 1200;
  const compact = phone;
  const dock = phone ? 18 : tablet ? 24 : 112;
  const stage = phone ? { w: vw.w, h: 240 } : tablet ? { w: 184, h: 262 } : STAGE;
  const right = true;
  const x = phone ? 0 : Math.max(12, vw.w - stage.w - (tablet ? 18 : 24));
  const anchorTop = rect ? rect.top + 40 : vw.h - stage.h - dock;
  const y = phone
    ? Math.max(0, vw.h - stage.h - dock)
    : tablet
      ? Math.max(88, Math.min(anchorTop, vw.h - Math.max(430, stage.h) - dock))
      : Math.max(96, Math.min(anchorTop, vw.h - stage.h - dock));
  const open = s.mode !== "idle" && s.topic;
  const ctx: Ctx = { explain, start: () => go(0), label: (t) => g.open.replace("{topic}", g.topics[t].title), startLabel: g.tourStart, tour: !!tour };

  return (
    <GiorgioCtx.Provider value={ctx}>
      {children}
      <p className="sr-only" aria-live="polite">
        {s.mode === "tour" ? g.tourLive.replace("{n}", String(s.step + 1)).replace("{total}", String(s.total)) : ""}
      </p>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="giorgio"
            className="pointer-events-none fixed left-0 top-0 z-[75]"
            initial={{ opacity: 0, x, y }}
            animate={{ opacity: 1, x, y, rotate: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.16 } }}
            transition={{ duration: reduce ? 0.1 : 0.26, ease: EASE_OUT_SOFT }}
            style={{ width: stage.w, height: stage.h }}
          >
            {/* the speech panel sits on the inner side (phones: above him) and never on top of him */}
            <motion.div
              role="dialog"
              aria-modal="false"
              aria-labelledby="giorgio-title"
              key={s.topicKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2 } }}
              className={
                compact
                  ? `pointer-events-auto absolute inset-x-3 bottom-0 w-[calc(100%-24px)] overflow-x-clip rounded-[24px] bg-card px-3.5 py-3 shadow-[0_0_0_1px_var(--color-hairline),var(--shadow-lift)] ${mobileMinimized ? "!h-[64px] overflow-hidden" : "max-h-[calc(100dvh-80px)] overflow-y-auto"}`
                  : tablet
                    ? "pointer-events-auto absolute right-[calc(100%-10px)] top-0 max-h-[min(60dvh,430px)] w-[min(400px,calc(100vw-240px))] min-w-0 overflow-x-clip overflow-y-auto overscroll-contain rounded-[24px] bg-card p-5 shadow-[0_0_0_1px_var(--color-hairline),var(--shadow-lift)]"
                    : "pointer-events-auto absolute right-[calc(100%-8px)] top-4 max-h-[75vh] w-[min(380px,calc(100vw-310px))] overflow-x-clip overflow-y-auto rounded-[24px] bg-card p-5 shadow-[0_0_0_1px_var(--color-hairline),var(--shadow-lift)]"
              }
            >
              {!compact ? <span aria-hidden className={phone ? "absolute -bottom-[7px] right-[70px] size-4 rotate-45 bg-card" : "absolute -right-[7px] top-10 size-4 rotate-45 bg-card"} /> : null}
              <div className="mb-1 flex items-center gap-2">
                {compact ? <Img src={presenters.giorgioGuide} alt="" sizes="42px" className="size-10 shrink-0 rounded-full bg-[#FDEFC4] object-cover object-top" /> : null}
                <p className={`min-w-0 flex-1 font-semibold text-leaf-text ${compact ? "text-[15px] leading-snug" : "text-[13px]"}`}>{compact ? s.topic!.title : g.eyebrow}</p>
                {compact && (
                  <button type="button" onClick={() => setMobileMinimized((m) => !m)} aria-label={mobileMinimized ? "Espandi la spiegazione di Giorgio" : "Riduci la spiegazione di Giorgio"} aria-expanded={!mobileMinimized} className="grid size-10 shrink-0 place-items-center rounded-full bg-paper-2 text-ink">
                    {mobileMinimized ? <ChevronUp className="size-5" aria-hidden /> : <ChevronDown className="size-5" aria-hidden />}
                  </button>
                )}
              </div>
              <div hidden={compact && mobileMinimized}>
              <h2 id="giorgio-title" ref={titleRef} tabIndex={-1} className={compact ? "sr-only" : "mt-1 font-display text-[1.3rem] font-extrabold tracking-[-0.025em] text-ink outline-none"}>
                {s.topic!.title}
              </h2>
              <p className={compact ? "mt-2 text-[14px] leading-[1.4] text-ink/85" : "mt-2 text-[15px] leading-relaxed text-ink/85 sm:text-[16px]"}>{compact ? compactTopicBody(s.topicKey, s.topic!.body, locale) : s.topic!.body}</p>
              {s.topic!.more ? (
                <Link href={lhref(locale, s.topic!.more)} className="tlink text-[15px]">
                  <span>{g.more}</span>
                  <ArrowRight aria-hidden />
                </Link>
              ) : null}

              {s.mode === "tour" ? (
                <div className={compact ? "mt-2" : "mt-4"}>
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-semibold text-slate">{g.tourProgress.replace("{n}", String(s.step + 1)).replace("{total}", String(s.total))}</span>
                    <span aria-hidden className="flex gap-1.5">
                      {Array.from({ length: s.total }, (_, k) => (
                        <span key={k} className={k === s.step ? "h-2 w-5 rounded-full bg-orange" : "size-2 rounded-full bg-ink/15"} />
                      ))}
                    </span>
                  </div>
                  <div className={compact ? "mt-2 flex min-w-0 flex-wrap items-center gap-2" : "mt-3 flex min-w-0 flex-wrap items-center gap-2"}>
                    <button type="button" onClick={() => go(s.step - 1)} disabled={s.step === 0} className="btn btn--outline btn--sm disabled:opacity-40">
                      <ArrowLeft aria-hidden strokeWidth={2.2} />
                      {g.tourBack}
                    </button>
                    <button type="button" onClick={() => go(s.step + 1)} className="btn btn--dark btn--sm min-w-[110px] flex-1">
                      {s.step + 1 === s.total ? g.tourDone : g.tourNext}
                      <ArrowRight aria-hidden strokeWidth={2.2} />
                    </button>
                  </div>
                  <button type="button" onClick={() => outro("skip")} className={`${compact ? "mt-0.5 min-h-9" : "mt-1 min-h-11"} inline-flex items-center text-[14px] font-semibold text-slate underline underline-offset-4 hover:text-ink`}>
                    {g.tourSkip}
                  </button>
                </div>
              ) : s.mode === "single" ? (
                <div className="mt-4 flex items-center gap-2">
                  <button type="button" onClick={close} className="btn btn--outline btn--sm flex-1">
                    {g.close}
                  </button>
                  <button type="button" onClick={close} className="paper-round" aria-label={g.closeAria}>
                    <X aria-hidden />
                  </button>
                </div>
              ) : s.mode === "outro" ? (
                <button type="button" onClick={close} className="btn btn--outline btn--sm mt-4">{g.close}</button>
              ) : null}
              </div>
            </motion.div>

            {/* stage: a sun disc behind him and a COMPLETE ground pill in front of the photo's bottom edge */}
            {!compact ? <div aria-hidden className="absolute inset-0">
              <svg viewBox="0 0 260 346" className="absolute inset-0 h-full w-full">
                <circle cx="130" cy="150" r="112" fill="#FDEFC4" />
                <circle cx="130" cy="150" r="70" fill="#FE9845" />
              </svg>
              <motion.div
                className="absolute inset-x-0 bottom-[22px] h-[90%] origin-bottom"
                animate={reduce ? {} : s.mode === "outro" ? { rotate: [0, -6, 6, -6, 6, 0] } : { rotate: [right ? -2 : 2, 0] }}
                transition={s.mode === "outro" ? { duration: 1.2, delay: 0.3 } : { duration: 0.5 }}
                key={s.mode === "outro" ? "wave" : s.topicKey}
              >
                <Img src={presenters.giorgioGuide} alt={g.alt} sizes="(max-width: 767px) 180px, 260px" className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2" />
              </motion.div>
              <span className="absolute inset-x-[4%] bottom-0 h-[34px] rounded-full bg-[#4B8B2F]" />
              <span className="absolute inset-x-[16%] bottom-[10px] h-[10px] rounded-full bg-[#B9D68F]" />
            </div> : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </GiorgioCtx.Provider>
  );
}

/** "Fammi fare un giro con Giorgio" — the only way to restart the tour once it is done. */
export function TourStart({ className }: { className?: string }) {
  const ctx = useContext(GiorgioCtx);
  if (!ctx?.tour) return null;
  return (
    <button type="button" onClick={ctx.start} className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-mint px-4 text-[15px] font-semibold text-leaf-text shadow-[inset_0_0_0_1.5px_rgb(71_138_43/.35)] hover:bg-sage ${className ?? ""}`}>
      <Route className="size-4" aria-hidden />
      {ctx.startLabel}
    </button>
  );
}

/** InfoDot (16.5): sits INLINE right after the title text, centred on the cap height; 22 px visual, 44 px hit area, leaf outline. */
export function InfoDot({ topic, className }: { topic: TopicKey; className?: string }) {
  const ctx = useContext(GiorgioCtx);
  const ref = useRef<HTMLButtonElement>(null);
  if (!ctx) return null;
  return (
    <button
      ref={ref}
      type="button"
      data-hit-area
      aria-haspopup="dialog"
      aria-label={ctx.label(topic)}
      onClick={() => ctx.explain(topic, ref.current)}
      className={`relative ml-1.5 inline-grid size-[22px] shrink-0 place-items-center rounded-full bg-card align-[0.12em] font-display text-[13px] font-extrabold italic leading-none text-leaf-text shadow-[inset_0_0_0_1.5px_rgb(71_138_43/.6)] transition-colors before:absolute before:-inset-[11px] before:content-[''] hover:bg-mint ${className ?? ""}`}
    >
      i
    </button>
  );
}

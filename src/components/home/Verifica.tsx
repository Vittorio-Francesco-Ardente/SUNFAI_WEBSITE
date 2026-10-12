"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, MapPin, Search } from "lucide-react";
import { configurations, findConfiguration } from "@/lib/configurations";
import { asset } from "@/lib/asset";
import { lhref, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { EASE_OUT_SOFT } from "@/lib/motion";
import type { Dict } from "@/content/dict";

type Result = { kind: "found"; comune: string; code: string; status: string } | { kind: "notfound" } | { kind: "short" } | null;

/** "Verifica se puoi aderire" (C.2): client-side match Comune → configuration (cabina primaria). Indicative only. */
export function VerificaForm({ t, legend, locale, compact = false }: { t: Dict["home"]["verifica"]; legend: Dict["home"]["map"]["legend"]; locale: Locale; compact?: boolean }) {
  const [res, setRes] = useState<Result>(null);
  const resRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = inputRef.current?.value ?? "";
    if (q.trim().length < 2) {
      setRes({ kind: "short" });
      inputRef.current?.focus();
      return;
    }
    const hit = findConfiguration(q) ?? findByCode(q);
    setRes(hit ? { kind: "found", comune: hit.comune, code: hit.configuration.code, status: legend[hit.configuration.status] } : { kind: "notfound" });
    requestAnimationFrame(() => resRef.current?.scrollIntoView({ block: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
  };

  return (
    <div>
      <form onSubmit={onSubmit} role="search" className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="grid gap-2">
          <span className="text-[15px] font-semibold text-ink">{t.label}</span>
          <span className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate" aria-hidden />
            <input
              ref={inputRef}
              name="comune"
              type="text"
              inputMode="text"
              autoComplete="address-level2"
              enterKeyHint="search"
              placeholder={t.placeholder}
              aria-describedby={res?.kind === "short" ? "verifica-err" : undefined}
              aria-invalid={res?.kind === "short" || undefined}
              className="h-14 w-full rounded-full bg-card pl-12 pr-5 text-[17px] text-ink shadow-[inset_0_0_0_1.5px_rgb(5_42_34/.16)] outline-none transition-shadow placeholder:text-ink/40 focus:shadow-[inset_0_0_0_2px_var(--color-ink)]"
            />
          </span>
        </label>
        <button type="submit" className="btn btn--dark btn--lg !h-14">
          <Search aria-hidden strokeWidth={2.2} />
          {t.button}
        </button>
      </form>
      {res?.kind === "short" ? (
        <p id="verifica-err" className="mt-2 text-[15px] font-medium text-orange-text">
          {t.tooShort}
        </p>
      ) : null}

      <div ref={resRef} aria-live="polite" className="scroll-mb-[calc(var(--dock-space)+16px)]">
        <AnimatePresence mode="wait">
          {res?.kind === "found" ? (
            <motion.div key="f" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE_OUT_SOFT }} className="card mt-5 p-5 sm:p-6">
              <p className="flex items-start gap-3 font-display text-[1.25rem] font-extrabold leading-snug tracking-[-0.02em] text-ink">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-logo-green text-white">
                  <Check className="size-4" strokeWidth={3} aria-hidden />
                </span>
                {t.found.replace("{comune}", res.comune).replace("{codice}", res.code).replace("{stato}", res.status)}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                <a href={asset("/moduli/index.html?from=site#01")} className="btn btn--primary btn--md">
                  {t.foundCta}
                  <ArrowRight aria-hidden strokeWidth={2.2} />
                </a>
                <Link href={`${lhref(locale, "/ardake/monitoraggio/")}#${res.code}`} className="tlink self-center sm:self-auto">
                  <span>{t.foundMonitor}</span>
                  <ArrowRight aria-hidden />
                </Link>
              </div>
            </motion.div>
          ) : res?.kind === "notfound" ? (
            <motion.div key="n" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE_OUT_SOFT }} className="card mt-5 p-5 sm:p-6">
              <p className="font-display text-[1.25rem] font-extrabold tracking-[-0.02em] text-ink">{t.notFoundTitle}</p>
              <p className="t-body mt-2">{t.notFoundText}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                <Link href={lhref(locale, "/contatti/")} className="btn btn--dark btn--md">
                  {t.write}
                  <ArrowRight aria-hidden strokeWidth={2.2} />
                </Link>
                <a href={site.gseMapUrl} target="_blank" rel="noopener noreferrer" className="tlink self-center sm:self-auto">
                  <span>{t.gseMap}</span>
                  <ArrowUpRight aria-hidden />
                </a>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      {!compact ? <p className="t-meta mt-4">{t.small}</p> : null}
    </div>
  );
}

/** Also accept a cabina primaria code (Ardaké "Trova la tua cabina primaria"). */
function findByCode(q: string) {
  const code = q.trim().toUpperCase();
  const c = configurations.find((x) => x.code === code);
  return c ? { configuration: c, comune: c.comuni[0] } : null;
}

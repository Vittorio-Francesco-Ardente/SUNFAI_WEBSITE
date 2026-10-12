"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Building2, Check, Download, FileText, UserRound } from "lucide-react";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import type { Dict } from "@/content/dict";

type Key = "fisica" | "giuridica";
const ONLINE: Record<Key, string> = { fisica: "/moduli/index.html?from=site#02", giuridica: "/moduli/index.html?from=site#03" };
const PDF: Record<Key, string> = { fisica: "/moduli/pdf/SUNFAI_02_Ammissione_socio_persona_fisica.pdf", giuridica: "/moduli/pdf/SUNFAI_03_Ammissione_socio_persona_giuridica.pdf" };

/**
 * "Persona fisica o giuridica." (demo membership-paths, V2): two large tappable tabs (stacked cards on phones),
 * who / consumer-prosumer / "Di solito servono" / quota 25 € / ATECO note, paper buttons (V3: no boxed presenter).
 * #persona-fisica and #persona-giuridica select the tab (links from the Home "Per chi è" doors).
 */
export function MembershipPaths({ t, inItalian }: { t: Dict["socio"]["paths"]; inItalian: string }) {
  const [active, setActive] = useState<Key>("fisica");
  useEffect(() => {
    const read = () => {
      if (location.hash === "#persona-giuridica") setActive("giuridica");
      if (location.hash === "#persona-fisica") setActive("fisica");
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  const p = t[active];
  const keys: Key[] = ["fisica", "giuridica"];

  return (
    <div className="card overflow-hidden !rounded-[var(--radius-feature)]">
      <div role="tablist" aria-label={t.eyebrow} className="grid gap-2 border-b border-[var(--color-hairline)] p-2 sm:grid-cols-2">
        {keys.map((k) => {
          const Icon = k === "fisica" ? UserRound : Building2;
          const sel = k === active;
          return (
            <button
              key={k}
              id={`tab-${k}`}
              role="tab"
              type="button"
              aria-selected={sel}
              aria-controls="panel-path"
              onClick={() => {
                setActive(k);
                history.replaceState(null, "", `#persona-${k}`);
              }}
              className={cn("flex min-h-[64px] items-center justify-center gap-3 rounded-[24px] px-4 font-display text-[1.1rem] font-extrabold tracking-[-0.02em] transition-colors", sel ? "bg-ink text-white" : "text-ink/75 hover:bg-paper-2")}
            >
              <Icon className="size-5" aria-hidden />
              {t[k].label}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={active} id="panel-path" role="tabpanel" aria-labelledby={`tab-${active}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="grid gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-12">
          <div className="lg:col-span-5">
            <p className="font-display text-[1.4rem] font-extrabold leading-snug tracking-[-0.025em] text-ink">{p.who}</p>
            <ul className="mt-6 grid gap-3">
              {p.examples.map((e) => (
                <li key={e} className="flex items-start gap-3 text-[16px] text-ink/85">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-sage text-leaf-text">
                    <Check className="size-4" strokeWidth={3} aria-hidden />
                  </span>
                  {e}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl bg-paper-2 p-4 text-[15px] leading-relaxed text-slate">{p.note}</p>
          </div>
          <div className="lg:col-span-7">
            <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-orange-text">{t.docsTitle}</p>
            <ul className="mt-4 divide-y divide-[var(--color-hairline)] border-y border-[var(--color-hairline)]">
              {p.docs.map((x) => (
                <li key={x} className="flex min-h-12 items-center gap-3 py-3 text-[16px] text-ink">
                  <FileText className="size-5 shrink-0 text-ink/40" aria-hidden />
                  {x}
                </li>
              ))}
            </ul>
            <p className="t-meta mt-3">{t.docsSource}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={asset(ONLINE[active])} className="btn btn--primary btn--md">
                {t.online}
                <ArrowRight aria-hidden className="btn-arrow" />
              </a>
              <a href={asset(PDF[active])} download className="btn btn--outline btn--md">
                <Download aria-hidden />
                {t.pdf}
              </a>
            </div>
            {inItalian ? <p className="t-meta mt-3">{inItalian}</p> : null}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDict } from "@/content/dict";
import { presenters } from "@/content/team";
import { pageMeta } from "@/lib/meta";
import { lhref, type Locale } from "@/lib/i18n";
import { configurations } from "@/lib/configurations";
import { hourly, monthly, bestHours } from "@/lib/ardake/demo-data";
import { ButtonLink, Eyebrow, Headline, TextLink } from "@/components/ui/primitives";
import { Badge } from "@/components/geometry/shapes";
import { CanvasPanel, Confetto, PanelPerson, Person, RayFan, Ripple } from "@/components/canvas/Canvas";
import { SectionPanel } from "@/components/canvas/presets";
import { Img } from "@/components/ui/Img";
import { PhoneMockup } from "@/components/ardake/PhoneMockup";
import { PrecisioneTitle } from "@/components/ardake/PrecisioneTitle";
import { Dashboard } from "@/components/ardake/Dashboard";
import { GiorgioProvider, InfoDot } from "@/components/ardake/Giorgio";
import { ArdakeHero } from "@/components/ardake/ArdakeHero";
import { VerificaForm } from "@/components/home/Verifica";
import { JoinContact } from "@/components/sections/JoinContact";

export const ardakeMeta = (locale: Locale) => {
  const a = getDict(locale).ardake;
  return pageMeta(locale, "/ardake/", a.meta.title, a.meta.description);
};

/** Mini chart previews instead of icons (05.1 §2): sparkline · bars · 24-hour sun strip · donut. */
function Mini({ i }: { i: number }) {
  if (i === 0) {
    const v = hourly.map((h) => h.shared);
    const max = Math.max(...v);
    const d = v.map((y, x) => `${x ? "L" : "M"}${(x / 23) * 120},${44 - (y / max) * 38}`).join(" ");
    return (
      <svg viewBox="0 0 120 48" className="h-12 w-full" aria-hidden>
        <path d={`${d} L120,48 L0,48Z`} fill="#F26722" fillOpacity=".25" />
        <path d={d} fill="none" stroke="#F26722" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (i === 1) {
    const v = monthly.slice(-6);
    const max = Math.max(...v.map((m) => m.produced));
    return (
      <svg viewBox="0 0 120 48" className="h-12 w-full" aria-hidden>
        {v.map((m, k) => (
          <g key={k}>
            <rect x={k * 20 + 2} y={48 - (m.produced / max) * 44} width="7" height={(m.produced / max) * 44} rx="2.5" fill="#FECF49" />
            <rect x={k * 20 + 10} y={48 - (m.shared / max) * 44} width="7" height={(m.shared / max) * 44} rx="2.5" fill="#79AD4B" />
          </g>
        ))}
      </svg>
    );
  }
  if (i === 2) {
    return (
      <div className="grid h-12 grid-cols-12 items-end gap-[3px]" aria-hidden>
        {bestHours.filter((_, h) => h >= 6 && h < 18).map((v, h) => (
          <span key={h} className="rounded-[3px]" style={{ height: `${20 + v * 80}%`, background: v > 0.85 ? "#F26722" : v > 0.6 ? "#FE9845" : v > 0.3 ? "#FECF49" : "#F4EFE6" }} />
        ))}
      </div>
    );
  }
  return (
    <svg viewBox="-24 -24 48 48" className="h-12 w-12" aria-hidden>
      <circle r="18" fill="none" stroke="#C9E1A0" strokeWidth="9" />
      <circle r="18" fill="none" stroke="#79AD4B" strokeWidth="9" strokeDasharray="70 200" transform="rotate(-90)" />
      <circle r="18" fill="none" stroke="#FECF49" strokeWidth="9" strokeDasharray="22 200" strokeDashoffset="-74" transform="rotate(-90)" />
    </svg>
  );
}

const STEP_SCENES = ["/scenes/scene-01-consulenza-laptop.webp", "/scenes/scene-03-monitoraggio-analytics.webp", "/scenes/scene-09-risparmio-energetico-casa.webp"];

export function ArdakePage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const a = d.ardake;

  return (
    <GiorgioProvider g={a.giorgio} locale={locale} tour="ardake">
      <ArdakeHero a={a} locale={locale} />

      {/* ---------------- Cosa fa — Precisione as the section's visual heading ---------------- */}
      <SectionPanel data-section="cosa-fa" data-tour-step="ardake" data-tour-order={1} tone="mint" preset="corner" family="leaf" aria-labelledby="ardake-precisione" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{a.cosaFa.eyebrow}</Eyebrow>
              <PrecisioneTitle id="ardake-precisione" title="Ardaké" replay={d.common.ui.replay} className="mt-6 w-[min(100%,720px)] min-w-0 lg:min-w-[280px]" />
            </div>
            <div className="reveal lg:col-span-5">
              <Headline text={a.cosaFa.title} size="h2s" tone="leaf" />
              <p className="t-lead mt-4">{a.cosaFa.lead}</p>
            </div>
          </div>
          <ul className="rail rail--to-grid mt-10 pb-2 md:gap-4" style={{ ["--cols" as string]: 4 }}>
            {a.cosaFa.features.map((f, i) => (
              <li key={f.title} className="reveal">
                <div className="card hover-card relative h-full overflow-hidden p-6">
                  <Badge n={(((i % 4) + 1) as 1 | 2 | 3 | 4)} className="absolute right-0 top-0 w-14 rounded-tr-[var(--radius-card)]" />
                  <div className="rounded-2xl bg-paper-2 p-3">
                    <Mini i={i} />
                  </div>
                  <h3 className="t-h3 mt-5">{f.title}</h3>
                  <p className="t-body mt-2 !text-[16px]">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </SectionPanel>

      {/* ---------------- Come funziona: 3 steps with InfoDots ---------------- */}
      <SectionPanel data-section="come-funziona" data-tour-step="configurazione" data-tour-order={2} tone="paper" preset="content" family="sun" mirror id="come-funziona" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal max-w-[46rem]">
            <Eyebrow>{a.comeFunziona.eyebrow}</Eyebrow>
            <Headline text={a.comeFunziona.title} className="mt-5" />
          </div>
          <ol className="reveal-stagger mt-10 grid gap-4 md:grid-cols-3">
            {a.comeFunziona.steps.map((s, i) => (
              <li key={s.title} className="card hover-card overflow-hidden">
                <div className="overflow-hidden border-b border-[var(--color-hairline)] bg-[#fcfbf7] p-5">
                  <Img src={STEP_SCENES[i]} alt={a.comeFunziona.sceneAlts[i]} sizes="(max-width: 767px) 90vw, 30vw" className="hc-scene aspect-[4/3] h-auto w-full object-contain" />
                </div>
                <div className="flex gap-4 p-5 sm:p-6">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-display text-[15px] font-extrabold text-white">{i + 1}</span>
                  <div>
                    <h3 className="t-h3 flex items-center gap-2">
                      {s.title} <InfoDot topic={s.info as "configurazione"} />
                    </h3>
                    <p className="t-body mt-2 !text-[16px]">{s.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </SectionPanel>

      {/* ---------------- Seleziona una CER + Trova la tua cabina primaria ---------------- */}
      <SectionPanel data-section="seleziona" data-tour-step="cabina-primaria" data-tour-order={3} tone="cream" preset="soft" family="peach" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{a.seleziona.eyebrow}</Eyebrow>
              <Headline text={a.seleziona.title} className="mt-5" />
            </div>
            <p className="t-lead lg:col-span-5">
              {a.seleziona.text} <InfoDot topic="configurazione" className="ml-1" />
            </p>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {configurations.map((c, i) => (
              <li key={c.code} className="reveal">
                <Link href={`${lhref(locale, "/ardake/monitoraggio/")}#${c.code}`} className="card hover-card relative flex h-full flex-col overflow-hidden p-6 sm:p-8">
                  <Badge n={i ? 3 : 4} className="absolute right-0 top-0 w-24 rounded-tr-[var(--radius-card)]" />
                  <span className="inline-flex items-center gap-2 self-start rounded-full bg-mint px-3 py-1 text-[13px] font-bold tracking-[0.06em] text-leaf-text">
                    <span className="live-dot !size-2" aria-hidden /> {a.seleziona.active}
                  </span>
                  <span className="mt-4 font-display text-[1.6rem] font-extrabold tracking-[-0.03em] text-ink">{c.code}</span>
                  <span className="mt-3 flex flex-wrap gap-2" aria-label={c.comuni.join(", ")}>
                    {c.comuni.map((comune) => (
                      <span key={comune} className="rounded-full bg-mint px-3 py-1.5 text-[13px] font-medium leading-snug text-ink">{comune}</span>
                    ))}
                  </span>
                  <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 font-semibold text-ink">
                    {a.seleziona.view} <ArrowRight className="hc-arrow size-4" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="card mt-6 p-5 sm:p-7">
            <h3 className="t-h3 flex items-center gap-2">
              {a.seleziona.findTitle} <InfoDot topic="cabina-primaria" />
            </h3>
            <div className="mt-4">
              <VerificaForm t={{ ...d.home.verifica, label: a.seleziona.findLabel, placeholder: a.seleziona.findPlaceholder, button: a.seleziona.findButton }} legend={d.home.map.legend} locale={locale} compact />
            </div>
          </div>
        </div>
      </SectionPanel>

      {/* ---------------- Demo dashboard teaser ---------------- */}
      <SectionPanel data-section="demo" data-tour-step="quarto-orario" data-tour-order={4} tone="paper" preset="frame" family="leaf" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal mb-8 grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Eyebrow>{a.demoTeaser.eyebrow}</Eyebrow>
              <Headline text={a.demoTeaser.title} className="mt-5" />
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <ButtonLink href="/ardake/demo/" locale={locale} variant="dark" className="max-sm:w-full">
                {a.demoTeaser.open}
              </ButtonLink>
            </div>
          </div>
          <div data-tour-step="energia-condivisa" data-tour-order={5} data-tour-side="left">
            <Dashboard a={a} preview />
          </div>
        </div>
      </SectionPanel>

      <JoinContact d={d.common.joinContact} locale={locale} personAlt={d.common.ui.personAlt} />
    </GiorgioProvider>
  );
}

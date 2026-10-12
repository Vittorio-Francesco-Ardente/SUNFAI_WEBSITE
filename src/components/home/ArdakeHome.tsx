import { BarChart3, Clock3, Leaf, Scale } from "lucide-react";
import { ButtonLink, Eyebrow, TextLink } from "@/components/ui/primitives";
import { PrecisioneTitle } from "@/components/ardake/PrecisioneTitle";
import { PhoneMockup } from "@/components/ardake/PhoneMockup";
import { CanvasPanel, PanelPerson, Ripple } from "@/components/canvas/Canvas";
import { presenters } from "@/content/team";
import type { Locale } from "@/lib/i18n";
import type { Dict } from "@/content/dict";

const ICONS = [Leaf, BarChart3, Clock3, Scale];
const SAGE = ["#DEE9BF", "#C9E1A0", "#DEE9BF", "#B9D68F", "#DEE9BF", "#C9E1A0", "#DEE9BF", "#C9E1A0"];

/**
 * Home · Ardaké teaser, V3 (16.5 "features + phone"): mint canvas, sun on the RIGHT edge (y 0.33) with a sage rays fan (CONCEPT_1 language),
 * pale sun at the bottom. The "Precisione" animation is the title. Left: lead, 4 features, CTA row on clean paper
 * (24 px safe zone, no decoration near the buttons). Right: the phone (live HTML screen) and Giorgio palm-up
 * standing on the panel's bottom edge, his hand reaching the phone.
 */
export function ArdakeHome({ d, phone, phoneAlt, replay, locale }: { d: Dict["home"]["ardake"]; phone: Dict["ardake"]["phone"]; phoneAlt: string; replay: string; locale: Locale }) {
  return (
    <CanvasPanel
      tone="mint"
      data-section="ardake"
      aria-labelledby="home-ardake-title"
      phoneUnit={1.6}
      bg={
        <>
          <Ripple at={{ x: 1, y: 0.33 }} atSm={{ x: 1, y: 0.62 }} family="sun" core={0.09} coreColor="#FE9845" widths={[0.11, 0.06, 0.07, 0.08]} fan={{ count: 8, from: 92, to: 268, colors: SAGE, bandColor: "#FEF6E0" }} />
          <Ripple at={{ x: 0.55, y: 1 }} hideSm family="sunPale" core={0.07} widths={[0.04, 0.04]} />
        </>
      }
    >
      <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)] lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Eyebrow>{d.eyebrow}</Eyebrow>
          <PrecisioneTitle id="home-ardake-title" title={d.srTitle} replay={replay} className="mt-6 w-[min(100%,620px)] min-w-[280px]" />
          <p className="reveal mt-6 font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.4rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-ink">{d.lead}</p>
          <p className="t-lead reveal mt-3">{d.text}</p>
          <ul className="reveal-stagger mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            {d.features.map((f, i) => {
              const Icon = ICONS[i];
              return (
                <li key={f.title} className="card hover-card p-4 sm:p-5">
                  <span className="grid size-10 place-items-center rounded-full bg-[#FDF0C8] text-ink">
                    <Icon className="size-5" strokeWidth={1.9} aria-hidden />
                  </span>
                  <p className="mt-3 font-display text-[15px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[17px]">{f.title}</p>
                  <p className="mt-1.5 text-[14px] leading-snug text-slate sm:text-[15px]">{f.text}</p>
                </li>
              );
            })}
          </ul>
          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-7">
            {/* direct link — no entry animation into Ardaké */}
            <ButtonLink href="/ardake/monitoraggio/" locale={locale} size="lg">
              {d.cta}
            </ButtonLink>
            <TextLink href="/ardake/demo/" locale={locale} className="self-center sm:self-auto">
              {d.demo}
            </TextLink>
          </div>
          <p className="mt-4 text-[14px] text-slate">{d.madeBy}</p>
        </div>
        {/* phone: desktop floats in the right column; phones = its own block before Giorgio's stage */}
        <div className="relative mt-10 flex justify-center lg:col-span-6 lg:mt-0 lg:block">
          <div className="origin-top scale-[.8] sm:scale-90 lg:absolute lg:left-[14%] lg:top-[3%] lg:origin-top-left lg:-rotate-[6deg] lg:scale-[.92] xl:scale-100">
            <PhoneMockup t={phone} label={phoneAlt} variant="dashboard" />
          </div>
        </div>
      </div>
      <PanelPerson
        src={presenters.giorgioPalmUp}
        alt={d.giorgioAlt}
        sizes="(max-width: 1023px) 80vw, 32vw"
        smH="clamp(260px, 80cqw, 400px)"
        lgClass="lg:left-auto lg:right-[1%] lg:h-[min(62%,620px)]"
      />
    </CanvasPanel>
  );
}

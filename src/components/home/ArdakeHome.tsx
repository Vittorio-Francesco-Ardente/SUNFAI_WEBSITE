import { BarChart3, Clock3, Leaf, Scale } from "lucide-react";
import { ButtonLink, Eyebrow, TextLink } from "@/components/ui/primitives";
import { ArdakeWordmark } from "@/components/ardake/ArdakeWordmark";
import { PhoneMockup } from "@/components/ardake/PhoneMockup";
import { CanvasPanel, PanelPerson, Ripple } from "@/components/canvas/Canvas";
import { presenters } from "@/content/team";
import { Img } from "@/components/ui/Img";
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
          <ArdakeWordmark id="home-ardake-title" title={d.srTitle} replay={replay} className="mt-6 w-full min-w-0 max-w-[620px]" />
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
        {/* Desktop: retain the concept's original floating phone composition. */}
        <div className="relative hidden lg:col-span-6 lg:block">
          <div className="absolute left-[14%] top-[3%] w-[270px] origin-top-left -rotate-[6deg] scale-[.92] xl:scale-100">
            <PhoneMockup t={phone} label={phoneAlt} variant="dashboard" />
          </div>
        </div>
      </div>

      {/* Mobile: phone and presenter share ONE stage. No empty block between them. */}
      <div className="relative mx-auto mt-3 h-[clamp(350px,108vw,480px)] w-full max-w-[550px] overflow-hidden lg:hidden">
        <div className="absolute left-[4%] top-[0%] z-[1] w-[270px] origin-top-left -rotate-[7deg] scale-[.58] min-[400px]:scale-[.67] sm:left-[9%] sm:scale-[.75]">
          <PhoneMockup t={phone} label={phoneAlt} variant="dashboard" />
        </div>
        <Img src={presenters.giorgioPalmUp} alt={d.giorgioAlt} draggable={false} sizes="(max-width: 639px) 64vw, 48vw" className="pointer-events-none absolute bottom-0 right-[-9%] z-[2] h-[76%] w-auto max-w-none object-contain object-bottom sm:right-[0%] sm:h-[82%]" />
      </div>
      <div className="hidden lg:contents">
        <PanelPerson
          src={presenters.giorgioPalmUp}
          alt={d.giorgioAlt}
          sizes="32vw"
          lgClass="lg:left-auto lg:right-[1%] lg:h-[min(62%,620px)]"
        />
      </div>
    </CanvasPanel>
  );
}

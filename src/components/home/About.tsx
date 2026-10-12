import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink, Eyebrow, Headline, TextLink } from "@/components/ui/primitives";
import { CanvasPanel, Confetto, HalfDisc, PanelPerson, Ripple } from "@/components/canvas/Canvas";
import { Img } from "@/components/ui/Img";
import { lhref, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content/dict";

const SCENES = [
  "/scenes/scene-08-progettazione-impianto.webp",
  "/scenes/scene-05-teamwork-ufficio.webp",
  "/scenes/scene-10-workshop-energia-solare.webp",
  "/scenes/scene-03-monitoraggio-analytics.webp",
];

/**
 * "Chi siamo · Cosa facciamo", V3 (16.1 map): cream canvas, sun fan ripple on the LEFT edge (y 0.62), peach corner
 * top-right. Beatrice (smile) stands on the panel's bottom edge on the left, in front of the sun core; the text and
 * the 4 service rows sit on the right, on the pale area.
 */
export function About({ d, locale }: { d: Dict["home"]["about"]; locale: Locale }) {
  return (
    <CanvasPanel
      tone="cream"
      data-section="about"
      phoneUnit={1.5}
      bg={
        <>
          <Ripple at={{ x: 0, y: 0.62 }} atSm={{ x: 0, y: 1 }} family="sun" core={0.07} widths={[0.1, 0.07, 0.07, 0.08]} fan={{ count: 7, from: -84, to: 84 }} />
          <Ripple at={{ x: 1, y: 0 }} family="peach" core={0.03} widths={[0.05, 0.045]} bands={2} />
          <HalfDisc at={{ x: 0.7, y: 1 }} r={0.03} edge="bottom" fill="#4B8B2F" hideSm />
          <Confetto at={{ x: 0.36, y: 0.12 }} r={0.011} fill="#F26A1B" ring hideSm />
        </>
      }
    >
      <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)] lg:grid lg:grid-cols-12">
        <div className="lg:col-span-7 lg:col-start-6">
          <Eyebrow upper>{d.eyebrow}</Eyebrow>
          <Headline text={d.title} className="mt-5" />
          <p className="t-lead mt-5 max-w-[38rem]">{d.lead}</p>
          <p className="mt-4 max-w-[38rem] font-display text-[1.15rem] font-bold tracking-[-0.02em] text-ink">{d.welcome}</p>
          <ul className="reveal-stagger mt-8 grid gap-3">
            {d.rows.map((r, i) => (
              <li key={r.title}>
                <Link href={lhref(locale, "/cosa-facciamo/")} className="card hover-card group grid grid-cols-[80px_1fr_auto] items-center gap-4 p-3 pr-5 sm:grid-cols-[112px_1fr_auto] sm:gap-5">
                  <span className="relative block overflow-hidden rounded-[16px] bg-[#fcfbf7]">
                    <Img src={SCENES[i]} alt="" aria-hidden sizes="112px" className="hc-scene aspect-[4/3] h-auto w-full object-cover" />
                  </span>
                  <span>
                    <span className="block font-display text-[13px] font-extrabold text-orange-text">0{i + 1}</span>
                    <span className="hc-name block font-display text-[1.1rem] font-extrabold leading-tight tracking-[-0.02em] text-ink">{r.title}</span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-slate">{r.text}</span>
                  </span>
                  <span className="hc-arrow hidden size-10 place-items-center rounded-full bg-peach-light sm:grid">
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-7">
            <ButtonLink href="/cosa-facciamo/" locale={locale} variant="dark">
              {d.cta}
            </ButtonLink>
            <TextLink href="/chi-siamo/" locale={locale} className="self-center sm:self-auto">
              {d.secondary}
            </TextLink>
          </div>
        </div>
      </div>
      <PanelPerson
        src="/people/poses/beatrice-parimbelli--pose-smile.webp"
        alt={d.presenterAlt}
        sizes="(max-width: 1023px) 90vw, 36vw"
        lgClass="lg:left-[2.5%] lg:h-[min(74%,700px)]"
      />
    </CanvasPanel>
  );
}

import { getDict } from "@/content/dict";
import { pageMeta } from "@/lib/meta";
import type { Locale } from "@/lib/i18n";
import { ButtonLink, Eyebrow, Headline } from "@/components/ui/primitives";
import { CanvasPanel, PanelMascot, Ripple } from "@/components/canvas/Canvas";

export const grazieMeta = (locale: Locale) => {
  const g = getDict(locale).socio.grazie;
  return pageMeta(locale, "/diventa-socio/grazie/", g.metaTitle, g.text, { noindex: true });
};

/** Form success page, V3: a mint canvas panel with the open-arms mascot (16.3) + "Grazie! Abbiamo ricevuto il tuo modulo." */
export function GraziePage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const g = d.socio.grazie;
  return (
    <CanvasPanel
      tone="mint"
      data-section="grazie"
      className="cp-first"
      bg={
        <>
          <Ripple at={{ x: 1, y: 1 }} family="sun" core={0.1} widths={[0.1, 0.06, 0.06, 0.07]} fan={{ count: 8, from: 92, to: 178 }} />
          <Ripple at={{ x: 0, y: 1 }} family="leaf" core={0.04} widths={[0.035, 0.03]} bands={2} />
        </>
      }
    >
      <div className="container-x relative z-[2] grid min-h-[min(760px,calc(100svh-24px))] items-center gap-10 py-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Eyebrow>{g.eyebrow}</Eyebrow>
          <Headline text={g.title} as="h1" size="h1" className="is-in mt-5" />
          <p className="t-lead mt-6 max-w-[34rem]">{g.text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" locale={locale} size="lg">
              {g.home}
            </ButtonLink>
            <ButtonLink href="/ardake/" locale={locale} variant="outline" size="lg">
              {g.ardake}
            </ButtonLink>
          </div>
        </div>
        <div className="relative h-[260px] lg:col-span-5 lg:h-[420px]">
          <PanelMascot src="/mascot/mascot-01-open-arms-wink.webp" alt={d.common.ui.mascotAlt} className="bottom-0 left-1/2 w-[clamp(200px,30cqw,340px)] -translate-x-1/2" />
        </div>
      </div>
    </CanvasPanel>
  );
}

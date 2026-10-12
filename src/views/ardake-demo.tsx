import { getDict } from "@/content/dict";
import { pageMeta } from "@/lib/meta";
import type { Locale } from "@/lib/i18n";
import { ButtonLink, Eyebrow, Headline } from "@/components/ui/primitives";
import { CanvasPanel, PanelMascot, Ripple } from "@/components/canvas/Canvas";
import { Dashboard } from "@/components/ardake/Dashboard";
import { GiorgioProvider } from "@/components/ardake/Giorgio";

export const ardakedemoMeta = (locale: Locale) => {
  const t = getDict(locale).ardake.dashboard;
  return pageMeta(locale, "/ardake/demo/", t.metaTitle, t.metaDescription);
};

/** /ardake/demo — the demo dashboard, "Dati dimostrativi" clearly visible. */
export function ArdakeDemoPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const a = d.ardake;
  return (
    <GiorgioProvider g={a.giorgio} locale={locale}>
      <CanvasPanel tone="paper" data-section="demo" className="cp-first" bg={
          <>
            <Ripple at={{ x: 1, y: 0 }} family="leaf" core={0.05} widths={[0.05, 0.05, 0.05]} fan={{ count: 6, from: 182, to: 268 }} />
            <Ripple at={{ x: 0, y: 1 }} family="sunPale" core={0.05} widths={[0.03, 0.03]} />
          </>
        }>
        <div className="container-x relative z-[2] pb-[clamp(48px,6vw,88px)] pt-6 sm:pt-10">
          {/* header: title + CTA on the left, the laptop mascot in the empty right corner */}
          <div className="lg:w-[66%]">
            <Eyebrow>{a.dashboard.eyebrow}</Eyebrow>
            <Headline text={a.dashboard.title} as="h1" size="h1" className="is-in mt-5" />
            <ButtonLink href="/diventa-socio/" locale={locale} className="mt-6 max-sm:w-full">
              {a.dashboard.cta}
            </ButtonLink>
          </div>
          <div className="mt-10">
            <Dashboard a={a} />
          </div>
        </div>
          <PanelMascot src="/mascot/mascot-08-laptop.webp" alt={d.common.ui.mascotAlt} sizes="220px" className="right-[8%] top-[clamp(80px,9vw,120px)] w-[clamp(150px,15cqw,220px)] max-lg:hidden" />
      </CanvasPanel>
    </GiorgioProvider>
  );
}

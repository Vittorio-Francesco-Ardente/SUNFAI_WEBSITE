import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDict } from "@/content/dict";
import { pageMeta } from "@/lib/meta";
import { lhref, type Locale } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import { configurations } from "@/lib/configurations";
import { CanvasPanel, Ripple } from "@/components/canvas/Canvas";
import { Img } from "@/components/ui/Img";
import { Monitor } from "@/components/ardake/Monitor";
import { GiorgioProvider } from "@/components/ardake/Giorgio";

export const monitoraggioMeta = (locale: Locale) => {
  const m = getDict(locale).ardake.monitor;
  return pageMeta(locale, "/ardake/monitoraggio/", m.metaTitle, m.metaDescription);
};

export function MonitoraggioPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const a = d.ardake;
  return (
    <GiorgioProvider g={a.giorgio} locale={locale}>
      <CanvasPanel tone="paper" data-section="monitor" className="cp-first" bg={
          <>
            <Ripple at={{ x: 1, y: 0 }} family="leaf" core={0.05} widths={[0.05, 0.05, 0.05]} fan={{ count: 6, from: 182, to: 268 }} />
            <Ripple at={{ x: 0, y: 1 }} family="sunPale" core={0.05} widths={[0.03, 0.03]} />
          </>
        }>
        <div className="container-x relative z-[2] pb-[clamp(48px,6vw,88px)] pt-6 sm:pt-10">
          <Link href={lhref(locale, "/ardake/")} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ink/75 hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden /> Ardaké
          </Link>
          <div className="mt-4 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_210px] xl:items-center xl:gap-10">
            <div className="min-w-0 max-w-[680px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/ardake/ardake-logotype-vector.svg")} alt="Ardaké" width={150} height={45} className="h-auto w-[150px]" />
              <h1 className="t-h2s mt-4">{a.monitor.title.replace("{code}", configurations[0].code)}</h1>
              <p className="t-lead mt-2">{a.monitor.sub}</p>
            </div>
            <div className="hidden xl:flex xl:items-center xl:justify-center" aria-hidden="true">
              <Img src="/mascot/mascot-08-laptop.webp" alt="" sizes="210px" className="h-auto w-full max-w-[210px] object-contain" />
            </div>
          </div>
          <div className="mt-8">
            <Monitor a={a} locale={locale} legend={d.home.map.legend} />
          </div>
        </div>
      </CanvasPanel>
    </GiorgioProvider>
  );
}

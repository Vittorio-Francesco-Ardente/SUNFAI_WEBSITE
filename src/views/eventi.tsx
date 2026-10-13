import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CanvasPanel, Ripple } from "@/components/canvas/Canvas";
import { Eyebrow, Headline } from "@/components/ui/primitives";
import { EventDirectory } from "@/components/events/EventDirectory";
import { pageMeta } from "@/lib/meta";
import { lhref, type Locale } from "@/lib/i18n";
import { Img } from "@/components/ui/Img";

export const eventiMeta = (locale: Locale) => pageMeta(
  locale,
  "/eventi/",
  "Eventi e incontri sul territorio",
  "Tutti gli incontri e gli eventi SUN-FAI: prossimi appuntamenti e archivio degli eventi conclusi, con date, luoghi e locandine ufficiali.",
);

export function EventiPage({ locale }: { locale: Locale }) {
  return (
    <>
      <CanvasPanel className="cp-first" tone="cream" data-section="eventi-hero" bg={<><Ripple at={{ x: 1, y: 0 }} family="leafPale" core={0.04} widths={[0.05, 0.05]} bands={2}/><Ripple at={{ x: 0, y: 1 }} family="sunPale" core={0.04} widths={[0.06, 0.06]} /></>}>
        <div className="container-x relative z-[2] sf-events-page-intro">
          <div className="sf-events-page-copy">
            <Eyebrow>Incontri sul territorio</Eyebrow>
            <Headline text="L’energia si condivide. *Anche incontrandoci*" as="h1" size="h1" className="sf-events-page-title mt-5" />
            <p className="t-lead mt-5 max-w-[670px]">Scopri dove incontrare SUN-FAI e ritrova le locandine degli appuntamenti già svolti. Le date si aggiornano automaticamente: gli incontri passano tra i conclusi dal giorno successivo.</p>
            {locale === "lmo" && <p className="mt-3 text-[14px] text-slate">Informazioni sugli eventi in italiano.</p>}
            <Link href={lhref(locale, "/notizie/")} className="tlink mt-6">Leggi le notizie <ArrowRight className="size-4" aria-hidden /></Link>
          </div>
          <div className="sf-events-page-portrait sf-events-mascot-stage">
            <Img
              src="/mascot/mascot-02-presenting.webp"
              alt="Mascotte SUN-FAI che invita a incontrare la comunità"
              sizes="(max-width: 767px) 78vw, (max-width: 1023px) 39vw, 34vw"
              className="sf-events-mascot sf-events-mascot--page"
            />
          </div>
        </div>
      </CanvasPanel>
      <CanvasPanel tone="paper" data-section="elenco-eventi" bg={<Ripple at={{ x: 1, y: 1 }} family="leafPale" core={0.045} widths={[0.04, 0.04]} />}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <EventDirectory locale={locale} />
        </div>
      </CanvasPanel>
    </>
  );
}

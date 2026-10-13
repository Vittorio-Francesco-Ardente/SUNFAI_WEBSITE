import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CanvasPanel, Ripple } from "@/components/canvas/Canvas";
import { Eyebrow, Headline } from "@/components/ui/primitives";
import { EventDirectory } from "@/components/events/EventDirectory";
import { pageMeta } from "@/lib/meta";
import { lhref, type Locale } from "@/lib/i18n";
import { Img } from "@/components/ui/Img";
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
          <div className="sf-events-page-portrait" aria-label="La mascotte SUN-FAI accompagna gli eventi della comunità">
            <Img
              src="/mascot/mascot-01-open-arms-wink.webp"
              alt="Mascotte SUN-FAI"
              sizes="(max-width: 767px) 72vw, (max-width: 1023px) 40vw, 28vw"
              className="sf-events-mascot-page"
            />
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

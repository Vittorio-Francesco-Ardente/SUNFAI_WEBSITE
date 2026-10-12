import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/content/dict";
import { devPagesEnabled } from "./dev-styleguide";
import { HomeHero } from "@/components/home/HomeHero";
import { Numbers } from "@/components/home/Numbers";
import { PerChi } from "@/components/home/PerChi";
import { ArdakeHero } from "@/components/ardake/ArdakeHero";
import { GiorgioProvider } from "@/components/ardake/Giorgio";
import { Footer } from "@/components/layout/Footer";
import { MemberPage } from "./team-member";

export const stylelabMeta = (_l: Locale) => ({ title: "Style lab", robots: { index: false } });

/**
 * /dev/style-lab — the V3 style-lab gate (pack 16.0): mockups 01–06 (+ 09) rebuilt 1:1 with the REAL components
 * (CanvasPanel, Person, buttons, cards). scripts/v3-compare.mjs screenshots each block at 1440 × 900 and 390 × 844 and
 * puts it next to the mockup in reports/v3/style-lab-compare.html. Every later section is composed here first.
 */
export function StyleLabPage({ locale }: { locale: Locale }) {
  if (!devPagesEnabled()) notFound();
  const d = getDict(locale);
  return (
    <div className="grid gap-16 pb-16">
      <section id="lab-01" aria-label="01 · Home hero">
        <HomeHero d={d.home.hero} locale={locale} />
      </section>
      <section id="lab-09" aria-label="09 · Per chi è">
        <PerChi d={d.home.perChi} locale={locale} personAlt={d.common.ui.personAlt} />
      </section>
      <section id="lab-02" aria-label="02 · Numbers">
        <Numbers d={d.home.numbers} ui={d.common.ui} mascotAlt={d.common.ui.mascotAlt} />
      </section>
      <section id="lab-03" aria-label="03 · Member profile">
        <MemberPage locale={locale} slug="chiara-crivena" />
      </section>
      <section id="lab-04" aria-label="04 · Ardaké hero">
        <GiorgioProvider g={d.ardake.giorgio} locale={locale}>
          <ArdakeHero a={d.ardake} locale={locale} />
        </GiorgioProvider>
      </section>
      <section id="lab-05" aria-label="05 · Footer">
        <Footer d={d} locale={locale} />
      </section>
    </div>
  );
}

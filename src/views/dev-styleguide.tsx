import { notFound } from "next/navigation";
import { ArrowRight, Download, Mail } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/content/dict";
import { teamLite } from "@/content/team-lite";
import { ButtonLink, Eyebrow, GhostNumeral, Headline, Pill, TextLink } from "@/components/ui/primitives";
import { Badge, CornerSunrise, MemberBackdrop, SunMark } from "@/components/geometry/shapes";
import { Img } from "@/components/ui/Img";
import { CountUp } from "@/components/ui/CountUp";
import { MemberCard } from "@/components/team/MemberCard";
import { Faq } from "@/components/sections/Faq";

/** Dev-only pages: rendered with `next dev` or when SF_DEV_PAGES=1 at build time, 404 in the production export. */
export const devPagesEnabled = () => process.env.NODE_ENV !== "production" || process.env.SF_DEV_PAGES === "1";

export const styleguideMeta = (_l: Locale) => ({ title: "Styleguide", robots: { index: false } });

/** /dev/styleguide — every paper-button state on paper and on white next to CONCEPT_5's buttons, plus a hover lab. */
export function StyleguidePage({ locale }: { locale: Locale }) {
  if (!devPagesEnabled()) notFound();
  const d = getDict(locale);
  const m = teamLite(d, locale);
  const buttons = (
    <div className="flex flex-wrap items-center gap-4">
      <ButtonLink href="#" size="lg">Diventa socio</ButtonLink>
      <ButtonLink href="#" variant="dark">Scopri il team</ButtonLink>
      <ButtonLink href="#" variant="outline" icon={false}>Contattaci</ButtonLink>
      <ButtonLink href="#" variant="light" size="sm">
        <Mail aria-hidden className="mr-[-.2em]" />
        info@sun-fai.org
      </ButtonLink>
      <ButtonLink href="#" variant="primary" size="sm" icon="download">Scarica il PDF</ButtonLink>
      <TextLink href="#">Scopri di più</TextLink>
      <button type="button" className="paper-round"><ArrowRight aria-hidden /></button>
      <button type="button" className="paper-round paper-round--dark"><ArrowRight aria-hidden /></button>
      <button type="button" className="btn btn--primary btn--md" disabled style={{ opacity: 0.5 }}>Disabled <Download aria-hidden /></button>
    </div>
  );
  return (
    <div className="container-x section-y grid gap-16">
      <div>
        <Eyebrow>Dev</Eyebrow>
        <Headline text="Styleguide &|*hover lab*" as="h1" size="h1" className="is-in mt-5" />
        <p className="t-lead mt-4">Paper buttons: flat fill, darker 2 px bottom edge, neutral shadow — no glow, no gradient. Icons inline.</p>
      </div>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius-card)] bg-paper p-8 shadow-[inset_0_0_0_1px_var(--color-hairline)]">
          <p className="t-meta mb-4">On paper</p>
          {buttons}
        </div>
        <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[inset_0_0_0_1px_var(--color-hairline)]">
          <p className="t-meta mb-4">On white</p>
          {buttons}
        </div>
        <div className="rounded-[var(--radius-card)] bg-paper-2 p-4 lg:col-span-2">
          <p className="t-meta mb-2">CONCEPT_5 reference crop (buttons)</p>
          <p className="t-small">See prompt-packs/00_START_HERE_MASTER_BRIEF_V2/references/concepts/CONCEPT_5.png (bottom-left).</p>
        </div>
      </section>
      <section>
        <h2 className="t-h2s">Type</h2>
        <div className="mt-6 grid gap-6">
          <Headline text="Tutta un'altra|*energia*" size="hero" animate={false} />
          <Headline text="Le persone|dietro *l'energia*" size="h1" animate={false} />
          <Headline text="Una comunità energetica, in *tre passaggi*" size="h2" tone="leaf" animate={false} />
          <p className="t-sub">La tua. La nostra.</p>
          <p className="t-lead">Lead 17 → 24 px.</p>
          <p className="t-body">Body 16 → 18 px, slate.</p>
          <div className="relative h-32"><GhostNumeral n="04" className="left-0 top-0" /></div>
          <div className="flex flex-wrap gap-2"><Pill>Governance</Pill><Pill>Comunità energetiche</Pill><button type="button" className="chip" aria-pressed="true">Chip attivo</button><button type="button" className="chip">Chip</button></div>
          <p className="font-display text-5xl font-extrabold"><CountUp value={349} /> kWp</p>
        </div>
      </section>
      <section>
        <h2 className="t-h2s">Hover lab</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card hover-card relative h-48 overflow-hidden p-6"><Badge n={1} className="absolute right-0 top-0 w-24" />Card + badge</div>
          <div className="card hover-card relative h-48 overflow-hidden"><MemberBackdrop n={5} className="h-full w-full" /></div>
          <MemberCard m={m[0]} locale={locale} photoComing={d.team.section.photoComing} />
        </div>
      </section>
      <section>
        <h2 className="t-h2s">Geometry</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <MemberBackdrop key={n} n={n as 1} className="aspect-[4/5] w-full rounded-2xl" />
          ))}
          <SunMark className="w-full" />
          <CornerSunrise className="w-full" />
        </div>
        <p className="t-meta mt-4">V3 backgrounds (ripples, canvas panels): see /dev/style-lab.</p>
      </section>
      <Faq items={[{ q: "Domanda?", a: "Risposta." }]} />
    </div>
  );
}

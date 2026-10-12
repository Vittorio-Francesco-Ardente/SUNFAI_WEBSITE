import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { getDict } from "@/content/dict";
import { getMember, team } from "@/content/team";
import { toLite } from "@/content/team-lite";
import { pageMeta } from "@/lib/meta";
import { lhref, type Locale } from "@/lib/i18n";
import { pad2 } from "@/lib/motion";
import { Eyebrow, GhostNumeral, Headline } from "@/components/ui/primitives";
import { MemberBackdrop } from "@/components/geometry/shapes";
import { CanvasPanel, HalfDisc, Person, QuarterDisc, Ripple } from "@/components/canvas/Canvas";
import { Img } from "@/components/ui/Img";
import { MemberVisual } from "@/components/team/MemberVisual";
import { SIDE_CUT_SINK } from "@/lib/people";
import { ProfileGallery, type Slide } from "@/components/team/ProfileGallery";
import { TeamRail } from "@/components/team/TeamRail";
import { MemberLinkedIn } from "@/components/team/MemberLinkedIn";

export const memberParams = () => team.map((m) => ({ slug: m.slug }));

export const memberMeta = (locale: Locale, slug: string) => {
  const d = getDict(locale);
  const m = getMember(slug)!;
  const name = `${m.firstName} ${m.lastName}`;
  return pageMeta(locale, `/team/${slug}/`, `${name} · ${d.team.page.metaTitle}`, d.team.profile.metaDescription.replace("{name}", name).replace("{group}", d.team.groups[m.group].label.toLowerCase()));
};

const PEACH_FAN = ["#F8B98A", "#F5C335", "#FFFFFF", "#F26A1B", "#FBE39B", "#F8B98A", "#F5C335", "#FFFFFF", "#B9D68F"];
const LANDSCAPES = ["/landscapes/landscape-village-street-houses.webp", "/landscapes/landscape-plain-mountains-wide.webp", "/landscapes/landscape-country-road-village.webp", "/landscapes/landscape-olive-hills-panorama.webp"];

/**
 * Member profile, V3 (CONCEPT_PROFILE_V3 + mockup 03). One peach canvas panel: a peach fan ripple centred on the
 * RIGHT edge at mid-height, an inverted leaf ripple top-right, a pale sun at the bottom. Right: the member's pose
 * (≈ 85 % of the panel) standing on the bottom edge in front of the ripple — or, without a photo, a huge initials
 * disc on the ripple core. Left: back link, group, the name on two lines (first ink, last orange + yellow dot),
 * role, lead, the gallery rail on a plate and the three columns (Cosa faccio · Progetti · Scrivimi / punto di vista).
 * Phones: name → role → lead → the person on the panel's bottom edge; gallery + columns follow in their own panel.
 * Then ONE compact rail "Nello stesso gruppo" and prev/next. No other grids.
 */
export function MemberPage({ locale, slug }: { locale: Locale; slug: string }) {
  const d = getDict(locale);
  const t = d.team;
  const pr = t.profile;
  const raw = getMember(slug)!;
  const m = toLite(raw, d, locale);
  const i = m.index;
  const prev = toLite(team[(i - 1 + team.length) % team.length], d, locale);
  const next = toLite(team[(i + 1) % team.length], d, locale);
  const colleagues = team.filter((x) => x.group === raw.group && x.slug !== raw.slug).map((x) => toLite(x, d, locale));
  const g = t.groups[m.group];
  const big = m.pose ?? m.photo;
  const sink = big ? (SIDE_CUT_SINK[big] ?? 0) : 0;
  const lead = raw.bio ? (locale === "lmo" ? (raw.bio.lmo ?? raw.bio.it) : raw.bio.it) : pr.oneLiner;
  const contactHref = `${lhref(locale, "/contatti/")}?persona=${m.slug}#scrivici`;

  // gallery: portrait on its backdrop · pose · a Memphis scene for the role · a territory landscape · initials card
  const slides: Slide[] = [];
  if (m.photo) slides.push({ key: "portrait", label: m.name, content: <MemberVisual m={m} sizes="(max-width: 767px) 44vw, 12vw" photoComing={t.section.photoComing} /> });
  if (m.pose) slides.push({ key: "pose", label: pr.slides.pose, content: <MemberVisual m={m} usePose backdrop={(((m.backdrop + 2) % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6} sizes="(max-width: 767px) 44vw, 12vw" photoComing={t.section.photoComing} /> });
  slides.push({
    key: "scena",
    label: m.group === "board" ? pr.slides.assemblee : pr.slides.quotidiano,
    content: <Img src={m.group === "board" ? "/scenes/scene-05-teamwork-ufficio.webp" : "/scenes/scene-01-consulenza-laptop.webp"} alt={m.group === "board" ? pr.sceneBoardAlt : pr.sceneTeamAlt} sizes="(max-width: 767px) 44vw, 12vw" className="h-full w-full bg-white object-contain p-2" />,
  });
  slides.push({ key: "territorio", label: d.home.about.landscapeAlt, content: <Img src={LANDSCAPES[i % LANDSCAPES.length]} alt={d.home.about.landscapeAlt} sizes="(max-width: 767px) 44vw, 12vw" className="h-full w-full object-cover" /> });
  slides.push({
    key: "initials",
    label: pr.slides.initials,
    content: (
      <>
        <MemberBackdrop n={(((m.backdrop + 3) % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6} className="absolute inset-0 h-full w-full" />
        <span aria-hidden className="absolute left-1/2 top-1/2 grid aspect-square w-[50%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream font-display text-[1.7rem] font-extrabold tracking-[-0.04em] text-ink">
          {m.initials}
        </span>
      </>
    ),
  });

  const details: ReactNode = (
    <>
      <ProfileGallery slides={slides} labels={{ region: pr.gallery, prev: pr.galleryPrev, next: pr.galleryNext }} />
      <div className="mt-8 grid gap-7 md:grid-cols-3 md:gap-6">
        <div>
          <h2 className="flex items-center gap-2.5 font-display text-[1.3rem] font-extrabold tracking-[-0.02em] text-ink">
            <span aria-hidden className="block size-[18px] rounded-tl-full bg-[#4B8B2F]" />
            {pr.blocks.cosaFaccio}
          </h2>
          <p className="mt-2 text-[16px] leading-relaxed text-slate">{m.group === "board" ? pr.blocks.assembleeText : g.summary}</p>
        </div>
        <div>
          <h2 className="flex items-center gap-2.5 font-display text-[1.3rem] font-extrabold tracking-[-0.02em] text-ink">
            <span aria-hidden className="block size-[18px] rounded-full bg-[#F5C335]" />
            {pr.blocks.progetti}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {pr.projects.map((x) => (
              <li key={x} className="rounded-full bg-white px-3 py-1.5 text-[14px] font-medium text-ink">
                {x}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="flex items-center gap-2.5 font-display text-[1.3rem] font-extrabold tracking-[-0.02em] text-ink">
            <span aria-hidden className="block size-[18px] rounded-tl-full bg-[#F26A1B]" />
            {m.quote ? pr.slides.puntoDiVista : pr.write}
          </h2>
          {m.quote ? (
            <blockquote className="mt-2 text-[16px] leading-relaxed text-ink">{m.quote}</blockquote>
          ) : (
            <>
              <p className="mt-2 text-[16px] leading-relaxed text-slate">{pr.writeSub.replace("{first}", m.firstName)}</p>
              <Link href={contactHref} className="btn btn--dark btn--md mt-4">
                {pr.write}
                <ArrowRight aria-hidden strokeWidth={2.2} />
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      <CanvasPanel
        tone="peach"
        data-section="hero"
        phoneUnit={1.7}
        className="hero-scope cp-first flex flex-col lg:block"
        bg={
          <>
            <Ripple at={{ x: 1, y: 0.5 }} atSm={{ x: 1, y: 0.78 }} scaleSm={1.1} family="peach" core={0.085} widths={[0.1, 0.07, 0.08, 0.09]} fan={{ count: 9, from: 92, to: 268, colors: PEACH_FAN, bandColor: "#FEF6EE" }} />
            <Ripple at={{ x: 1, y: 0 }} family="leaf" core={0.035} widths={[0.03, 0.03]} invert bands={2} coreColor="#E7F0D8" />
            <HalfDisc at={{ x: 0.6, y: 1 }} r={0.03} edge="bottom" fill="#F5C335" hideSm />
            <QuarterDisc corner="bl" r={0.06} fill="#4B8B2F" className="max-md:hidden" />


          </>
        }
      >
        <div className="container-x relative z-[2] pb-8 pt-6 sm:pt-10 lg:pb-[clamp(48px,5vw,72px)]">
          <div className="relative min-w-0 lg:w-[58%]">
            <Link href={lhref(locale, "/team/")} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ink hover:text-orange-text">
              <ArrowLeft className="size-4" aria-hidden /> {pr.back}
            </Link>
            <GhostNumeral n={pad2(i + 1)} className="!right-[-30%] top-14 max-lg:!right-0 !text-[rgb(242_106_27/.1)]" />
            <Eyebrow className="relative mt-5">{g.label}</Eyebrow>
            <Headline text={`${m.firstName}|*${m.lastName}*`} as="h1" size="h1" className="is-in relative mt-4 !text-[clamp(3rem,1rem+6.6vw,7.4rem)] [text-wrap:balance]" />
            <div className="relative mt-4 flex min-w-0 flex-wrap items-center gap-3">
              <p className="font-display text-[clamp(1.15rem,1rem+.5vw,1.45rem)] font-bold tracking-[-0.02em] text-ink">{m.group === "board" ? m.roleLine : g.lead}</p>
              <MemberLinkedIn href={m.linkedin} name={m.name} />
            </div>
            <p className="t-lead relative mt-2 max-w-[40rem]">{lead}</p>
            <div className="mt-8 hidden lg:block">{details}</div>
          </div>
        </div>

        {/* the person (or the initials disc) on the panel's bottom edge */}
        <div className="cp-stage relative lg:static" style={{ ["--sm-h" as string]: "clamp(340px, 100cqw, 520px)" }}>
          {big ? (
            // non-clipping wrapper: carries the side-cut sink (the person's own transform is used by the entrance)
            <span className="absolute inset-0 [--h:1] lg:[--h:.66] xl:[--h:.7]" style={{ transform: `translateY(calc(var(--h) * ${((sink / (1 - sink)) * 100).toFixed(2)}%))` }}>
              <Person
                src={big}
                alt={d.common.ui.personAlt.replace("{name}", m.name)}
                priority
                sizes="(max-width: 1023px) 90vw, 42vw"
                className="left-1/2 -translate-x-1/2 lg:left-auto lg:right-[3%] lg:translate-x-0"
                style={{ height: `calc(var(--h) * ${(100 / (1 - sink)).toFixed(2)}%)` }}
              />
            </span>
          ) : (
            <span
              role="img"
              aria-label={t.section.photoComing.replace("{name}", m.name)}
              className="absolute left-1/2 top-1/2 grid aspect-square w-[min(72%,300px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream font-display text-[clamp(4rem,12cqw,7.5rem)] font-extrabold tracking-[-0.05em] text-ink lg:left-auto lg:right-[6%] lg:top-[30%] lg:w-[360px] lg:translate-x-0"
            >
              {m.initials}
            </span>
          )}
        </div>
      </CanvasPanel>

      {/* phones: gallery + columns in their own panel (desktop shows them inside the hero) */}
      <CanvasPanel tone="paper" data-section="dettagli" className="lg:hidden" bg={<Ripple at={{ x: 0, y: 1 }} family="peachPale" core={0.06} widths={[0.04]} />}>
        <div className="container-x relative z-[2] py-10">{details}</div>
      </CanvasPanel>

      {/* Nello stesso gruppo: ONE compact rail + prev / next */}
      <CanvasPanel tone="mint" data-section="gruppo" bg={<Ripple at={{ x: 1, y: 0 }} family="leaf" core={0.04} widths={[0.05, 0.05, 0.05]} fan={{ count: 6, from: 182, to: 268 }} />}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <h2 className="t-h2s">{pr.sameGroup}</h2>
          <div className="mt-8">
            <TeamRail members={colleagues} locale={locale} photoComing={t.section.photoComing} labels={{ region: pr.sameGroup, prev: t.page.railPrev, next: t.page.railNext }} />
          </div>
          <nav aria-label={pr.otherProfiles} className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              { m: prev, dir: "prev" as const },
              { m: next, dir: "next" as const },
            ].map(({ m: o, dir }) => (
              <Link key={dir} href={lhref(locale, `/team/${o.slug}/`)} className={`card hover-card flex min-h-[72px] items-center gap-4 p-3 ${dir === "next" ? "flex-row-reverse text-right" : ""}`}>
                <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl">
                  <MemberVisual m={o} framing="avatar" sizes="64px" photoComing={t.section.photoComing} />
                </span>
                <span className="flex-1">
                  <span className="block text-[13px] font-semibold uppercase tracking-[0.1em] text-slate">{dir === "next" ? pr.nextPerson : pr.prevPerson}</span>
                  <span className="block font-display text-lg font-extrabold tracking-[-0.02em] text-ink">{o.name}</span>
                </span>
                {dir === "next" ? <ArrowRight className="hc-arrow mx-2 size-5" aria-hidden /> : <ArrowLeft className="mx-2 size-5" aria-hidden />}
              </Link>
            ))}
          </nav>
        </div>
      </CanvasPanel>
    </>
  );
}

import { Award } from "lucide-react";
import { getDict } from "@/content/dict";
import { milestoneItems } from "@/content/milestones";
import { memoryPhotos } from "@/content/memory-photos";
import { pageMeta } from "@/lib/meta";
import { lhref, type Locale } from "@/lib/i18n";
import { ButtonLink, Eyebrow, Headline, TextLink } from "@/components/ui/primitives";
import { Badge, CornerSunrise } from "@/components/geometry/shapes";
import { Img } from "@/components/ui/Img";
import { SectionPanel } from "@/components/canvas/presets";
import { Confetto, HalfDisc, Ripple } from "@/components/canvas/Canvas";
import { PageHero } from "@/components/sections/PageHero";
import { MemoryRoom } from "@/components/memory-room/MemoryRoom";
import { AchievementsCarousel } from "@/components/awards/AchievementsCarousel";
import { AwardsSqueeze } from "@/components/awards/AwardsSqueeze";
import { JoinContact } from "@/components/sections/JoinContact";

export const riconoscimentiMeta = (locale: Locale) => {
  const r = getDict(locale).riconoscimenti;
  return pageMeta(locale, "/riconoscimenti/", r.meta.title, r.meta.description);
};

/**
 * /riconoscimenti, V3: cream hero (Andrea Zonca on a corner sun) → premio → the memory room (mint panel, curved visual image gallery) → traguardi → squeeze → press → join/contact. Panels separated by paper gaps.
 */
export function RiconoscimentiPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const r = d.riconoscimenti;
  const items = milestoneItems(d).map((m) => ({ ...m, href: m.href ? lhref(locale, m.href) : null }));
  const backdrops = [1, 5, 2, 6, 3, 4, 1, 5, 2] as const;

  return (
    <>
      <PageHero
        eyebrow={r.hero.eyebrow}
        title={r.hero.title}
        lead={r.hero.lead}
        actions={
          <ButtonLink href="#stanza-dei-ricordi" variant="dark" size="lg">
            {r.hero.cta}
          </ButtonLink>
        }
        tone="cream"
        bg={
          <>
            <Ripple at={{ x: 1, y: 1 }} atSm={{ x: 1, y: 0.82 }} family="sun" core={0.25} widths={[0.17, 0.08, 0.07, 0.07]} fan={{ count: 12, from: 92, to: 178 }} scaleSm={0.8} />
            <Ripple at={{ x: 0, y: 0 }} family="leaf" core={0.035} widths={[0.03, 0.035]} bands={2} />
            <Confetto at={{ x: 0.5, y: 0.14 }} r={0.011} fill="#F26A1B" ring hideSm />
          </>
        }
        person={{ src: "/people/poses/andrea-zonca--pose-three-quarter.webp", alt: r.hero.presenterAlt, height: "lg:h-[88%]" }}
      />

      {/* Il premio */}
      <SectionPanel data-section="premio" tone="paper" preset="content" family="sun" mirror inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)] grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="reveal card relative overflow-hidden lg:col-span-6">
            <Badge n={1} className="absolute right-0 top-0 z-[1] w-28 rounded-tr-[var(--radius-card)]" />
            <div className="relative flex aspect-[4/4.2] flex-col justify-between overflow-hidden p-8 sm:aspect-[4/3] lg:aspect-[4/4.2] lg:p-12" style={{ background: "var(--color-peach-light)" }}>
              <CornerSunrise className="absolute -bottom-[6%] -right-[6%] w-[62%]" />
              <span className="relative inline-flex items-center gap-2 self-start rounded-full bg-ink px-4 py-2 text-[14px] font-bold text-white">
                <Award className="size-4 text-solar" aria-hidden /> {r.premio.badge}
              </span>
              <p className="relative font-display font-extrabold leading-[0.88] tracking-[-0.05em] text-ink">
                <span className="block text-[clamp(2.4rem,1.6rem+3vw,4.4rem)]">{r.premio.big[0]}</span>
                <span className="block text-[clamp(2.4rem,1.6rem+3vw,4.4rem)]">{r.premio.big[1]}</span>
                <span className="block text-[clamp(4.5rem,3rem+6vw,9rem)] text-orange">{r.premio.big[2]}</span>
              </p>
            </div>
          </div>
          <div className="reveal lg:col-span-6">
            <Eyebrow>{r.premio.eyebrow}</Eyebrow>
            <Headline text={r.premio.title} className="mt-5" />
            <div className="t-body mt-6 grid max-w-[36rem] gap-4">
              {r.premio.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <dl className="card mt-8 grid max-w-[36rem] grid-cols-3 overflow-hidden">
              {r.premio.facts.map((f, i) => (
                <div key={f.k} className={`p-4 ${i ? "border-l border-[var(--color-hairline)]" : ""}`}>
                  <dt className="text-[13px] font-semibold uppercase tracking-[0.1em] text-orange-text">{f.k}</dt>
                  <dd className="mt-1 font-display text-[1.05rem] font-extrabold tracking-[-0.02em]">{f.v}</dd>
                </div>
              ))}
            </dl>
            <TextLink href="/notizie/sun-fai-eletta-migliore-cer-italia-2024/" locale={locale} className="mt-6">
              {r.premio.readNews}
            </TextLink>
          </div>
        </div>
      </SectionPanel>

      {/* La stanza dei ricordi — mint inset panel */}
      <SectionPanel data-section="memory-room" tone="mint" preset="corner" family="leaf" mirror id="stanza-dei-ricordi" inner={false}>
        <div className="relative z-[2] overflow-hidden px-4 py-[clamp(48px,6vw,80px)] sm:px-8">
          <div className="mx-auto max-w-[var(--container)]">
            <div className="reveal text-center">
              <Eyebrow tone="leaf" className="justify-center">
                {r.memory.eyebrow}
              </Eyebrow>
              <Headline text={r.memory.title} className="mx-auto mt-5" />
            </div>
            <div className="mt-8">
              <MemoryRoom
                items={[...memoryPhotos]}
                labels={{ region: r.memory.region, live: r.memory.live, prev: r.memory.prev, next: r.memory.next, open: r.memory.open, loading: r.memory.loading, yearUnknown: r.yearUnknown }}
              />
            </div>
          </div>
        </div>
      </SectionPanel>

      {/* Traguardi — achievements carousel */}
      <SectionPanel data-section="traguardi" tone="cream" preset="soft" family="sun" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal mb-10 max-w-[44rem]">
            <Eyebrow>{r.traguardi.eyebrow}</Eyebrow>
            <Headline text={r.traguardi.title} className="mt-5" />
            <p className="t-lead mt-4">{r.traguardi.lead}</p>
          </div>
          <AchievementsCarousel
            labels={{ region: r.traguardi.eyebrow, live: r.memory.live, prev: r.traguardi.prev, next: r.traguardi.next }}
            items={items.map((m, i) => ({
              id: m.id,
              year: m.year ?? r.yearUnknown,
              label: m.label,
              title: m.title,
              description: m.caption,
              image: { src: m.image, alt: m.alt },
              backdrop: backdrops[i % backdrops.length],
              links: m.href ? [{ label: r.traguardi.readArticle, href: m.href }] : [],
            }))}
          />
        </div>
        
      </SectionPanel>

      {/* Anno per anno — awards squeeze */}
      <SectionPanel data-section="squeeze" tone="paper" preset="content" family="peach" mirror inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal mb-10 max-w-[44rem]">
            <Eyebrow>{r.squeeze.eyebrow}</Eyebrow>
            <Headline text={r.squeeze.title} tone="leaf" className="mt-5" />
          </div>
          <AwardsSqueeze items={milestoneItems(d)} t={r.squeeze} locale={locale} yearUnknown={r.yearUnknown} height="h-[600px]" />
        </div>
      </SectionPanel>

      {/* Dicono di noi */}
      <SectionPanel data-section="press" tone="mint" preset="corner" family="leaf" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="reveal">
            <Eyebrow>{d.home.press.eyebrow}</Eyebrow>
            <Headline text={d.home.press.title} className="mt-5" />
          </div>
          <ul className="rail rail--to-grid mt-10 pb-2 md:gap-4" style={{ ["--cols" as string]: 3 }}>
            {d.home.press.items.map((p, i) => (
              <li key={p.title} className="reveal">
                <article className="card hover-card relative flex h-full flex-col overflow-hidden p-6 sm:p-7">
                  <Badge n={([2, 4, 1] as const)[i]} className="absolute right-0 top-0 w-24 rounded-tr-[var(--radius-card)]" />
                  <h3 lang="it" className="t-h3 pr-16">{p.title}</h3>
                  <p lang="it" className="t-body mt-3 flex-1 !text-[16px]">{p.text}</p>
                  <p className="mt-5 text-[14px] font-semibold text-orange-text">{p.source}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </SectionPanel>

      <JoinContact d={d.common.joinContact} locale={locale} personAlt={d.common.ui.personAlt} />
    </>
  );
}

import { getDict } from "@/content/dict";
import { teamLite } from "@/content/team-lite";
import { pageMeta } from "@/lib/meta";
import type { Locale } from "@/lib/i18n";
import { Eyebrow, Headline } from "@/components/ui/primitives";
import { CanvasPanel, HalfDisc, PanelMascot, Ripple } from "@/components/canvas/Canvas";
import { TeamShowcase } from "@/components/team/TeamShowcase";
import { JoinContact } from "@/components/sections/JoinContact";

export const teamMeta = (locale: Locale) => {
  const t = getDict(locale).team.page;
  return pageMeta(locale, "/team/", t.metaTitle, t.metaDescription);
};

/**
 * /team, V3 (16.4): the CONCEPT_2/3/4 structure and nothing else. The showcase cycles through all 12 (group switch
 * filters it) — NO grid of members. Then ONE different panel ("Dodici persone, una cooperativa." with the group
 * counts on a leaf ripple, the waving mascot), then the CTA pair. That's all.
 */
export function TeamPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const t = d.team;
  const members = teamLite(d, locale);
  const board = members.filter((m) => m.group === "board");
  const ops = members.filter((m) => m.group === "team");

  return (
    <>
      <CanvasPanel
        tone="paper"
        data-section="hero"
        id="persone"
        className="hero-scope cp-first"
        bg={
          <>
            <Ripple at={{ x: 1, y: 0 }} family="leaf" core={0.04} widths={[0.035, 0.04, 0.03]} invert bands={3} coreColor="#E7F0D8" />
            <Ripple at={{ x: 0, y: 1 }} family="peach" core={0.05} widths={[0.045, 0.04]} bands={2} />
            <HalfDisc at={{ x: 0.55, y: 1 }} r={0.022} edge="bottom" fill="#F5C335" hideSm />
          </>
        }
      >
        <div className="container-x relative z-[2] pb-[clamp(48px,6vw,88px)] pt-6 sm:pt-10">
          <TeamShowcase members={members} t={t.section} locale={locale} as="h1" ctaHref="/team/#dodici" filters={{ label: t.page.filtersLabel, all: d.common.ui.all, board: t.groups.board.label, team: t.groups.team.label }} />
        </div>
      </CanvasPanel>

      {/* Dodici persone, una cooperativa — leaf ripple panel with the waving mascot */}
      <CanvasPanel
        tone="mint"
        data-section="dodici"
        id="dodici"
        phoneUnit={1.4}
        bg={
          <>
            <Ripple at={{ x: 1, y: 1 }} family="leaf" core={0.07} widths={[0.1, 0.07, 0.07, 0.08]} fan={{ count: 8, from: 92, to: 178 }} />
            <Ripple at={{ x: 0, y: 0 }} family="sun" core={0.035} widths={[0.03, 0.03]} bands={2} />

          </>
        }
      >
        <div className="container-x relative z-[2] grid gap-8 py-[clamp(48px,6vw,88px)] lg:grid-cols-12 lg:items-start max-lg:pb-[clamp(220px,58cqw,280px)]">
          <div className="lg:col-span-5">
            <Eyebrow tone="leaf">{t.page.dodiciEyebrow}</Eyebrow>
            <Headline text={t.page.dodiciTitle} className="mt-5" />
            <p className="t-lead mt-6">{t.page.dodiciLead}</p>
          </div>
          <ul className="reveal-stagger grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:mr-[27%]">
            {(["board", "team"] as const).map((g) => (
              <li key={g} className="rounded-[24px] bg-white p-6 shadow-[0_18px_30px_-24px_rgb(5_42_34/.45)] sm:p-7">
                <p className="font-display text-[2.6rem] font-extrabold leading-none tracking-[-0.05em] text-orange">{g === "board" ? board.length : ops.length}</p>
                <h3 className="t-h3 mt-3">{t.groups[g].label}</h3>
                <p className="t-body mt-2 !text-[16px]">{t.groups[g].summary}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {t.groups[g].tags.map((tag) => (
                    <span key={tag} className="pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <PanelMascot src="/mascot/mascot-09-waving-wink.webp" alt={d.common.ui.mascotAlt} className="bottom-[24px] right-[4%] w-[clamp(170px,19cqw,270px)]" />
      </CanvasPanel>

      <JoinContact d={d.common.joinContact} locale={locale} personAlt={d.common.ui.personAlt} />
    </>
  );
}

import { getDict } from "@/content/dict";
import { pageMeta } from "@/lib/meta";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { SectionPanel } from "@/components/canvas/presets";
import { PageHero } from "@/components/sections/PageHero";
import { Ripple } from "@/components/canvas/Canvas";

export const notelegaliMeta = (locale: Locale) => {
  const p = getDict(locale).pages.legal;
  return pageMeta(locale, "/note-legali/", p.meta.title, p.meta.description);
};

/** Legal page: geometry only (people are never used next to legal text, pack 10.1). */
export function NoteLegaliPage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const p = d.pages.legal;
  return (
    <>
      <PageHero
        eyebrow={p.eyebrow}
        title={p.title}
        tone="mint"
        className="lg:!min-h-[560px]"
        bg={
          <>
            <Ripple at={{ x: 1, y: 1 }} family="leaf" core={0.07} widths={[0.09, 0.06, 0.06, 0.07]} fan={{ count: 7, from: 92, to: 178 }} />
            <Ripple at={{ x: 0, y: 0 }} family="peach" core={0.03} widths={[0.03, 0.03]} bands={2} />
          </>
        }
        mascot={{ src: "/mascot/mascot-02-presenting.webp", alt: d.common.ui.mascotAlt }}
      />
      <SectionPanel data-section="legal" tone="paper" preset="soft" family="leaf" inner={false}>
        <div className="container-x relative z-[2] py-[clamp(48px,6vw,88px)]">
          <div className="mx-auto grid max-w-[60rem] gap-12">
            <section>
              <h2 className="t-h3 !text-[1.5rem]">{p.company}</h2>
              <dl className="card mt-5 grid overflow-hidden sm:grid-cols-2">
                {[
                  [p.labels.name, site.legalName],
                  [p.labels.seat, `${site.address.street}, ${site.address.postalCode} ${site.address.city} (${site.address.province})`],
                  [p.labels.vat, site.vat],
                  [p.labels.contact, site.email],
                ].map(([k, v]) => (
                  <div key={k} className="border-b border-[var(--color-hairline)] p-5 sm:odd:border-r">
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.1em] text-orange-text">{k}</dt>
                    <dd className="mt-1 font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="t-body">
              <h2 className="t-h3 !text-[1.5rem] text-ink">{p.privacy}</h2>
              <div lang="it" className="mt-5 grid gap-4">
                {p.paragraphs.map((x) => (
                  <p key={x.b}>
                    <strong className="text-ink">{x.b}</strong> {x.t}
                  </p>
                ))}
                <p className="text-[15px]">{p.adhesion}</p>
                <p className="t-meta">{p.pending}</p>
              </div>
            </section>
          </div>
        </div>
      </SectionPanel>
    </>
  );
}

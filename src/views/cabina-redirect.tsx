import { getDict } from "@/content/dict";
import { configurations } from "@/lib/configurations";
import { pageMeta } from "@/lib/meta";
import { lhref, type Locale } from "@/lib/i18n";
import { absoluteUrl, asset } from "@/lib/asset";

/**
 * /ardake/[cabina] (e.g. the old URL /ardake/AC001E01466): static meta-refresh to /ardake/monitoraggio/#<code>,
 * plus /ardake/dashboard (the demo's URL) → /ardake/demo/.
 */
export const cabinaParams = () => [...configurations.map((c) => ({ cabina: c.code })), { cabina: "dashboard" }];

const target = (locale: Locale, cabina: string) => (cabina === "dashboard" ? lhref(locale, "/ardake/demo/") : `${lhref(locale, "/ardake/monitoraggio/")}#${cabina}`);

export const cabinaMeta = (locale: Locale, cabina: string) => {
  const m = getDict(locale).ardake.monitor;
  return { ...pageMeta(locale, "/ardake/monitoraggio/", m.metaTitle, m.metaDescription, { noindex: true }), alternates: { canonical: absoluteUrl(target(locale, cabina).split("#")[0]) } };
};

export function CabinaPage({ locale, cabina }: { locale: Locale; cabina: string }) {
  const m = getDict(locale).ardake.monitor;
  const url = asset(target(locale, cabina));
  return (
    <section data-section="redirect" className="sf-section section-y">
      <meta httpEquiv="refresh" content={`0; url=${url}`} />
      <div className="container-x">
        <p className="t-lead">{m.cabinaRedirect.replace("{code}", cabina)}</p>
        <a href={url} className="btn btn--primary btn--md mt-6">
          {m.metaTitle}
        </a>
      </div>
    </section>
  );
}

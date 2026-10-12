import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Download, Mail } from "lucide-react";
import { getDict } from "@/content/dict";
import { pageMeta } from "@/lib/meta";
import { lhref, type Locale } from "@/lib/i18n";
import { asset } from "@/lib/asset";
import { site } from "@/lib/site";
import { Eyebrow, Headline } from "@/components/ui/primitives";

export const compilazioneMeta = (locale: Locale) => {
  const s = getDict(locale).socio.compilazione;
  return pageMeta(locale, "/diventa-socio/compilazione/", s.metaTitle, s.metaDescription);
};

const FILES = ["SUNFAI_01_Manifestazione_di_interesse", "SUNFAI_02_Ammissione_socio_persona_fisica", "SUNFAI_03_Ammissione_socio_persona_giuridica", "SUNFAI_04_Modulo_di_adesione"];

/** /diventa-socio/compilazione (demo): the online modules embedded full height + "Apri a schermo intero" + fallbacks. */
export function CompilazionePage({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const c = d.socio.compilazione;
  const docs = d.socio.docs.items;
  return (
    <section data-section="compilazione" className="sf-section pb-[clamp(56px,8vw,120px)] pt-6 sm:pt-10">
      <div className="container-x">
        <Link href={lhref(locale, "/diventa-socio/")} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ink/75 hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> {c.back}
        </Link>
        <div className="mt-4 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <Headline text={c.title} as="h1" size="h1" className="is-in mt-5" />
            <p className="t-lead mt-5 max-w-[40rem]">
              {c.lead} {d.common.ui.inItalian}
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <a href={asset("/moduli/index.html?from=site#02")} className="btn btn--dark btn--md max-sm:w-full">
              {c.fullscreen}
              <ArrowUpRight aria-hidden />
            </a>
          </div>
        </div>

        <nav aria-label={c.choose} className="mt-8 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {docs.map((doc) => (
            <a key={doc.code} href={asset(`/moduli/index.html?from=site#${doc.code}`)} className="chip shrink-0 whitespace-nowrap">
              {doc.code} · {doc.title}
            </a>
          ))}
        </nav>

        <div className="card mt-4 overflow-hidden">
          <iframe src={asset("/moduli/index.html#02")} title={c.iframeTitle} className="block h-[80svh] min-h-[620px] w-full bg-white" loading="lazy" />
        </div>

        <div className="mt-8 grid gap-6 rounded-[var(--radius-card)] bg-paper-2 p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="font-display text-[1.25rem] font-extrabold tracking-[-0.02em] text-ink">{c.problem}</p>
            <p className="t-body mt-2 !text-[16px]">{c.problemText}</p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 lg:col-span-7">
            {docs.map((doc, i) => (
              <li key={doc.code}>
                <a href={asset(`/moduli/pdf/${FILES[i]}.pdf`)} download className="flex min-h-12 items-center gap-3 rounded-2xl bg-card px-4 py-3 text-[15px] font-semibold text-ink shadow-[0_0_0_1px_var(--color-hairline)]">
                  <Download className="size-4 shrink-0 text-orange-text" aria-hidden />
                  {doc.title}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}?subject=${encodeURIComponent(c.mailSubject)}`} className="flex min-h-12 items-center gap-3 rounded-2xl bg-card px-4 py-3 text-[15px] font-semibold text-ink shadow-[0_0_0_1px_var(--color-hairline)]">
                <Mail className="size-4 shrink-0 text-leaf-text" aria-hidden />
                {c.write}
              </a>
            </li>
            <li>
              <Link href={lhref(locale, "/contatti/")} className="flex min-h-12 items-center gap-3 rounded-2xl bg-card px-4 py-3 text-[15px] font-semibold text-ink shadow-[0_0_0_1px_var(--color-hairline)]">
                <ArrowUpRight className="size-4 shrink-0 text-leaf-text" aria-hidden />
                {c.other}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { getDict } from "@/content/dict";
import { flatten } from "@/lib/flatten";
import review from "@/content/lmo/review.json";
import { devPagesEnabled } from "./dev-styleguide";
import { Headline } from "@/components/ui/primitives";

export const bergamascoMeta = (_l: Locale) => ({ title: "Revisione bergamasco", robots: { index: false } });

type Review = Record<string, { reviewed: boolean; note?: string }>;

/**
 * /dev/bergamasco (pack 14.1 §8, not in production): key | Italiano | Bergamàsch | status | note.
 * Export/import for the native reviewer: `npm run lmo:export` → review/bergamasco-review.csv, `npm run lmo:import`.
 */
export function BergamascoPage({ locale: _locale }: { locale: Locale }) {
  if (!devPagesEnabled()) notFound();
  const it = flatten(getDict("it"));
  const lmo = flatten(getDict("lmo"));
  const r = review as Review;
  const keys = Object.keys(it);
  const done = keys.filter((k) => r[k]?.reviewed).length;
  return (
    <div className="container-x section-y">
      <Headline text="Revisione|*bergamasco*" as="h1" size="h1" className="is-in" />
      <p className="t-lead mt-4">
        {done} / {keys.length} revisionate · {keys.filter((k) => lmo[k] === it[k]).length} identiche all&apos;italiano (da verificare o da lasciare in italiano).
      </p>
      <div className="card mt-8 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-[14px]">
          <thead className="sticky top-0 bg-card text-[13px] uppercase tracking-[0.08em] text-slate">
            <tr>
              <th className="p-3">Chiave</th>
              <th className="p-3">Italiano</th>
              <th className="p-3">Bergamàsch</th>
              <th className="p-3">Stato</th>
              <th className="p-3">Nota</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k} className="border-t border-[var(--color-hairline)] align-top">
                <td className="p-3 font-mono text-[13px] text-slate">{k}</td>
                <td className="p-3">{it[k]}</td>
                <td className="p-3" lang="lmo">
                  {lmo[k]}
                </td>
                <td className="p-3">{r[k]?.reviewed ? "reviewed" : "draft"}</td>
                <td className="p-3 text-slate">{r[k]?.note ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

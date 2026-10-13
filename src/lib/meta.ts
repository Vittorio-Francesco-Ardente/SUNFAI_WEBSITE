import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/asset";
import { lhref, localeMeta, type Locale } from "@/lib/i18n";

/**
 * Per-page metadata: localized title/description, canonical per locale, hreflang pairs (it, lmo, x-default → it).
 * `path` is the Italian path with a trailing slash ("/team/").
 */
export function pageMeta(locale: Locale, path: string, title: string | null, description: string, opts: { noindex?: boolean } = {}): Metadata {
  const itUrl = absoluteUrl(path);
  const lmoUrl = absoluteUrl(lhref("lmo", path));
  return {
    title: title ?? undefined,
    description,
    alternates: {
      canonical: locale === "it" ? itUrl : lmoUrl,
      // "lmo" is a valid BCP 47 tag but not in Next's typed list
      languages: { it: itUrl, lmo: lmoUrl, "x-default": itUrl } as Record<string, string>,
    },
    openGraph: {
      type: "website",
      locale: locale === "it" ? "it_IT" : "lmo_IT",
      siteName: "SUN-FAI",
      title: title ?? "SUN-FAI",
      description,
      url: locale === "it" ? itUrl : lmoUrl,
      images: [{ url: absoluteUrl("/social/sunfai-loader-preview.jpg"), width: 1200, height: 630, alt: "SUN-FAI — Comunità energetica" }],
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? "SUN-FAI",
      description,
      images: [absoluteUrl("/social/sunfai-loader-preview.jpg")],
    },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    other: { "content-language": localeMeta[locale].htmlLang },
  };
}

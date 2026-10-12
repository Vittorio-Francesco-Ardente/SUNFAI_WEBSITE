import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/asset";
import { lhref } from "@/lib/i18n";
import { team } from "@/content/team";
import { articles } from "@/content/news";

export const dynamic = "force-static";

const STATIC = ["/", "/chi-siamo/", "/cosa-facciamo/", "/team/", "/le-cer/", "/riconoscimenti/", "/notizie/", "/ardake/", "/ardake/monitoraggio/", "/ardake/demo/", "/diventa-socio/", "/diventa-socio/compilazione/", "/contatti/", "/note-legali/"];

/** sitemap.xml with IT + Bergamasque URLs and hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...STATIC, ...team.map((m) => `/team/${m.slug}/`), ...articles.map((a) => `/notizie/${a.slug}/`)];
  return paths.flatMap((p) => {
    const languages = { it: absoluteUrl(p), lmo: absoluteUrl(lhref("lmo", p)) };
    return [
      { url: absoluteUrl(p), changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7, alternates: { languages } },
      { url: absoluteUrl(lhref("lmo", p)), changeFrequency: "monthly" as const, priority: 0.4, alternates: { languages } },
    ];
  });
}

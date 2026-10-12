import { ArrowUpRight } from "lucide-react";
import feedJson from "@/content/social-feed.json";
import { Img } from "@/components/ui/Img";
import { Badge } from "@/components/geometry/shapes";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { formatDate, type Locale } from "@/lib/i18n";
import { social } from "@/lib/site";
import type { Channel, SocialFeed as Feed } from "@/lib/social-types";
import type { Dict } from "@/content/dict";

const feed = feedJson as Feed;
const ICON: Record<Channel, typeof InstagramIcon> = { instagram: InstagramIcon, linkedin: LinkedinIcon, facebook: FacebookIcon };

/**
 * "Dalla comunità" / "L'ultimo post di ogni canale" (pack 11): build-time JSON refreshed by a scheduled GitHub
 * Action. No client fetch, no tokens, no third-party widgets. Channels without posts show a profile card.
 */
export function SocialFeed({ t, ui, locale, mode = "home" }: { t: Dict["home"]["social"]; ui: Dict["common"]["ui"]; locale: Locale; mode?: "home" | "latest-per-channel" }) {
  const channels = (["instagram", "linkedin", "facebook"] as Channel[]).filter((c) => social[c].url);
  let posts = [...feed.posts].sort((a, b) => b.date.localeCompare(a.date));
  if (mode === "latest-per-channel") posts = channels.map((c) => posts.find((p) => p.channel === c)).filter(Boolean) as typeof posts;
  posts = posts.slice(0, 6);
  const empty = channels.filter((c) => !posts.some((p) => p.channel === c));

  return (
    <div>
      <ul aria-label={t.region} className="rail rail--to-grid pb-2 [--rail-item:86%] md:gap-4" style={{ ["--cols" as string]: 3 }}>
        {posts.map((p, i) => {
          const Icon = ICON[p.channel];
          return (
            <li key={p.id} className={i === 0 && posts.length > 2 ? "md:col-span-2 md:row-span-2" : undefined}>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="card hover-card group flex h-full flex-col overflow-hidden">
                {p.image ? (
                  <span className="relative block overflow-hidden">
                    <Img src={p.image.src} alt={p.image.alt} sizes="(max-width: 767px) 86vw, 33vw" className="hc-scene aspect-[4/3] h-auto w-full object-cover" />
                  </span>
                ) : (
                  <span className="relative block aspect-[4/3] bg-mint">
                    <Badge n={((i % 4) + 1) as 1 | 2 | 3 | 4} className="absolute right-0 top-0 w-28" />
                  </span>
                )}
                <span className="flex flex-1 flex-col p-5">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-slate">
                    <Icon className="size-4 text-ink" />
                    {social[p.channel].label} · {formatDate(p.date, locale)}
                  </span>
                  <span className="mt-2 line-clamp-3 text-[16px] leading-relaxed text-ink">{p.text}</span>
                  <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 font-semibold text-ink">
                    {ui.openPost}
                    <ArrowUpRight className="hc-arrow size-4" aria-hidden />
                  </span>
                </span>
              </a>
            </li>
          );
        })}
        {empty.map((c, i) => {
          const Icon = ICON[c];
          return (
            <li key={c}>
              <a href={social[c].url!} target="_blank" rel="noopener noreferrer" className="card hover-card relative flex h-full flex-col overflow-hidden p-6">
                <Badge n={(((i + 2) % 4) + 1) as 1 | 2 | 3 | 4} className="absolute right-0 top-0 w-24" />
                <span className="grid size-12 place-items-center rounded-full bg-ink text-white">
                  <Icon className="size-5" />
                </span>
                <span className="mt-5 font-display text-[1.25rem] font-extrabold tracking-[-0.02em] text-ink">{social[c].handle}</span>
                <span className="t-body mt-2 flex-1">{t.fallback}</span>
                <span className="btn btn--outline btn--sm mt-5 self-start">
                  <Icon />
                  {t.follow.replace("{channel}", social[c].label)}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

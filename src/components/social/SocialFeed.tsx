import { ArrowUpRight } from "lucide-react";
import feedJson from "@/content/social-feed.json";
import { Img } from "@/components/ui/Img";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { formatDate, type Locale } from "@/lib/i18n";
import { social } from "@/lib/site";
import type { Channel, SocialFeed as Feed } from "@/lib/social-types";
import type { Dict } from "@/content/dict";

const feed = feedJson as Feed;
const ICON: Record<Channel, typeof InstagramIcon> = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
};

/**
 * One aligned, equally-sized card per social channel. Real posts are shown only if
 * build-time data actually contains them; no invented posts or redundant CTAs.
 */
export function SocialFeed({ t, ui, locale }: { t: Dict["home"]["social"]; ui: Dict["common"]["ui"]; locale: Locale; mode?: "home" | "latest-per-channel" }) {
  const channels: Channel[] = ["instagram", "linkedin", "facebook"];
  const posts = [...feed.posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <ul aria-label={t.region} className="mx-auto grid w-full max-w-[1140px] gap-5 md:grid-cols-3 md:gap-4 lg:gap-6">
      {channels.map((channel) => {
        const entry = social[channel];
        if (!entry.url) return null;
        const Icon = ICON[channel];
        const post = posts.find((p) => p.channel === channel);
        return (
          <li key={channel} className="min-w-0">
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${entry.label} — ${entry.handle}`}
              className="group flex h-full min-h-[245px] min-w-0 flex-col overflow-hidden rounded-[28px] border border-[var(--color-hairline)] bg-white p-6 shadow-[var(--shadow-soft)] transition-[box-shadow,transform] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-white"><Icon className="size-5" /></span>
                <ArrowUpRight className="size-5 text-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
              <span className="mt-5 text-[14px] font-semibold text-orange-text">{entry.label}</span>
              <span className="mt-1 break-words font-display text-[1.16rem] font-extrabold leading-tight tracking-[-0.02em] text-ink">{entry.handle}</span>
              {post ? (
                <>
                  {post.image ? <span className="mt-4 block overflow-hidden rounded-xl"><Img src={post.image.src} alt={post.image.alt} sizes="(max-width: 767px) 86vw, 26vw" className="aspect-[16/9] h-auto w-full object-cover" /></span> : null}
                  <span className="mt-3 text-[13px] text-slate">{formatDate(post.date, locale)}</span>
                  <span className="mt-1 line-clamp-3 text-[15px] leading-relaxed text-slate">{post.text}</span>
                </>
              ) : <span className="mt-4 flex-1 text-[15px] leading-relaxed text-slate">{t.fallback}</span>}
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[14px] font-bold text-leaf-text">
                {post ? ui.openPost : t.follow.replace("{channel}", entry.label)} <ArrowUpRight className="size-4" aria-hidden />
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

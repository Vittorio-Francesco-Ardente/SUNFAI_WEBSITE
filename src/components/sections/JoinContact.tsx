import { ArrowRight, ChevronRight, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { ButtonLink, Eyebrow, Headline, TextLink } from "@/components/ui/primitives";
import { CanvasPanel, HalfDisc, Ripple } from "@/components/canvas/Canvas";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { asset } from "@/lib/asset";
import { lhref, type Locale } from "@/lib/i18n";
import { site, social } from "@/lib/site";
import type { Dict } from "@/content/dict";

const ROW = "flex min-h-12 items-center gap-3 rounded-2xl bg-card px-4 py-2 font-semibold text-ink shadow-[0_0_0_1px_var(--color-hairline)]";

/**
 * Closing pair (16.8 Home "Diventa socio + Contattaci"): two EQUAL-HEIGHT canvas panels side by side — peach (join:
 * steps + CTA, Andrea Belotti on the bottom edge) and mint (contact links, Simone on the bottom edge). Each panel has
 * its own ripple; the people fill the free corner, so neither panel has an empty half. Phones: stacked, the person
 * stands under the content on the panel's bottom edge.
 */
export function JoinContact({ d, locale, personAlt }: { d: Dict["common"]["joinContact"]; locale: Locale; personAlt: string }) {
  return (
    <div data-section="join-contact" className="mx-[clamp(8px,1.2vw,16px)] mb-[clamp(10px,1.2vw,16px)] grid gap-[clamp(10px,1.2vw,16px)] lg:grid-cols-2">
      <CanvasPanel
        tone="peach"
        className="!m-0 flex flex-col justify-center"
        phoneUnit={1.5}
        bg={
          <>
            <Ripple at={{ x: 1, y: 0 }} family="leaf" core={0.03} widths={[0.03, 0.03]} bands={2} />
            <Ripple at={{ x: 1, y: 1 }} family="sun" core={0.06} widths={[0.06, 0.05, 0.05]} bands={3} hideSm />
          </>
        }
      >
        <div className="relative z-[2] mx-auto w-full max-w-[750px] p-7 sm:p-10 lg:p-12">
          <Eyebrow>{d.joinEyebrow}</Eyebrow>
          <Headline text={d.joinTitle} size="h2s" className="mt-5" />
          <p className="t-body mt-4 !text-ink/80">{d.joinText}</p>
          <ol className="mt-6 grid gap-2.5">
            {d.steps.map((s, i) => (
              <li key={s} className="flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 text-[16px] text-ink/90">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-orange-btn font-display text-[13px] font-extrabold text-white">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <a href={asset("/moduli/index.html?from=site#02")} className="btn btn--primary btn--md">
              {d.joinCta}
              <ArrowRight aria-hidden strokeWidth={2.2} className="btn-arrow" />
            </a>
            <TextLink href="/diventa-socio/" locale={locale} className="self-center sm:self-auto">
              {d.joinSecondary}
            </TextLink>
          </div>
        </div>
      </CanvasPanel>

      <CanvasPanel
        tone="mint"
        className="!m-0 flex flex-col justify-center"
        phoneUnit={1.5}
        bg={
          <>
            <Ripple at={{ x: 1, y: 1 }} family="leaf" core={0.06} widths={[0.1, 0.07, 0.07, 0.08]} fan={{ count: 7, from: 92, to: 178 }} />
            <Ripple at={{ x: 0, y: 0 }} family="sun" core={0.03} widths={[0.03, 0.03]} bands={2} />
            <HalfDisc at={{ x: 0.4, y: 1 }} r={0.03} edge="bottom" fill="#F8B98A" hideSm />
          </>
        }
      >
        <div className="relative z-[2] mx-auto w-full max-w-[750px] p-7 sm:p-10 lg:p-12">
          <Eyebrow tone="leaf">{d.contactEyebrow}</Eyebrow>
          <Headline text={d.contactTitle} size="h2s" className="mt-5" />
          <p className="t-body mt-4">{d.contactText}</p>
          <ul className="mt-6 grid gap-2">
            <li>
              <a href={`mailto:${site.email}`} className={ROW}>
                <Mail className="size-5 shrink-0 text-leaf-text" aria-hidden />
                <span className="min-w-0 flex-1 break-words">{site.email}</span>
                <ChevronRight className="size-4 text-ink/40" aria-hidden />
              </a>
            </li>
            <li>
              <a href={social.instagram.url} target="_blank" rel="noopener noreferrer" className={ROW}>
                <InstagramIcon className="size-5 shrink-0 text-leaf-text" />
                <span className="flex-1">{social.instagram.label}</span>
                <ChevronRight className="size-4 text-ink/40" aria-hidden />
              </a>
            </li>
            <li>
              <a href={social.linkedin.url} target="_blank" rel="noopener noreferrer" className={ROW}>
                <LinkedinIcon className="size-[18px] shrink-0 text-leaf-text" />
                <span className="flex-1">{social.linkedin.label}</span>
                <ChevronRight className="size-4 text-ink/40" aria-hidden />
              </a>
            </li>
            <li>
              <a href={social.facebook.url} target="_blank" rel="noopener noreferrer" className={ROW}>
                <FacebookIcon className="size-[18px] shrink-0 text-leaf-text" />
                <span className="flex-1">{social.facebook.label}</span>
                <ChevronRight className="size-4 text-ink/40" aria-hidden />
              </a>
            </li>
            <li>
              <Link href={lhref(locale, "/contatti/")} className={ROW}>
                <MapPin className="size-5 shrink-0 text-leaf-text" aria-hidden />
                <span className="flex-1">
                  {site.address.street}, {site.address.city}
                </span>
                <ChevronRight className="size-4 text-ink/40" aria-hidden />
              </Link>
            </li>
          </ul>
          <ButtonLink href="/contatti/" locale={locale} variant="dark" className="mt-7 max-sm:w-full">
            {d.contactCta}
          </ButtonLink>
        </div>
      </CanvasPanel>
    </div>
  );
}

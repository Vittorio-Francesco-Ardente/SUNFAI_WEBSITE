import type { CSSProperties, ReactNode } from "react";
import { Eyebrow, Headline } from "@/components/ui/primitives";
import { CanvasPanel, PanelMascot, Person } from "@/components/canvas/Canvas";
import type { Tone } from "@/lib/ripples";
import { cn } from "@/lib/cn";

/**
 * Inner-page opener, V3 (16.1 map + 16.2 + 16.8 G3): every hero is its OWN canvas (tone, ripple family/position and
 * person side differ per page; none reuses the Home hero composition). The person is large (78–92 % of the panel on
 * desktop), stands on the panel's bottom edge in front of the dominant ripple, and gestures towards the text.
 * Phones: text first, then a stage block where the person stands on the panel's bottom edge (face ≥ 64 px).
 * A mascot can replace the person (Le CER: laptop inside the leaf frame).
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  actions,
  note,
  tone = "paper",
  bg,
  person,
  mascot,
  visual,
  side = "right",
  className,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  actions?: ReactNode;
  note?: ReactNode;
  tone?: Tone;
  /** the panel's ripples (16.1 per-page map) */
  bg: ReactNode;
  person?: { src: string; alt: string; height?: string; /** portraits cropped flat on their sides: sink them below the panel edge, e.g. "translate-y-[30%]" */ sink?: string };
  mascot?: { src: string; alt: string };
  /** a non-person visual for the free column (e.g. the Le CER frame) */
  visual?: ReactNode;
  side?: "left" | "right";
  className?: string;
}) {
  const left = side === "left";
  return (
    <CanvasPanel tone={tone} data-section="hero" phoneUnit={1.6} className={cn("hero-scope cp-first flex flex-col lg:block lg:min-h-[min(820px,max(640px,calc(100svh-24px)))]", className)} bg={bg}>
      <div className={cn("container-x relative z-[2] flex pb-6 pt-6 sm:pt-10 lg:min-h-[inherit] lg:items-center lg:pb-16 lg:pt-4", left && "lg:justify-end")}>
        <div className="min-w-0 lg:w-[54%]">
          <Eyebrow className="enter">{eyebrow}</Eyebrow>
          <Headline text={title} as="h1" size="h1" className="is-in mt-5 lg:mt-6" />
          {lead ? (
            <div className="t-lead enter mt-6 max-w-[36rem]" style={{ "--d": "380ms" } as CSSProperties}>
              {lead}
            </div>
          ) : null}
          {actions ? (
            <div className="enter mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-7" style={{ "--d": "460ms" } as CSSProperties}>
              {actions}
            </div>
          ) : null}
          {note ? (
            <div className="enter t-meta mt-4" style={{ "--d": "520ms" } as CSSProperties}>
              {note}
            </div>
          ) : null}
        </div>
      </div>

      {visual ? <div className={cn("relative z-[1] px-[var(--gutter)] pb-10 lg:absolute lg:inset-y-0 lg:w-[44%] lg:px-0 lg:pb-0", left ? "lg:left-0" : "lg:right-0")}>{visual}</div> : null}

      {person ? (
        <div className="cp-stage relative lg:static" style={{ "--sm-h": "clamp(320px, 96cqw, 520px)" } as CSSProperties}>
          <Person
            src={person.src}
            alt={person.alt}
            priority
            sizes="(max-width: 1023px) 90vw, 40vw"
            className={cn("left-1/2 h-full -translate-x-1/2 lg:translate-x-0", person.height ?? "lg:h-[86%]", person.sink, left ? "lg:left-[3%]" : "lg:left-auto lg:right-[4%]")}
          />
        </div>
      ) : null}

      {mascot ? (
        <div className="cp-stage relative lg:static" style={{ "--sm-h": "clamp(230px, 65cqw, 320px)" } as CSSProperties}>
          {/* The *wrapper* owns centring; the mascot's bob animation cannot override its translateX. */}
          <div className={cn("absolute bottom-[22px] left-1/2 z-[2] -translate-x-1/2 lg:bottom-[14%]", left ? "lg:left-[24%]" : "lg:left-[76%]")}>
            <PanelMascot src={mascot.src} alt={mascot.alt} className="!relative !bottom-auto !left-auto block w-[clamp(185px,56cqw,250px)] lg:w-[clamp(245px,24cqw,335px)]" />
          </div>
        </div>
      ) : null}
    </CanvasPanel>
  );
}

/** Closing CTA band: a small canvas panel (used where the page doesn't end with JoinContact). */
export function CtaBand({ title, children, className, bg }: { title: string; children: ReactNode; className?: string; bg?: ReactNode }) {
  return (
    <CanvasPanel tone="cream" data-section="cta" className={className} bg={bg}>
      <div className="container-x relative z-[2] flex flex-col gap-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:py-16">
        <Headline text={title} size="h2s" className="max-w-[22ch]" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">{children}</div>
      </div>
    </CanvasPanel>
  );
}

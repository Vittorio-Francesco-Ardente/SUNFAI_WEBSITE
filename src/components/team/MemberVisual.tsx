import { MemberBackdrop } from "@/components/geometry/shapes";
import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/asset";
import { SIDE_CUT_SINK } from "@/lib/people";
import type { Backdrop } from "@/content/team";

export type MemberLite = {
  slug: string;
  firstName: string;
  lastName: string;
  name: string;
  initials: string;
  group: "board" | "team";
  role: string;
  groupLabel: string;
  roleLine: string;
  tags: string[];
  photo?: string;
  linkedin?: string;
  pose?: string;
  backdrop: Backdrop;
  quote?: string;
  index: number;
};


/**
 * Member visual = member backdrop (CONCEPT_2/3) + bottom-anchored cut-out, or the initials circle (CONCEPT_4).
 * Fills its (relatively positioned, overflow-hidden) parent. Contained shapes only.
 */
export function MemberVisual({
  m,
  sizes,
  usePose = false,
  backdrop,
  priority,
  eager = false,
  framing = "card",
  photoComing,
}: {
  m: MemberLite;
  sizes: string;
  usePose?: boolean;
  backdrop?: Backdrop;
  priority?: boolean;
  eager?: boolean;
  framing?: "card" | "feature" | "avatar";
  photoComing: string;
}) {
  const src = usePose && m.pose ? m.pose : m.photo;
  const n = backdrop ?? m.backdrop;
  const sink = src ? (SIDE_CUT_SINK[src] ?? 0) : 0;
  const frame = framing === "feature" ? 90 : framing === "avatar" ? 118 : 92;
  return (
    <div className="absolute inset-0">
      <MemberBackdrop n={n} className="absolute inset-0 h-full w-full" />
      {src ? (
        <div className="absolute inset-x-0 bottom-0" style={{ height: `${frame / (1 - sink)}%`, transform: sink ? `translateY(${sink * 100}%)` : undefined }}>
          <div className="hc-person h-full w-full">
            {m.slug === "giorgio-venezia" ? (
              // Original source: stable cached URL on both sides of the motion
              // handoff; generated srcSet variants caused intermittent blanks.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={asset(src)}
                alt={photoComing === "" ? "" : m.name}
                loading="eager"
                decoding="async"
                className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 select-none object-contain object-bottom"
                draggable={false}
              />
            ) : (
              <Img
                src={src}
                alt={photoComing === "" ? "" : `${m.name}`}
                sizes={sizes}
                priority={priority}
                eager={eager}
                className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 select-none object-contain object-bottom"
                draggable={false}
              />
            )}
          </div>
        </div>
      ) : (
        <span
          role="img"
          aria-label={photoComing.replace("{name}", m.name)}
          className={cn(
            "absolute left-1/2 top-[46%] grid aspect-square -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream font-display font-extrabold tracking-[-0.04em] text-ink",
            framing === "avatar" ? "w-[70%] text-[1rem]" : framing === "card" ? "w-[52%] text-[clamp(1.6rem,4vw,2.4rem)]" : "w-[46%] text-[clamp(2.6rem,6vw,5rem)]",
          )}
        >
          {m.initials}
        </span>
      )}
    </div>
  );
}

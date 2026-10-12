import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/cn";

/**
 * The SUN-FAI mascot — a RARE accent (pack 10.2): max one per page, only the allowed placements,
 * max 180 px desktop / 140 px mobile, one 300 ms pop entrance, no loops.
 * `data-mascot` is checked by scripts/check-mascot.mjs (fails the build on violations).
 */
export type MascotPose =
  | "01-open-arms-wink"
  | "03-thinking-look-up"
  | "04-idea-pointing"
  | "06-cheering"
  | "07-surprised-pointing-up"
  | "09-waving-wink";

const FILES: Record<MascotPose, string> = {
  "01-open-arms-wink": "/mascot/mascot-01-open-arms-wink.webp",
  "03-thinking-look-up": "/mascot/mascot-03-thinking-look-up.webp",
  "04-idea-pointing": "/mascot/mascot-04-idea-pointing.webp",
  "06-cheering": "/mascot/mascot-06-cheering.webp",
  "07-surprised-pointing-up": "/mascot/mascot-07-surprised-pointing-up.webp",
  "09-waving-wink": "/mascot/mascot-09-waving-wink.webp",
};

export function Mascot({ pose, alt, className }: { pose: MascotPose; alt: string; className?: string }) {
  return (
    <span data-mascot={pose} className={cn("mascot-pop block w-[min(140px,32vw)] md:w-[180px]", className)}>
      <Img src={FILES[pose]} alt={alt} sizes="(max-width: 767px) 140px, 180px" className="h-auto w-full select-none" draggable={false} />
    </span>
  );
}

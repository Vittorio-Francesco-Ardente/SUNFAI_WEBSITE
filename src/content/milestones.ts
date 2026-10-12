import { milestoneImage } from "./milestone-media";
import type { Dict } from "./dict";
import type { SqueezeItem } from "@/components/awards/AwardsSqueeze";

/** Localized milestone records with their placeholder image (chronological). */
export function milestoneItems(d: Dict): SqueezeItem[] {
  return d.riconoscimenti.milestones.map((m) => ({
    id: m.id,
    year: m.year,
    label: m.label,
    kind: m.kind,
    title: m.title,
    caption: m.caption,
    href: m.href,
    image: milestoneImage[m.id],
    alt: `Fotografia d’archivio SUN-FAI a corredo del traguardo ${m.title}`,
  }));
}

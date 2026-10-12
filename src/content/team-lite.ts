import { fullName, initials, team, type Member } from "./team";
import type { Dict } from "./dict";
import type { Locale } from "@/lib/i18n";
import type { MemberLite } from "@/components/team/MemberVisual";

/** Serializable, localized member records for client components (labels resolved on the server). */
export function toLite(m: Member, d: Dict, locale: Locale): MemberLite {
  const g = d.team.groups[m.group];
  const role = d.team.roles[m.role];
  return {
    slug: m.slug,
    firstName: m.firstName,
    lastName: m.lastName,
    name: fullName(m),
    initials: initials(m),
    group: m.group,
    role,
    groupLabel: g.label,
    roleLine: m.group === "board" ? `${g.label} · ${role}` : g.label,
    tags: m.focus?.length ? m.focus : [...g.tags],
    photo: m.photo,
    linkedin: m.linkedin,
    pose: m.pose,
    backdrop: m.backdrop,
    quote: m.quote ? (locale === "lmo" ? (m.quote.lmo ?? m.quote.it) : m.quote.it) : undefined,
    index: team.indexOf(m),
  };
}

export const teamLite = (d: Dict, locale: Locale) => team.map((m) => toLite(m, d, locale));

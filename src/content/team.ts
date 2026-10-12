/**
 * SUN-FAI team — 12 people, roles from sun-fai.org/chi-siamo (11 Oct 2026).
 * Nicola Preda (listed on the old site) is intentionally NOT included (client decision).
 * Photo ↔ person mapping per 03_ASSET_RULES_V2 (to verify with SUN-FAI, see TODO_SUNFAI.md).
 * NEVER invent quote/bio/focus: leave undefined until the person supplies them.
 * Labels (roles, group names, summaries) live in the dictionaries: `dict.team`.
 */
export type TeamGroup = "board" | "team";
export type RoleKey = "presidente" | "vicepresidente" | "consigliere" | "operativo";
export type Backdrop = 1 | 2 | 3 | 4 | 5 | 6;

export interface Member {
  slug: string;
  firstName: string;
  lastName: string;
  group: TeamGroup;
  role: RoleKey;
  /** Main cut-out in /public/people (transparent WebP). Undefined → initials card (CONCEPT_4). */
  photo?: string;
  /** Alternative pose for small cards / profile gallery. */
  pose?: string;
  /** Member backdrop variant 1-6 (pack 01). */
  backdrop: Backdrop;
  /** Public LinkedIn profile (only when explicitly supplied). */
  linkedin?: string;
  /** Real content only, supplied by the person (TODO_SUNFAI). */
  quote?: { it: string; lmo?: string };
  bio?: { it: string; lmo?: string };
  focus?: string[];
}

const P = (s: string) => `/people/${s}.webp`;
const Q = (s: string) => `/people/poses/${s}.webp`;

/** Board first, then the team operativo alphabetically. */
export const team: Member[] = [
  { slug: "francesco-crivena", firstName: "Francesco", lastName: "Crivena", group: "board", role: "presidente", photo: P("francesco-crivena"), pose: Q("francesco-crivena--pose-pointing"), linkedin: "https://www.linkedin.com/in/francesco-crivena-7453a244/", backdrop: 1 },
  { slug: "andrea-zonca", firstName: "Andrea", lastName: "Zonca", group: "board", role: "vicepresidente", photo: P("andrea-zonca"), pose: Q("andrea-zonca--pose-three-quarter"), linkedin: "https://www.linkedin.com/in/andrea-zonca-65b126253/", backdrop: 2 },
  { slug: "stefano-crivena", firstName: "Stefano", lastName: "Crivena", group: "board", role: "consigliere", photo: P("stefano-crivena"), pose: Q("stefano-crivena--pose-gesture"), linkedin: "https://www.linkedin.com/in/stefano-crivena-052662256/", backdrop: 4 },
  { slug: "alceste-persico", firstName: "Alceste", lastName: "Persico", group: "board", role: "consigliere", photo: P("alceste-persico"), pose: Q("alceste-persico--pose-open-hand"), linkedin: "https://www.linkedin.com/in/alceste-persico/", backdrop: 5 },
  { slug: "andrea-belotti", firstName: "Andrea", lastName: "Belotti", group: "team", role: "operativo", photo: P("andrea-belotti"), linkedin: "https://www.linkedin.com/in/andrea-belotti-849263293/", backdrop: 3 },
  { slug: "beatrice-parimbelli", firstName: "Beatrice", lastName: "Parimbelli", group: "team", role: "operativo", photo: P("beatrice-parimbelli"), pose: Q("beatrice-parimbelli--pose-smile"), linkedin: "https://www.linkedin.com/in/beatrice-parimbelli-1a7097245/", backdrop: 6 },
  { slug: "benedetta-petro", firstName: "Benedetta", lastName: "Petrò", group: "team", role: "operativo", photo: P("benedetta-petro"), linkedin: "https://www.linkedin.com/in/benedetta-petr%C3%B2-1259b8355/", backdrop: 1 },
  { slug: "chiara-crivena", firstName: "Chiara", lastName: "Crivena", group: "team", role: "operativo", photo: P("chiara-crivena"), pose: Q("chiara-crivena--pose-hand-chin"), linkedin: "https://www.linkedin.com/in/chiara-crivena-1b2062a3/", backdrop: 5 },
  { slug: "giorgio-venezia", firstName: "Giorgio", lastName: "Venezia", group: "team", role: "operativo", photo: P("giorgio-venezia"), pose: Q("giorgio-venezia--pose-arms-crossed"), linkedin: "https://www.linkedin.com/in/giorgio-venezia-616053356/", backdrop: 2 },
  { slug: "lorenzo-ciresa", firstName: "Lorenzo", lastName: "Ciresa", group: "team", role: "operativo", photo: P("lorenzo-ciresa"), pose: Q("lorenzo-ciresa--pose-pointing"), backdrop: 4 },
  { slug: "nicholas-previtali", firstName: "Nicholas", lastName: "Previtali", group: "team", role: "operativo", photo: P("nicholas-previtali"), pose: Q("nicholas-previtali--pose-alt"), linkedin: "https://www.linkedin.com/in/nicholas-previtali-34a6bb344/", backdrop: 3 },
  { slug: "simone-mazzoleni", firstName: "Simone", lastName: "Mazzoleni", group: "team", role: "operativo", photo: P("simone-mazzoleni"), backdrop: 6 },
];

export const initials = (m: Member) => `${m.firstName[0]}${m.lastName[0]}`.toUpperCase();
export const fullName = (m: Member) => `${m.firstName} ${m.lastName}`;
export const getMember = (slug: string) => team.find((m) => m.slug === slug);
export const memberIndex = (m: Member) => team.findIndex((x) => x.slug === m.slug);
export const boardMembers = team.filter((m) => m.group === "board");
export const teamMembers = team.filter((m) => m.group === "team");

/** People used as presenters outside the team cards (pack 10 placement map). */
export const presenters = {
  homeHero: "/people/home-hero-team-cutout.webp",
  giorgioPalmUp: "/people/giorgio-hero-palm-up.webp",
  giorgioGuide: "/people/giorgio-guide-arms-crossed.webp",
} as const;

/**
 * Eventi SUN-FAI — informazioni ricavate dalle locandine ufficiali fornite.
 * Gli eventi cambiano stato in base alla data locale italiana (Europe/Rome),
 * non in base alla data di compilazione statica del sito.
 * Non presumere iscrizione obbligatoria, link di prenotazione o altri dettagli non pubblicati.
 */
export interface SunfaiEvent {
  slug: string;
  date: string; // YYYY-MM-DD, nel calendario italiano
  weekday: string;
  startsAt: string; // HH:mm, ora italiana
  city: string;
  venue: string;
  title: string;
  kicker: string;
  description: string;
  poster: string;
  originalPoster: string;
  audience?: string;
  admission?: string;
  topics: string[];
}

export const events: SunfaiEvent[] = [
  {
    slug: "il-sole-della-valle-condiviso-vedeseta",
    date: "2026-10-13",
    weekday: "Martedì",
    startsAt: "20:30",
    city: "Vedeseta",
    venue: "Porta ecomuseale",
    title: "Il sole della valle, condiviso.",
    kicker: "Serata aperta a tutta la valle · Vedeseta, Val Taleggio",
    description: "Un incontro aperto per parlare di fonti rinnovabili, comunità energetiche e condivisione dell'energia nel territorio della Val Taleggio.",
    poster: "/events/2026-10-13-vedeseta.webp",
    originalPoster: "/events/2026-10-13-vedeseta.png",
    audience: "Serata aperta a tutta la valle",
    topics: [
      "Fonti rinnovabili: quali sono e come si producono in un territorio di montagna.",
      "Comunità energetiche: cosa sono le CER e come si condivide l’energia tra vicini.",
      "Le vostre domande: un dialogo aperto, senza tecnicismi e senza impegno.",
    ],
  },
  {
    slug: "tutta-unaltra-energia-paladina",
    date: "2026-10-22",
    weekday: "Giovedì",
    startsAt: "20:45",
    city: "Paladina",
    venue: "Oratorio Don Antonio Seghezzi",
    title: "Tutta un’altra energia. La tua. La nostra.",
    kicker: "Incontro pubblico sulle comunità energetiche rinnovabili",
    description: "Un incontro per scoprire come partecipare a una comunità energetica rinnovabile, anche senza possedere pannelli solari.",
    poster: "/events/2026-10-22-paladina.webp",
    originalPoster: "/events/2026-10-22-paladina.png",
    admission: "Ingresso libero e gratuito",
    topics: [
      "Famiglie, imprese ed enti collegati alla cabina primaria di Paladina possono entrare nella stessa comunità energetica, anche senza pannelli solari.",
      "L’idoneità riguarda solo una parte del Comune: la verifica puntuale dipende dalla cabina primaria del proprio punto di prelievo.",
    ],
  },
];

export const getEvent = (slug: string) => events.find((item) => item.slug === slug);

/** ISO date for the current calendar day in Italy (not the visitor's timezone). */
export function todayInItaly(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  const lookup = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${lookup("year")}-${lookup("month")}-${lookup("day")}`;
}

export function eventIsUpcoming(item: SunfaiEvent, today: string): boolean {
  // Stay in "In programma" for the full event day; move to "Conclusi" the following day.
  return item.date >= today;
}

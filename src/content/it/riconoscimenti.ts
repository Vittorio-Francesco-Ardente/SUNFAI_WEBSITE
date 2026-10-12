/**
 * Italian — /riconoscimenti, the memory room, achievements carousel, awards squeeze (pack 07).
 * Verified facts only (SITE_CONTENT §8 + demo milestones). Images are placeholders (approved landscapes)
 * until SUN-FAI provides real event photos (TODO_SUNFAI).
 */
export const riconoscimenti = {
  meta: {
    title: "Riconoscimenti",
    description:
      "CER dell'anno 2024 al Forum IFEC, la configurazione di Dalmine, otto Comuni accompagnati, Ardaké e gli altri traguardi di SUN-FAI.", // [DEMO]
  },
  hero: {
    eyebrow: "Riconoscimenti",
    title: "Traguardi che contano,|anche fuori da *Dalmine*", // [DEMO]
    lead: "Il premio CER dell'anno è arrivato da Roma. Gli altri traguardi li abbiamo raggiunti con soci, imprese e Comuni.", // [DEMO]
    presenterAlt: "Andrea Zonca, vicepresidente di SUN-FAI",
    cta: "Entra nella stanza dei ricordi",
  },
  premio: {
    badge: "Premio IFEC", // [DEMO]
    big: ["CER", "dell'anno", "2024"], // [DEMO]
    eyebrow: "Il premio", // [DEMO]
    title: "Innovazione sociale, economica e *tecnologica*", // [DEMO]
    paragraphs: [
      "Nel novembre 2024, durante la conferenza nazionale sulle comunità energetiche organizzata da IFEC (Italian Forum of Energy Communities) presso il GSE a Roma, SUN-FAI ha ricevuto il riconoscimento di CER dell'anno.", // [DEMO]
      "Il premio va alla comunità energetica che si è distinta a livello nazionale per innovazione sociale, economica e tecnologica.", // [DEMO]
      "Insieme al premio IFEC, SUN-FAI ha vinto anche il Premio Michele Calì, contributo economico destinato a una giovane risorsa impegnata nello sviluppo della CER.", // [SITO]
    ],
    facts: [
      { k: "Quando", v: "Nov 2024" },
      { k: "Dove", v: "Roma, GSE" },
      { k: "Chi", v: "IFEC" },
    ], // [DEMO]
    imageAlt: "Immagine della notizia: SUN-FAI eletta migliore CER in Italia 2024",
    readNews: "Leggi la notizia",
  },
  memory: {
    eyebrow: "Riconoscimenti",
    title: "La stanza dei *ricordi*",
    lead: "I momenti che ci hanno portato fin qui, in una galleria di immagini in movimento. Sfoglia i traguardi con le frecce.",
    region: "La stanza dei ricordi",
    live: "Ricordo {n} di {total}: {title}",
    prev: "Ricordo precedente",
    next: "Ricordo successivo",
    open: "Apri",
    placeholderNote: "Le foto degli eventi arriveranno presto: per ora mostriamo i paesaggi del territorio.",
    loading: "Preparo la stanza…",
  },
  traguardi: {
    eyebrow: "Traguardi",
    title: "Un passo alla *volta*",
    lead: "Premi, configurazioni, Comuni: i traguardi verificati della cooperativa.",
    readArticle: "Leggi l'articolo",
    source: "Fonte",
    prev: "Traguardo precedente",
    next: "Traguardo successivo",
  },
  squeeze: {
    eyebrow: "Anno per anno", // [DEMO]
    title: "Tutti i traguardi, in *ordine*", // [DEMO]
    region: "Riconoscimenti e traguardi", // [DEMO]
    premio: "Premio",
    traguardo: "Traguardo",
    show: "Mostra: {title}, {year}",
    more: "Approfondisci",
    prevLabel: "Traguardo precedente",
    nextLabel: "Traguardo successivo",
  },
  /** Ordered chronologically. `year` null = date not yet confirmed (never invented). */
  milestones: [
    {
      id: "cer-dell-anno-2024",
      year: "2024",
      label: "Novembre 2024 · IFEC",
      kind: "premio",
      title: "CER dell'anno 2024",
      caption: "Riconoscimento per innovazione sociale, economica e tecnologica, ricevuto a Roma durante la conferenza nazionale IFEC presso il GSE.",
      href: "/notizie/sun-fai-eletta-migliore-cer-italia-2024/",
      source: { label: "Energia in Città", url: null },
    },
    {
      id: "premio-michele-cali",
      year: "2024",
      label: "2024 · IFEC",
      kind: "premio",
      title: "Premio Michele Calì",
      caption: "Contributo economico destinato a una giovane risorsa impegnata nello sviluppo della CER.",
      href: "/notizie/sun-fai-eletta-migliore-cer-italia-2024/",
      source: null,
    },
    {
      id: "configurazione-dalmine",
      year: "2024",
      label: "2024 · Dalmine",
      kind: "traguardo",
      title: "Configurazione di Dalmine",
      caption: "Configurazione attiva sulla cabina primaria di Dalmine, alimentata da due impianti fotovoltaici: 240 kW di una PMI e 4 kW di una famiglia.",
      href: "/ardake/monitoraggio/",
      source: null,
    },
    {
      id: "progetto-solidale-dalmine",
      year: null,
      label: "Dalmine · Progetto solidale",
      kind: "traguardo",
      title: "Progetto solidale a Dalmine",
      caption: "Un impianto fotovoltaico sul Centro di primo ascolto interparrocchiale di Dalmine, finanziato con i risparmi in bolletta.",
      href: null,
      source: { label: "L'Eco di Bergamo", url: null },
    },
    {
      id: "otto-comuni",
      year: "2025",
      label: "2025 · Territorio",
      kind: "traguardo",
      title: "8 Comuni accompagnati",
      caption: "Otto amministrazioni comunali affiancate nel percorso verso la comunità energetica.",
      href: "/cosa-facciamo/#comuni",
      source: null,
    },
    {
      id: "ardake-in-house",
      year: "2025",
      label: "2025 · Prodotto",
      kind: "traguardo",
      title: "Ardaké, piattaforma in house",
      caption: "Sviluppata dal team SUN-FAI per rendere leggibili produzione, consumi ed energia condivisa.",
      href: "/ardake/",
      source: null,
    },
    {
      id: "fondazione-boldesico",
      year: "2025",
      label: "Ottobre 2025 · Grumello del Monte",
      kind: "traguardo",
      title: "Fondazione Madonna del Boldesico",
      caption: "La Fondazione entra come socio di SUN-FAI dopo l'installazione di un impianto fotovoltaico da oltre 100 kW.",
      href: "/notizie/fondazione-madonna-del-boldesico-socio/",
      source: null,
    },
    {
      id: "ciserano-corte-dei-conti",
      year: "2026",
      label: "Gennaio 2026 · Enti locali",
      kind: "traguardo",
      title: "Ciserano supera la Corte dei Conti",
      caption: "Il settimo Comune a completare la procedura per entrare come socio con i propri POD.",
      href: "/notizie/ciserano-supera-esame-corte-dei-conti/",
      source: null,
    },
    {
      id: "numeri",
      year: "2026",
      label: "Oggi",
      kind: "traguardo",
      title: "4 CER · 349 kWp · 136 soci",
      caption: "Le comunità aperte e gestite da SUN-FAI, la potenza dei nostri impianti e i soci attivi.",
      href: "/ardake/",
      source: null,
    },
  ],
  yearUnknown: "Data da confermare",
  /** Alt texts of the placeholder landscapes (src/content/milestone-media.ts). */
  imageAlts: {
  "cer-dell-anno-2024": "Tetti con pannelli solari in un paese, con le montagne sullo sfondo",
  "premio-michele-cali": "Colline verdi e una valle",
  "configurazione-dalmine": "Pannelli solari su un tetto di tegole",
  "progetto-solidale-dalmine": "Una via di paese con case basse",
  "otto-comuni": "Una piazza con un grande albero e un cortile",
  "ardake-in-house": "La pianura e le montagne all'orizzonte",
  "fondazione-boldesico": "Colline con ulivi e la pianura sullo sfondo",
  "ciserano-corte-dei-conti": "Una strada di campagna che porta a un paese",
  numeri: "Una strada di campagna tra gli alberi",
},
} as const;

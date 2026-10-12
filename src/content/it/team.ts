/** Italian — Team section, /team, /team/[slug] (pack 04). */
export const team = {
  roles: {
    presidente: "Presidente",
    vicepresidente: "Vicepresidente",
    consigliere: "Consigliere",
    operativo: "Team operativo",
  },
  groups: {
    board: {
      label: "Consiglio di Amministrazione",
      summary:
        "Il Consiglio di Amministrazione guida la cooperativa: indirizzo strategico, ammissione dei nuovi soci, rapporti con Comuni e partner. Risponde all'assemblea dei soci.",
      tags: ["Governance", "Comunità energetiche", "Territorio"],
      lead: "Fa parte del Consiglio di Amministrazione di SUN-FAI.", // [DEMO]
    },
    team: {
      label: "Team operativo",
      summary:
        "Il team operativo segue il lavoro di ogni giorno: incontri sul territorio, pratiche per le configurazioni, supporto ai soci e sviluppo di Ardaké.",
      tags: ["Comunità energetiche", "Soci", "Territorio"],
      lead: "Lavora nel team operativo di SUN-FAI.", // [DEMO]
    },
  },
  section: {
    eyebrow: "Il nostro team",
    title: "Le persone|dietro *l'energia*", // [CONCEPT]
    body: "4 persone nel Consiglio di Amministrazione, 8 nel team operativo. Seguono Comuni, soci e configurazioni, e hanno sviluppato Ardaké.", // [CONCEPT_3 alt body, 12 people]
    cta: "Scopri il team",
    prev: "Persona precedente", // [DEMO]
    next: "Persona successiva", // [DEMO]
    live: "Persona {n} di {total}: {name}, {role}",
    open: "Apri il profilo di {name}",
    region: "Le persone dietro l'energia", // [DEMO]
    photoComing: "{name}: foto in arrivo",
  },
  page: {
    metaTitle: "Team",
    metaDescription:
      "Le persone di SUN-FAI: il Consiglio di Amministrazione e il team operativo che costituisce e gestisce comunità energetiche rinnovabili.", // [DEMO]
    boardEyebrow: "Governance",
    teamEyebrow: "Ogni giorno",
    railLabel: "Persone del team SUN-FAI", // [DEMO]
    railPrev: "Persone precedenti", // [DEMO]
    railNext: "Persone successive", // [DEMO]
    dodiciEyebrow: "Il team",
    dodiciTitle: "Dodici persone, una *cooperativa*", // [DEMO, corrected]
    dodiciLead: "Consiglio di Amministrazione e team operativo: ecco chi incontri quando ci scrivi o quando arriviamo nel tuo Comune.", // [DEMO]
    visitEyebrow: "Ci trovi qui",
    visitTitle: "Vuoi conoscerci *di persona*?", // [DEMO]
    visitText: "Ci trovi a Dalmine, in via Anemone 5. Scrivici prima di passare.", // [DEMO]
    visitCta: "Contatti",
    visitAlt: "Una piazza con un grande albero e un cortile, in un paese della Bergamasca",
    filtersLabel: "Filtra per gruppo",
  },
  profile: {
    metaDescription: "{name}, {group} di SUN-FAI, la cooperativa che costituisce e gestisce comunità energetiche rinnovabili a Dalmine (BG).",
    back: "Tutto il team",
    eyebrow: "Profilo membro", // [DEMO]
    oneLiner: "SUN-FAI costituisce e gestisce comunità energetiche rinnovabili con famiglie, imprese, Comuni ed enti della provincia di Bergamo.", // [DEMO]
    write: "Scrivici",
    writeSub: "Vuoi parlare con {first}?",
    gallery: "Galleria del profilo", // [DEMO]
    galleryPrev: "Elemento precedente", // [DEMO]
    galleryNext: "Elemento successivo", // [DEMO]
    slides: {
      pose: "Posa",
      initials: "SUN-FAI",
      cosaFaccio: "Cosa faccio", // [DEMO]
      progetti: "Progetti SUN-FAI", // [DEMO]
      puntoDiVista: "Il mio punto di vista", // [DEMO]
      quotidiano: "Il lavoro quotidiano", // [DEMO]
      assemblee: "Assemblee e territorio", // [DEMO]
    },
    projects: ["Configurazione di Dalmine", "Ardaké", "Comuni del territorio"], // [DEMO]
    blocks: {
      cosaFaccio: "Cosa faccio",
      progetti: "Progetti SUN-FAI",
      ambiti: "Ambiti",
      quotidiano: "Il lavoro quotidiano",
      quotidianoText: "Incontri sul territorio, pratiche per le configurazioni, supporto ai soci e sviluppo di Ardaké.",
      assemblee: "Assemblee e territorio",
      assembleeText: "Indirizzo strategico, ammissione dei nuovi soci, rapporti con Comuni e partner. Risponde all'assemblea dei soci.",
    },
    sameGroup: "Nello stesso gruppo", // [DEMO]
    otherProfiles: "Altri profili", // [DEMO]
    prevPerson: "Precedente",
    nextPerson: "Successivo",
    backAll: "Torna a tutto il team", // [DEMO]
    closingTitle: "Vuoi parlare con *{first}*?",
    closingText: "Scrivici: ti mettiamo in contatto con la persona giusta del team.",
    closingCta: "Scrivici",
    sceneBoardAlt: "Illustrazione: un gruppo di lavoro in ufficio attorno a un tavolo",
    sceneTeamAlt: "Illustrazione: una consulente SUN-FAI aiuta una socia al computer",
  },
} as const;

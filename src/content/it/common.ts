/**
 * Italian — shared UI strings (navigation, footer, buttons, carousels, a11y labels).
 * Headline syntax used across the dictionaries:  "line one|line *accent*"  →  "|" = line break, "*…*" = accent word,
 * the yellow full stop is added by <Headline> (not after a final "?" or "!").
 * Source tags as in SITE_CONTENT_IT_V2.md: [SITO] verbatim · [DEMO] verbatim from the demo · [NUOVO] to validate.
 */
export const common = {
  meta: {
    siteTitle: "SUN-FAI · Cooperativa di energia rinnovabile",
    titleTemplate: "%s · SUN-FAI",
    description:
      "SUN-FAI è la cooperativa di Dalmine (BG) che costituisce e gestisce comunità energetiche rinnovabili con famiglie, imprese, Comuni ed enti della provincia di Bergamo.",
    ogLocale: "it_IT",
  },
  nav: {
    home: "Home",
    chiSiamo: "Chi siamo",
    cosaFacciamo: "Cosa facciamo",
    team: "Team",
    leCer: "Le CER",
    riconoscimenti: "Riconoscimenti",
    notizie: "Notizie",
    ardake: "Ardaké",
    contattaci: "Contattaci",
    diventaSocio: "Diventa socio",
    socio: "Socio",
    altro: "Altro",
    menu: "Menu",
    chiudi: "Chiudi",
    navMain: "Navigazione principale",
    navQuick: "Navigazione rapida",
    navFull: "Menu completo",
    logoAria: "SUN-FAI, torna alla home",
    skip: "Vai al contenuto",
    language: "Lingua",
    languageHint: "Scegli la lingua del sito",
    sheetContacts: "Contatti",
  },
  footer: {
    claim: "Costituiamo e gestiamo comunità energetiche rinnovabili con famiglie, imprese, Comuni ed enti della provincia di Bergamo.", // [DEMO]
    siteClaim: "Energia condivisa per un futuro sostenibile", // [SITO]
    cols: {
      cooperativa: "Cooperativa",
      cer: "Comunità energetiche",
      partecipa: "Partecipa",
      contatti: "Contatti",
    },
    compilazione: "Compilazione online",
    demoArdake: "Demo Ardaké",
    monitoraggio: "Monitoraggio",
    statuto: "Statuto",
    regolamento: "Regolamento interno",
    legal: "Note legali e privacy",
    areaRiservata: "Area riservata",
    faq: "Domande frequenti",
    configurazioni: "Configurazioni",
    eventi: "Eventi",
    vat: "P.IVA",
    rights: "©2026 SUN-FAI Cooperativa. Tutti i diritti riservati.",
    facebookPaused: "Facebook · pagina in arrivo",
    reviewNote: "",
    ctaTitle: "Accendi la *comunità*", // [V3 mockup 05]
    ctaSub: "La tua. La nostra.", // [SITO]
    write: "Scrivici", // [V3]
    colCer: "Le CER",
    colArdake: "Ardaké",
    cosaSono: "Cosa sono",
    verifica: "Verifica se puoi aderire",
    accedi: "Accedi",
    demo: "Demo",
    italianOnly: "",
  },
  ui: {
    prev: "Precedente",
    next: "Successivo",
    readMore: "Leggi tutto",
    discover: "Scopri di più",
    openPost: "Apri il post",
    all: "Tutti",
    close: "Chiudi",
    externalNote: "(si apre in una nuova scheda)",
    carousel: "carosello",
    slide: "elemento",
    ofTemplate: "{n} di {total}",
    demoData: "Dati dimostrativi",
    updated: "Ultimo aggiornamento",
    live: "In tempo reale",
    snapshot: "Ultimo dato pubblicato",
    replay: "Riguarda",
    pdf: "PDF",
    download: "Scarica",
    pages1: "pagina",
    pagesN: "pagine",
    backTop: "Torna su",
    mascotAlt: "La mascotte di SUN-FAI",
    personAlt: "{name} del team SUN-FAI",
    sourceLabel: "Fonte",
    inItalian: "",
  },
  localeChip: {
    text: "Questa pagina c'è anche in bergamasco.",
    cta: "Lèsela in bergamàsch →",
    dismiss: "Chiudi l'avviso",
  },
  joinContact: {
    joinEyebrow: "Diventa socio", // [DEMO]
    joinTitle: "Entra nella *comunità*", // [SITO] footer-band headline
    joinText: "Persone, famiglie, imprese ed enti. La domanda si compila online; se preferisci la carta, c'è il PDF.", // [DEMO]
    joinCta: "Apri la compilazione online", // [DEMO]
    joinSecondary: "Come si aderisce", // [DEMO]
    steps: [
      "Compili la domanda: online o su carta",
      "Versi la quota sociale di 25 €",
      "Entri nella configurazione della tua cabina primaria",
    ], // [DEMO]
    contactEyebrow: "Contatti",
    contactTitle: "Contattaci", // [SITO]
    contactText:
      "Contattaci per ricevere informazioni, proporre una collaborazione o unirti alla comunità SUN-FAI.", // [SITO]
    contactCta: "Vai ai contatti", // [DEMO]
    email: "E-mail",
    address: "Sede",
    sceneAlt: "Illustrazione: una socia parla in videochiamata con un operatore SUN-FAI", // [DEMO]
  },
  faq: { all: "Tutte le domande" },
  loader: "Comunità energetica",
} as const;

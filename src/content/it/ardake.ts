/** Italian — Ardaké pages, monitoring, demo dashboard, charts, Giorgio guide (pack 05). */
export const ardake = {
  meta: {
    title: "Ardaké",
    description:
      "Ardaké è la piattaforma sviluppata da SUN-FAI per seguire produzione, consumi ed energia condivisa della propria comunità energetica.", // [DEMO]
  },
  hero: {
    eyebrow: "Piattaforma SUN-FAI", // [CONCEPT]
    title: "Ardaké ti aiuta|a capire la tua|*energia*", // [CONCEPT]
    body: "Monitora consumi, produzione e risparmio in tempo reale. Una piattaforma semplice e intuitiva per seguire la tua comunità energetica con maggiore chiarezza, trasparenza e controllo.", // [CONCEPT]
    cta: "Accedi ad Ardaké",
    secondary: "Come funziona",
    giorgioAlt: "Giorgio Venezia del team SUN-FAI presenta l'app Ardaké", // [DEMO]
    phoneAlt: "Schermata dell'app Ardaké con dati dimostrativi: energia condivisa oggi, produzione e consumi", // [DEMO]
  },
  phone: {
    demo: "Demo",
    today: "Oggi nella tua comunità", // [DEMO]
    shared: "dell'energia prodotta è stata condivisa", // [DEMO]
    produced: "Prodotta",
    consumed: "Consumata",
    tipLabel: "Consiglio:", // [DEMO]
    tip: "tra le 12 e le 15 c'è più sole. È il momento per la lavatrice.", // [DEMO]
    demoData: "Dati dimostrativi",
    splashWith: "con SUN-FAI",
  },
  cosaFa: {
    eyebrow: "Cosa fa", // [DEMO]
    title: "I numeri della comunità, finalmente *leggibili*", // [DEMO]
    lead: "Niente fogli di calcolo da decifrare: le informazioni che servono a un socio, nel momento in cui servono.", // [DEMO]
    features: [
      { title: "Energia condivisa, ora per ora", text: "Vedi quanta dell'energia prodotta è stata usata dai soci nella stessa ora: è quella che genera l'incentivo." },
      { title: "Produzione e consumi a confronto", text: "Impianti da una parte, utenze dall'altra. Giorno, mese, anno: con grafici che si leggono al primo sguardo." },
      { title: "Quando conviene accendere", text: "Suggerimenti sulle fasce di sole pieno, per spostare lavatrice, lavastoviglie e ricariche." },
      { title: "Incentivi trasparenti", text: "Come si forma l'incentivo e come viene ripartito secondo il regolamento della comunità." },
    ], // [DEMO]
  },
  comeFunziona: {
    eyebrow: "Come funziona", // [DEMO]
    title: "Entri nella comunità. Ardaké ti mostra cosa *succede*", // [DEMO]
    steps: [
      { title: "Aderisci", text: "Aderisci a una comunità energetica gestita da SUN-FAI.", info: "configurazione" },
      { title: "Accedi", text: "Accedi alla piattaforma con il tuo profilo da socio.", info: "ardake" },
      { title: "Segui la tua energia", text: "Segui la tua energia e quella della comunità, giorno per giorno.", info: "energia-condivisa" },
    ], // [DEMO]
    sceneAlts: [
      "Illustrazione: una consulente SUN-FAI aiuta una socia al computer",
      "Illustrazione: un socio controlla i grafici dell'energia al computer",
      "Illustrazione: una coppia guarda i risparmi energetici sul portatile",
    ],
  },
  seleziona: {
    eyebrow: "Monitoraggio",
    title: "Seleziona una *CER*", // [SITO]
    text: "Scegli una comunità energetica per visualizzare la produzione e il monitoraggio in tempo reale.", // [SITO]
    view: "Visualizza monitoraggio", // [SITO]
    active: "ATTIVA", // [SITO]
    findTitle: "Trova la tua cabina primaria", // [SITO]
    findButton: "Cerca", // [SITO]
    findLabel: "Comune o codice della cabina primaria",
    findPlaceholder: "es. Osio Sotto o AC001E01412",
  },
  demoTeaser: {
    eyebrow: "Demo",
    title: "La tua comunità, in una *schermata*", // [DEMO]
    open: "Apri la demo completa", // [DEMO]
  },
  fattaInCasa: {
    eyebrow: "Fatta in casa", // [DEMO]
    title: "Progettata da chi gestisce le *comunità*", // [DEMO]
    text: "Ardaké nasce nel 2025 dentro SUN-FAI. L'abbiamo costruita partendo dalle domande che i soci ci fanno ogni giorno: quanta energia abbiamo condiviso? Quando conviene consumare? Come si divide l'incentivo?", // [DEMO]
    cta: "Diventa socio", // [DEMO]
    peopleAlt: ["Nicholas Previtali del team SUN-FAI", "Lorenzo Ciresa del team SUN-FAI"],
  },
  monitor: {
    metaTitle: "Monitoraggio",
    metaDescription: "Dati di produzione energetica in tempo reale delle comunità SUN-FAI.", // [SITO]
    title: "Monitoraggio CER {code}", // [SITO]
    sub: "Dati di produzione energetica in tempo reale delle comunità SUN-FAI", // [SITO]
    selector: "Cabina primaria",
    tabs: ["Panoramica", "Produzione", "Energia condivisa", "Soci", "Storico"],
    kpiLast15: "Ultimi 15 minuti", // [SITO]
    kpiTotal: "Totale periodo", // [SITO]
    kpiMembers: "Soci attivi",
    kpiPower: "Potenza installata",
    updated: "Ultimo aggiornamento:", // [SITO]
    filter: "Filtra per periodo", // [SITO]
    periods: ["Oggi", "7 giorni", "30 giorni"],
    chartPower: "Potenza fotovoltaica istantanea (kW)", // [SITO]
    liveNote: "Dato live dalla piattaforma Ardaké.",
    snapshotNote: "Collegamento live non disponibile: mostriamo l'ultimo dato pubblicato e un andamento dimostrativo della giornata.",
    demoCurve: "Andamento orario dimostrativo",
    communes: "Comuni della configurazione",
    seeDemo: "Vuoi vedere tutte le funzioni? Apri la demo",
    cabinaRedirect: "Ti stiamo portando al monitoraggio della cabina {code}…",
    soon: "Questa vista arriverà con il collegamento all'API di Ardaké. Intanto la trovi nella demo.",
  },
  dashboard: {
    metaTitle: "Demo dashboard · Ardaké", // [DEMO]
    metaDescription:
      "Demo della dashboard Ardaké con dati fittizi: produzione, consumi, energia condivisa e incentivo stimato di una configurazione di esempio.", // [DEMO]
    eyebrow: "Demo con dati fittizi", // [DEMO]
    title: "La tua comunità, in una *schermata*", // [DEMO]
    cta: "Vuoi i tuoi dati veri? Diventa socio", // [DEMO]
    config: "Configurazione demo", // [DEMO]
    configSub: "· cabina primaria di esempio", // [DEMO]
    today: "Oggi",
    badge: "Dati dimostrativi", // [DEMO]
    kpi: {
      produced: "Prodotta oggi", // [DEMO]
      consumed: "Consumata dai soci", // [DEMO]
      shared: "Energia condivisa", // [DEMO]
      incentive: "Incentivo stimato (mese)", // [DEMO]
      plants: "2 impianti",
      utenze: "8 utenze",
      ofProduction: "della produzione",
      estimate: "stima dimostrativa", // [DEMO]
    },
    disclaimer: "Dati fittizi a scopo dimostrativo: non rappresentano soci, impianti o incentivi reali di SUN-FAI.", // [DEMO]
    tipTitle: "Consiglio per domani", // [DEMO]
    tipText: "Previsto sole pieno: è la fascia migliore per lavatrice, lavastoviglie e ricarica dell'auto.", // [DEMO]
    members: {
      title: "Soci della configurazione", // [DEMO]
      member: "Socio",
      role: "Ruolo",
      share: "Quota energia", // [DEMO]
      producer: "Produttore",
      consumer: "Consumatore",
      kinds: { PMI: "PMI", Famiglia: "Famiglia", Ente: "Ente" },
      donutLabel: "Soci per tipo",
      types: { consumer: "Consumer", prosumer: "Prosumer", enti: "Enti" },
    },
  },
  charts: {
    hourly: {
      title: "Oggi, ora per ora", // [DEMO]
      aria: "Produzione, consumi ed energia condivisa per ora (dati dimostrativi)", // [DEMO]
      production: "Produzione",
      consumption: "Consumi",
      shared: "Energia condivisa",
    },
    monthly: { title: "Ultimi 12 mesi", produced: "Prodotta", shared: "Condivisa", aria: "Energia prodotta e condivisa negli ultimi 12 mesi (dati dimostrativi)" }, // [DEMO]
    months: ["Nov", "Dic", "Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott"],
    gauge: { title: "Autoconsumo condiviso", caption: "Quota della produzione usata dai soci nella stessa ora", aria: "{v}% di autoconsumo condiviso" }, // [DEMO]
    power: { title: "Potenza fotovoltaica istantanea (kW)", aria: "Potenza fotovoltaica istantanea a passi di 15 minuti", unit: "kW", now: "Adesso" },
    best: {
      title: "Le ore migliori di domani",
      aria: "Previsione del sole per ogni ora di domani (dati dimostrativi)",
      low: "Poco sole",
      high: "Sole pieno",
      tipTitle: "Consiglio",
      tip: "tra le 12 e le 15 c'è più sole. È il momento per la lavatrice.", // [DEMO]
      hour: "ore {h}",
    },
    calendar: {
      title: "Calendario dell'energia condivisa",
      aria: "Energia condivisa giorno per giorno nel mese (dati dimostrativi)",
      days: ["L", "M", "M", "G", "V", "S", "D"],
      less: "Meno",
      more: "Più",
      day: "Giorno {d}",
    },
    where: {
      title: "Dove va l'energia prodotta",
      shared: "Condivisa nella comunità",
      grid: "Immessa in rete",
    },
    weekly: {
      title: "Confronto settimanale",
      thisWeek: "Questa settimana",
      lastWeek: "Settimana scorsa",
      days: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
      aria: "Energia condivisa: questa settimana e la settimana scorsa (dati dimostrativi)",
    },
    incentive: { title: "Incentivo stimato", note: "stima dimostrativa" },
    table: "Dati del grafico",
    hourCol: "Ora",
    valueCol: "Valore",
    scrubHint: "Tocca e trascina sul grafico per leggere i valori.",
    keyHint: "Usa le frecce ← → per spostarti nel grafico.",
  },
  giorgio: {
    name: "Giorgio",
    role: "Team operativo SUN-FAI",
    eyebrow: "Giorgio · Team SUN-FAI",
    greetingTitle: "Ciao!",
    greeting: "Ciao, sono Giorgio del team SUN-FAI. Ti spiego in due righe cosa stai guardando.",
    close: "Ho capito, grazie",
    closeAria: "Chiudi la spiegazione",
    more: "Approfondisci",
    prev: "Spiegazione precedente",
    next: "Spiegazione successiva",
    open: "Chiedi a Giorgio: {topic}",
    alt: "Giorgio Venezia del team SUN-FAI, a braccia conserte",
    tourStart: "Fammi fare un giro con Giorgio",
    tourProgress: "{n} di {total}",
    tourLive: "Passo {n} di {total}",
    tourBack: "Indietro",
    tourNext: "Avanti",
    tourDone: "Ho finito",
    tourSkip: "Salta il giro",
    outroTitle: "Ora sai tutto!",
    outroBody: "Puoi fare da te. Se ti serve, trovi le «i» accanto ai termini.",
    skipTitle: "Vedo che sei bello intraprendente!",
    skipBody: "Se hai comunque bisogno, sai dove trovarmi: mi trovi sempre qui nelle «i» accanto ai termini.",
    topics: {
      ardake: {
        title: "Cos'è Ardaké?",
        body: "È la piattaforma che abbiamo sviluppato interamente in SUN-FAI. Ti mostra in tempo reale quanta energia viene prodotta nella tua configurazione e quanta ce n'è a disposizione da condividere, quarto d'ora per quarto d'ora.",
      },
      configurazione: {
        title: "Cos'è una configurazione?",
        body: "SUN-FAI è una grande comunità energetica che ospita più configurazioni. Ognuna è autonoma e fa riferimento alla propria cabina primaria: i soci condividono energia solo con chi è collegato alla stessa cabina.",
        more: "/le-cer/",
      },
      "cabina-primaria": {
        title: "Cabina primaria",
        body: "È l'impianto della rete elettrica che serve la tua zona. Il codice che vedi (per esempio AC001E01466) la identifica: inserisci il tuo Comune o il codice nel campo di ricerca per trovare la configurazione giusta.",
      },
      "quarto-orario": {
        title: "Perché ogni quarto d'ora?",
        body: "L'energia condivisa si calcola per fasce di 15 minuti: conta quanta energia prodotta in eccesso da alcuni soci viene consumata, nello stesso quarto d'ora, da altri soci della stessa cabina primaria.",
      },
      "ultimi-15-minuti": {
        title: "Ultimi 15 minuti",
        body: "È l'energia prodotta dagli impianti della configurazione nell'ultimo quarto d'ora registrato. Il dato si aggiorna da solo: l'orario dell'ultimo aggiornamento è indicato sotto i numeri.",
      },
      "totale-periodo": {
        title: "Totale periodo",
        body: "È l'energia prodotta nel periodo che hai scelto con il filtro. Cambia il periodo per confrontare giorni, settimane o mesi.",
      },
      "potenza-istantanea": {
        title: "Potenza fotovoltaica istantanea",
        body: "La curva mostra quanti kW stanno producendo gli impianti in ogni momento della giornata. Sale con il sole, scende la sera: i picchi indicano le ore migliori per usare l'energia della comunità.",
      },
      "energia-condivisa": {
        title: "Energia condivisa",
        body: "È l'energia rinnovabile prodotta in eccesso da alcuni soci e consumata, nella stessa fascia oraria, da altri soci della comunità. È su questa energia che il GSE riconosce gli incentivi.",
      },
      incentivi: {
        title: "Dove vanno gli incentivi?",
        body: "Il GSE li riconosce alla cooperativa SUN-FAI, che li redistribuisce secondo il regolamento interno deciso dai soci. Una parte sostiene anche progetti solidali sul territorio.",
      },
      "prosumer-consumer": {
        title: "Prosumer o consumer?",
        body: "Chi ha un impianto e consuma parte della propria energia è un prosumer (autoconsumatore). Chi non produce e usa l'energia della rete è un consumer (cliente finale). Entrambi possono entrare nella comunità.",
      },
      kwp: {
        title: "Cosa vuol dire kWp?",
        body: "Il kilowatt di picco misura la potenza massima che un impianto fotovoltaico può produrre in condizioni ideali. Gli impianti delle comunità SUN-FAI sommano 349 kWp.",
      },
      kwh: {
        title: "kW o kWh?",
        body: "Il kW è la potenza in un istante, come la velocità di un'auto. Il kWh è l'energia accumulata nel tempo, come i chilometri percorsi. Il grafico mostra i kW, i totali sono in kWh.",
      },
      "stato-configurazione": {
        title: "Attiva, in valutazione, in progetto",
        body: "Attiva: la configurazione è riconosciuta e condivide energia. In valutazione: stiamo verificando impianti e soci. In progetto: la comunità sta nascendo, puoi già manifestare interesse.",
        more: "/diventa-socio/",
      },
    },
  },
} as const;

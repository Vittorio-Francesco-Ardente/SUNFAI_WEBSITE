/** Italian — Home (IA §1–15). Copy: SITE_CONTENT_IT_V2 (A, C) + DEMO_COPY_IT (B). */
export const home = {
  meta: {
    title: "SUN-FAI · Tutta un'altra energia. La tua. La nostra.",
    description:
      "SUN-FAI è una cooperativa che costruisce e gestisce comunità energetiche rinnovabili con famiglie, imprese, Comuni ed enti della provincia di Bergamo.",
  },
  hero: {
    eyebrow: "Comunità energetiche rinnovabili", // [CONCEPT]
    title: "Tutta un'altra|*energia*", // [SITO/CONCEPT]
    sub: "La tua. La nostra.", // [SITO]
    body: "SUN-FAI è una cooperativa che costruisce e gestisce comunità energetiche rinnovabili con famiglie, imprese, Comuni ed enti della provincia di Bergamo.", // [CONCEPT]
    cta: "Diventa socio",
    secondary: "Scopri di più",
    peopleAlt: "Tre persone del team SUN-FAI con la maglietta della cooperativa",
  },
  numbers: {
    eyebrow: "SUN-FAI in numeri",
    title: "La nostra *realtà*", // [SITO] "La nostra realtà"
    lead: "Configurazioni, impianti, soci, Comuni: i numeri della cooperativa, aggiornati con Ardaké.", // [NUOVO]
    items: {
      cer: { value: "4", label: "CER aperte e gestite da SUN-FAI" }, // [SITO]
      kwp: { value: "349", unit: "kWp", label: "Potenza totale dei nostri impianti" }, // [SITO]
      energy: { unit: "kWh", label: "Energia erogata nelle ultime 24h" }, // [SITO]
      soci: { value: "136", label: "Soci attivi" }, // [SITO]
      comuni: { value: "7", label: "Comuni che hanno superato l'esame della Corte dei Conti" }, // [SITO]
      anni: { value: "20", unit: "anni", label: "di incentivo GSE sull'energia condivisa", note: "Tariffa premio del decreto CACER" }, // [DEMO]
    },
    liveLabel: "Dato Ardaké",
    presenterAlt: "Alceste Persico del team SUN-FAI presenta i numeri della cooperativa",
  },
  perChi: {
    eyebrow: "Per chi è", // [NUOVO]
    title: "Una comunità aperta a *tutti*", // [NUOVO]
    lead: "Cittadini, imprese, enti: nella stessa zona, chi produce e chi consuma energia si aiuta a vicenda.", // [NUOVO]
    doors: [
      { title: "Cittadini e famiglie", text: "Anche senza pannelli: basta consumare energia nella zona della configurazione.", cta: "Come si entra" },
      { title: "Imprese", text: "Con un tetto fotovoltaico o come consumatori, purché l'energia non sia la vostra attività principale.", cta: "Persona giuridica" },
      { title: "Comuni ed enti", text: "Delibere, verifiche della Corte dei Conti, incontri con i cittadini: vi accompagniamo in ogni passaggio.", cta: "Per i Comuni" },
      { title: "Chi ha un impianto", text: "Hai un impianto, o vuoi farlo? Mettilo in comune.", cta: "Per i produttori" },
    ],
  },
  about: {
    eyebrow: "Chi siamo · Cosa facciamo", // [DEMO]
    title: "Una cooperativa che lavora *sul territorio*", // [DEMO]
    lead: "Mettiamo in rete chi produce energia rinnovabile e chi la consuma nella stessa zona. Il valore che nasce dall'energia condivisa resta ai soci e al territorio.", // [DEMO]
    welcome: "SUN-FAI è una cooperativa nata per essere una comunità energetica rinnovabile sociale e solidale ma è diventata molto di più!", // [SITO]
    caption: "Dalmine, provincia di Bergamo. Il lavoro si fa in ufficio, nei municipi e negli incontri con i cittadini.", // [DEMO]
    rows: [
      { title: "Studiamo e costituiamo la CER", text: "Verifichiamo cabina primaria, impianti e consumi. Poi prepariamo adesioni e pratiche." },
      { title: "La gestiamo ogni giorno", text: "Soci che entrano ed escono, rapporti con il GSE, ripartizione degli incentivi." },
      { title: "Affianchiamo i Comuni", text: "Delibere, verifiche della Corte dei Conti, incontri pubblici con i cittadini." },
      { title: "Rendiamo leggibili i dati", text: "Con Ardaké, la piattaforma che abbiamo sviluppato in casa." },
    ], // [DEMO]
    cta: "Cosa facciamo, nel dettaglio", // [DEMO]
    secondary: "Chi siamo", // [DEMO]
    landscapeAlt: "Un paese della Bergamasca: case, tetti e una strada tra le colline",
    presenterAlt: "Beatrice Parimbelli del team SUN-FAI",
  },
  passaggi: {
    eyebrow: "Le CER", // [DEMO]
    title: "Una comunità energetica,|in *tre passaggi*", // [DEMO]
    bubble: "Non serve avere i pannelli per entrare: puoi partecipare anche solo consumando.", // [DEMO]
    steps: [
      {
        title: "Un impianto produce",
        text: "Pannelli sul tetto di una casa, di un'azienda o di un Comune immettono in rete l'energia che non usano.",
        alt: "Illustrazione: due persone parlano accanto a un pannello fotovoltaico",
      },
      {
        title: "I soci la usano, nella stessa ora",
        text: "Famiglie e imprese collegate alla stessa cabina primaria consumano in quelle ore: è l'energia condivisa.",
        alt: "Illustrazione: una famiglia davanti a una casa con pannelli solari, con una consulente SUN-FAI",
      },
      {
        title: "L'incentivo torna alla comunità",
        text: "Il GSE riconosce per vent'anni un incentivo sull'energia condivisa. Come usarlo lo decidono i soci.",
        alt: "Illustrazione: una coppia controlla i risparmi energetici al computer",
      },
    ], // [DEMO]
    cta: "Approfondisci le CER", // [DEMO]
    secondary: "Chi può aderire", // [DEMO]
  },
  ardake: {
    srTitle: "Ardaké",
    eyebrow: "Piattaforma SUN-FAI", // [DEMO]
    lead: "La tua energia, sempre sotto controllo.", // [SITO]
    text: "Monitora consumi, produzione e risparmio in tempo reale.", // [SITO]
    features: [
      { title: "Energia condivisa, ora per ora", text: "Vedi quanta dell'energia prodotta è stata usata dai soci nella stessa ora." },
      { title: "Produzione e consumi a confronto", text: "Impianti da una parte, utenze dall'altra: grafici che si leggono al primo sguardo." },
      { title: "Quando conviene accendere", text: "Suggerimenti sulle fasce di sole pieno." },
      { title: "Incentivi trasparenti", text: "Come si forma l'incentivo e come viene ripartito." },
    ], // [DEMO] (descriptions shortened from the Ardaké page)
    cta: "Accedi ad Ardaké",
    demo: "Prova la demo",
    madeBy: "Sviluppata dal team SUN-FAI", // [DEMO]
    giorgioAlt: "Giorgio Venezia del team SUN-FAI presenta l'app Ardaké", // [DEMO]
  },
  verifica: {
    eyebrow: "Il primo passo", // [NUOVO]
    title: "La tua zona è già in una *configurazione*?", // [NUOVO]
    text: "Scrivi il tuo Comune: ti diciamo se c'è già una comunità SUN-FAI attiva sulla tua cabina primaria.", // [NUOVO]
    label: "Il tuo Comune",
    placeholder: "es. Dalmine",
    button: "Verifica",
    found: "Sì! {comune} fa parte della configurazione {codice} ({stato}).",
    foundCta: "Manifesta il tuo interesse",
    foundMonitor: "Vedi il monitoraggio",
    notFoundTitle: "Non ancora, ma possiamo verificarlo.",
    notFoundText: "La cabina primaria dipende dall'indirizzo: con il codice POD della bolletta la troviamo noi. Puoi anche cercarla sulla mappa del GSE.",
    write: "Scrivici",
    gseMap: "Mappa delle cabine primarie (GSE)",
    tooShort: "Scrivi almeno due lettere del nome del Comune.",
    small: "La verifica è indicativa: fa fede la cabina primaria del tuo punto di prelievo.",
    presenterAlt: "Lorenzo Ciresa del team SUN-FAI indica il campo di ricerca",
  },
  map: {
    eyebrow: "Configurazioni", // [NUOVO]
    title: "Le nostre *configurazioni*", // [SITO]
    lead: "Ogni configurazione è autonoma e fa riferimento alla propria cabina primaria.", // [SITO]
    legend: { attiva: "Attiva", "in-valutazione": "In valutazione", "in-progetto": "In progetto" }, // [SITO]
    open: "Apri la mappa interattiva",
    loading: "Carico la mappa…",
    staticAlt: "Mappa schematica delle configurazioni SUN-FAI nella provincia di Bergamo",
    cta: "Accedi alla nostra piattaforma di monitoraggio Ardaké!", // [SITO]
    comuni: "Comuni",
    approx: "Posizioni indicative.",
    attribution: "© OpenStreetMap · OpenFreeMap",
    legendLabel: "Legenda",
  },
  team: {
    eyebrow: "Il nostro team",
    title: "Le persone|dietro *l'energia*", // [CONCEPT]
    body: "Siamo un gruppo di persone con competenze diverse, unite da un'unica visione: un'energia rinnovabile, accessibile e solidale, che generi valore per le comunità e per il territorio.", // [CONCEPT]
    cta: "Scopri il team", // [CONCEPT]
  },
  awards: {
    eyebrow: "Riconoscimenti",
    title: "Dal premio di Roma ai Comuni del *territorio*", // [DEMO]
    cta: "Tutti i riconoscimenti", // [DEMO]
    memory: "Entra nella stanza dei ricordi",
  },
  press: {
    eyebrow: "Dicono di noi", // [SITO]
    title: "Dicono di *noi*",
    items: [
      {
        title: "SUN-FAI eletta migliore CER in Italia 2024",
        text: "La cooperativa SUN-FAI di Dalmine è stata eletta \"CER dell'anno 2024\" dall'Italian Forum of Energy Communities (IFEC). Questo riconoscimento premia il progetto per la sua innovazione sociale, economica e tecnologica.",
        source: "Fonte: ENERGIA IN CITTÀ",
      },
      {
        title: "Coi risparmi in bolletta, più aiuti a chi ne ha bisogno",
        text: "La cooperativa SUN-FAI ha avviato un nuovo progetto solidale: finanzierà l'installazione di un impianto fotovoltaico sul Centro di primo ascolto interparrocchiale di Dalmine.",
        source: "Articolo di Pietro Giudici – L'Eco di Bergamo",
      },
      {
        title: "La cooperativa di giovani che scommette sulle CER",
        text: "Nata dalla curiosità e dall'impegno di un gruppo di giovani, SUN-FAI è oggi una realtà consolidata capace di offrire formazione e consulenza su povertà energetica e sostenibilità.",
        source: "Articolo di Pietro Giudici – L'Eco di Bergamo",
      },
    ], // [SITO] verbatim
  },
  social: {
    eyebrow: "Dalla comunità", // [SITO]
    title: "Le ultime dai nostri *canali*", // [SITO]
    text: "Incontri, cantieri, nuovi soci: quello che succede ogni settimana, direttamente da Instagram, LinkedIn e Facebook.", // [SITO]
    all: "Vai a tutte le notizie", // [DEMO]
    follow: "Seguici su {channel}", // [SITO]
    fallback: "Il prossimo post è in arrivo. Intanto, seguici qui.", // [SITO]
    region: "Ultimi aggiornamenti dai canali SUN-FAI", // [DEMO]
  },
  faq: {
    eyebrow: "Domande rapide", // [NUOVO]
    title: "Le domande che ci fanno *di più*",
    items: [
      { q: "Devo installare i pannelli per entrare?", a: "No. Puoi partecipare come consumatore." },
      { q: "Devo cambiare fornitore di energia?", a: "No. Mantieni il tuo contratto e il tuo fornitore." },
      { q: "Quanto costa entrare?", a: "La procedura è gratuita; si sottoscrive una quota sociale di 25 €, una sola volta." },
      { q: "Posso uscire quando voglio?", a: "Sì, puoi recedere in qualsiasi momento." },
      { q: "Chi decide come si usano gli incentivi?", a: "I soci, in assemblea. In cooperativa ogni socio ha un voto." },
    ], // [NUOVO from DEMO]
    all: "Tutte le domande",
    presenterAlt: "Chiara Crivena del team SUN-FAI, pensierosa, accanto alle domande",
  },
  events: {
    eyebrow: "Eventi",
    title: "I prossimi *eventi*", // [SITO]
    empty: "Nessun evento in programma al momento.", // [SITO]
    follow: "Gli incontri nei Comuni li annunciamo sui social: seguici per non perderli.", // [NUOVO]
    sceneAlt: "Illustrazione: un incontro pubblico sull'energia solare, con grafici e un pannello", // [DEMO]
  },
  joinPresenterAlt: "Francesco Crivena, presidente di SUN-FAI, indica il pulsante Diventa socio",
} as const;

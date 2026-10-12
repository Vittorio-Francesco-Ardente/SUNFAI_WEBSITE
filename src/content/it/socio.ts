/**
 * Italian — /diventa-socio, /diventa-socio/compilazione, /diventa-socio/grazie (pack 08).
 * The legal text of the modules is NOT here and is never changed or translated: the modules live in
 * /public/moduli (online form) and /public/moduli/pdf.
 */
export const socio = {
  meta: {
    title: "Diventa socio",
    description:
      "Come aderire a SUN-FAI come persona fisica o giuridica: compilazione online dei moduli, PDF, cosa preparare, quota sociale e passaggi.", // [DEMO]
  },
  hero: {
    eyebrow: "Diventa socio", // [SITO]
    title: "Entra nella *comunità*", // [V2 pack 08]
    lead: "Diventi socio di una cooperativa: voti in assemblea, partecipi alla comunità energetica della tua zona e alle decisioni sugli incentivi. I moduli si compilano online, in pochi minuti.", // [DEMO]
    body: "Cittadini, famiglie, imprese, enti e Comuni possono entrare in SUN-FAI come produttori, consumatori o entrambi. Scegli il modulo giusto: si compila online o in PDF.", // [NUOVO]
    cta: "Apri la compilazione online", // [DEMO]
    pdf: "Scarica il PDF", // [DEMO]
    note: "Persona giuridica? Trovi la domanda dedicata qui sotto.", // [DEMO]
    presenterAlt: "Chiara Crivena del team SUN-FAI, pensierosa",
  },
  paths: {
    eyebrow: "Due percorsi", // [DEMO]
    title: "Persona fisica o *giuridica*", // [DEMO]
    lead: "Cambia solo la domanda di ammissione. In cooperativa ogni socio ha un voto.", // [DEMO]
    docsTitle: "Di solito servono", // [DEMO]
    docsSource: "Dalla domanda di ammissione SUN-FAI.", // [DEMO]
    online: "Apri la compilazione online", // [DEMO]
    pdf: "Scarica il PDF", // [DEMO]
    fisica: {
      label: "Persona fisica", // [DEMO]
      who: "Cittadine e cittadini, famiglie, chi lavora da casa. Anche senza impianto.", // [DEMO]
      examples: ["Consumer: usi l'energia nella zona della configurazione", "Prosumer: hai anche un impianto e lo metti in comune"], // [DEMO]
      docs: ["Documento d'identità e codice fiscale", "IBAN", "Codice POD e ultima bolletta dell'energia elettrica", "Per i prosumer: i dati dell'impianto (kWp)"], // [DEMO]
      note: "Si sottoscrive una quota sociale di 25 €, con bonifico o in contanti.", // [DEMO]
      presenterAlt: "Beatrice Parimbelli del team SUN-FAI",
    },
    giuridica: {
      label: "Persona giuridica", // [DEMO]
      who: "Imprese, Comuni ed enti pubblici, enti religiosi, associazioni, fondazioni e terzo settore.", // [DEMO]
      examples: ["PMI con o senza impianto fotovoltaico", "Enti locali, con i passaggi amministrativi previsti"], // [DEMO]
      docs: [
        "Dati del legale rappresentante",
        "Codice fiscale, P.IVA, codice ATECO prevalente e IBAN",
        "Codice POD e ultima bolletta dell'energia elettrica",
        "Delibera dell'organo sociale che autorizza la domanda",
        "Per le imprese: dichiarazione di PMI",
      ], // [DEMO]
      note: "La partecipazione non può essere l'attività principale dell'impresa: il codice ATECO deve essere diverso da 35.11.00 e 35.14.00. Quota sociale di 25 €.", // [DEMO]
      presenterAlt: "Lorenzo Ciresa del team SUN-FAI",
    },
  },
  docs: {
    eyebrow: "I moduli", // [DEMO]
    title: "Quattro documenti, tutti *online*", // [DEMO]
    lead: "Si compilano dal browser, si stampano e si inviano a SUN-FAI. Il PDF resta disponibile se preferisci la carta.", // [DEMO]
    openOnline: "Apri online", // [DEMO]
    pdf: "Scarica il PDF", // [DEMO]
    openAria: "Apri online: {title}",
    items: [
      { code: "01", title: "Manifestazione di interesse", short: "Il primo passo, non vincolante", pages: 1, text: "Dici come vuoi partecipare: produttore, consumatore o entrambi. Non è una proposta contrattuale." },
      { code: "02", title: "Domanda di ammissione · persona fisica", short: "Cittadini e famiglie", pages: 4, text: "Dati, profilo energetico (consumer o prosumer), quota sociale, informativa e consensi." },
      { code: "03", title: "Domanda di ammissione · persona giuridica", short: "Imprese, enti, associazioni", pages: 4, text: "Rappresentante, dati fiscali e codice ATECO, profilo energetico, delibera di autorizzazione." },
      { code: "04", title: "Modulo di adesione", short: "Per essere ricontattati", pages: 1, text: "Pochi dati e le tue preferenze di orario: ti richiamiamo noi. Non vincola in alcun modo." },
    ], // [SITO §9 / DEMO]
    italianNote: "",
  },
  steps: {
    eyebrow: "Come funziona", // [DEMO]
    title: "Quattro passaggi, nessun impegno finché non *firmi*", // [DEMO]
    items: [
      { t: "Facci sapere che ti interessa", d: "Con la manifestazione di interesse o il modulo di adesione. Non sono vincolanti." },
      { t: "Compila la domanda di ammissione", d: "Persona fisica o giuridica, online o sul PDF." },
      { t: "Quota e documenti", d: "Versi la quota di 25 € e invii modulo firmato e allegati a info@sun-fai.org." },
      { t: "Entri nella configurazione", d: "Quella della tua cabina primaria. Da lì segui la tua energia su Ardaké." },
    ], // [DEMO]
    prepareTitle: "Cosa preparare", // [DEMO]
    prepare: ["Una bolletta recente (serve il codice POD)", "Un documento d'identità", "L'IBAN", "Un contatto di riferimento"], // [DEMO]
    prepareSource: "Dal modulo di adesione SUN-FAI.", // [DEMO]
    progress: "Passo {n} di {total}",
  },
  faq: {
    eyebrow: "Domande frequenti", // [DEMO]
    title: "Prima di *firmare*", // [DEMO]
    text: "Hai un dubbio che qui non c'è? Ti rispondiamo noi.", // [DEMO]
    cta: "Scrivici",
    items: [
      { q: "Quanto costa entrare?", a: "La procedura di adesione è gratuita. Per diventare socio si sottoscrive una quota sociale di 25 €, una sola volta, con bonifico bancario o in contanti." },
      { q: "Devo avere un impianto fotovoltaico?", a: "No. Puoi entrare come consumer. Se hai un impianto, puoi aderire come prosumer." },
      { q: "Cambia qualcosa nella mia bolletta?", a: "No. Mantieni il tuo fornitore e il tuo contratto: la condivisione dell'energia è virtuale." },
      { q: "Dove mando i moduli?", a: "La compilazione online li invia per te. Se usi il PDF, mandalo firmato a info@sun-fai.org con la copia del pagamento e gli allegati richiesti." },
      { q: "Posso uscire?", a: "Sì, puoi recedere in qualsiasi momento, come prevede la normativa sulle comunità energetiche." },
    ], // [DEMO]
  },
  help: {
    bubble: "Hai dubbi su quale modulo scegliere?", // pack 10
    text: "Scrivici: ti aiutiamo a compilarlo.",
    cta: "Scrivici",
  },
  compilazione: {
    metaTitle: "Compilazione online", // [DEMO]
    metaDescription: "Compila online i moduli per aderire a SUN-FAI: manifestazione di interesse, domanda di ammissione, modulo di adesione.", // [DEMO]
    back: "Diventa socio", // [DEMO]
    eyebrow: "Moduli SUN-FAI", // [DEMO]
    title: "Compilazione *online*", // [DEMO]
    lead: "Scegli il documento dalla barra in alto, compila i campi e invialo: arriva a info@sun-fai.org. Puoi anche stamparlo o salvarlo in PDF.", // [DEMO]
    fullscreen: "Apri a schermo intero", // [DEMO]
    iframeTitle: "Moduli SUN-FAI: compilazione online", // [DEMO]
    problem: "Il modulo non si apre?", // [DEMO]
    problemText: "Scarica il PDF, compilalo e invialo firmato a info@sun-fai.org. Oppure scrivici: ti aiutiamo noi.", // [DEMO]
    write: "Scrivi a SUN-FAI", // [DEMO]
    other: "Altri contatti", // [DEMO]
    choose: "Scegli il modulo",
    mailSubject: "Aiuto con i moduli di adesione",
  },
  grazie: {
    metaTitle: "Grazie",
    eyebrow: "Modulo inviato",
    title: "Grazie! Abbiamo ricevuto il tuo *modulo*", // pack 10 mascot line
    text: "Ti scriviamo noi a breve. Nel frattempo puoi scoprire come funziona Ardaké o leggere le ultime notizie.",
    home: "Torna alla home",
    ardake: "Scopri Ardaké",
  },
} as const;

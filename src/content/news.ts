/**
 * News articles [SITO], verbatim (copy-paste artefacts "Energia In Città+1" / "Rinnovabili+1" removed).
 * Official texts: they stay in Italian on the Bergamasque pages too (pack 14.1 §6), with an "(in italiano)" note.
 * Old URLs /notizie/3|4|5 redirect to the news list (the id ↔ article mapping is not known: TODO_SUNFAI).
 * The 2024 award image: run `npm run docs:fetch` to self-host it, then `image` switches to /news/… (see site.ts).
 */
export interface Article {
  slug: string;
  date: string; // ISO
  title: string;
  paragraphs: string[];
  image: { src: string; alt: string };
  remoteImage?: string;
  source?: string;
}

export const articles: Article[] = [
  {
    slug: "sun-fai-eletta-migliore-cer-italia-2024",
    date: "2026-02-15",
    title: "SUN-FAI eletta migliore CER in Italia 2024",
    paragraphs: [
      "La cooperativa SUN-FAI di Dalmine è stata eletta \"CER dell'anno 2024\" dall'Italian Forum of Energy Communities (IFEC), in occasione della sua Quarta Conferenza Nazionale.",
      "Questo riconoscimento premia il progetto per la sua innovazione sociale, economica e tecnologica nel campo delle comunità energetiche rinnovabili.",
      "Insieme al premio IFEC, SUN-FAI ha vinto anche il Premio Michele Calì, contributo economico destinato a una giovane risorsa impegnata nello sviluppo della CER.",
    ],
    image: { src: "/landscapes/landscape-rooftop-solar-mountains.webp", alt: "Tetti con pannelli solari e montagne sullo sfondo" },
    remoteImage: "https://www.sun-fai.org/uploads/1771163637269_elettra-miglior-cer.png",
    source: "Energia in Città",
  },
  {
    slug: "ciserano-supera-esame-corte-dei-conti",
    date: "2026-01-01",
    title: "Il Comune di Ciserano ha superato l'esame della Corte dei Conti",
    paragraphs: [
      "Il Comune di Ciserano ha ufficialmente superato l'esame della Corte dei Conti, un passaggio fondamentale per poter aderire come socio alla nostra cooperativa e partecipare alla Comunità Energetica Rinnovabile con i propri POD.",
      "Con Ciserano, salgono a sette i Comuni che hanno già completato questa procedura: Osio Sotto, Carenno, San Giovanni Bianco, Vedeseta, Levate e Stezzano.",
      "Un passo decisivo per ampliare la rete pubblica all'interno della CER e generare benefici sempre più concreti per il territorio.",
    ],
    image: { src: "/landscapes/landscape-piazza-courtyard-tree.webp", alt: "Una piazza con un grande albero in un paese della Bergamasca" },
  },
  {
    slug: "fondazione-madonna-del-boldesico-socio",
    date: "2025-10-30",
    title: "Fondazione Madonna del Boldesico diventa socio di SUN-FAI",
    paragraphs: [
      "La Fondazione Madonna del Boldesico di Grumello del Monte entra ufficialmente come socio della cooperativa SUN-FAI, dopo l'installazione di un impianto fotovoltaico da oltre 100 kW sul proprio complesso.",
      "Con questa scelta, la Fondazione avvia un nuovo percorso orientato al bene comune, trovando in SUN-FAI una struttura competente in grado di costituire e gestire una configurazione di Comunità Energetica Rinnovabile aperta a tutte le persone del territorio.",
      "Un passo che propone la Fondazione come protagonista attivo sul territorio, affiancando al bene sociale che già promuove un nuovo impegno nella transizione verso modelli più sostenibili.",
    ],
    image: { src: "/landscapes/landscape-olive-hills-panorama.webp", alt: "Colline con ulivi e la pianura sullo sfondo" },
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

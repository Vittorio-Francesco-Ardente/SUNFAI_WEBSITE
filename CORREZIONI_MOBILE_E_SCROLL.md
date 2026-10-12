# SUN-FAI — Revisione responsive e scrolling (12 ottobre 2026)

## Interventi effettivi nel sorgente

1. **CanvasPanel** usa `overflow: clip`: taglia i raggi grafici senza instaurare uno scroll container che blocchi i `position: sticky` dei passaggi narrativi.
2. **PinnedSteps** è attivo soltanto sui desktop sufficientemente larghi e alti, con una progressione più leggibile; mobile e accessibilità a movimento ridotto mostrano i tre passaggi in verticale.
3. **La stanza dei ricordi** usa l'implementazione fornita `TiltedGridHero`: nastro curvo di immagini, animazione indipendente dallo scroll di pagina, mascheratura laterale, traguardi navigabili nella sezione successiva; niente didascalie sovrapposte alle foto. Foto dei singoli eventi da sostituire: ora sono immagini di paesaggio provvisorie già presenti nel progetto.
4. **Header**: menu compatto alle larghezze intermedie invece di sette voci che competono con logo e pulsanti; dock senza variazioni.
5. **Ardaké**: rimossa la larghezza minima fissa di 280 px del titolo animato; telefono ridimensionabile entro il contenitore.
6. **Mobile/touch**: rimossi gli effetti scroll-linked di traslazione/opacità che interferiscono con lo scorrimento; caroselli con scroll-snap meno aggressivo.
7. **Tipografia**: heading e titoli controllati sulle larghezze inferiori a 360 px.

## Verifiche

- `npm run typecheck` — eseguito correttamente nel container.
- **Build ed esecuzione browser non verificabili in questo ambiente**: l'archivio originario contiene dipendenze native per Windows e il container non può scaricare i componenti Linux di `sharp` e Next SWC; il Chromium del container blocca le pagine localhost.
- Per validare la versione su GitHub: push su `main`, verificare Actions → Deploy SUN-FAI website e successivamente testare 320 / 375 / 393 / 768 / 1024 / 1440 px, scroll verticale, carosello dei traguardi nella sezione successiva, ritorno pagina e asset sotto `/SUNFAI_WEBSITE/`.
- L'accesso GitHub dell'assistente ha risposto HTTP 403 per operazioni di scrittura: **nessun aggiornamento remoto è stato effettuato da questo ambiente**.

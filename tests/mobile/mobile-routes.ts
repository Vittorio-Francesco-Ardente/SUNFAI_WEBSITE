/**
 * Routes checked by the mobile tests (pack 15.4). Dynamic slugs are read from the content files,
 * so new members/articles are tested automatically.
 */
import { team } from "../../src/content/team";
import { articles } from "../../src/content/news";

const staticRoutes = [
  "/",
  "/chi-siamo/",
  "/cosa-facciamo/",
  "/team/",
  "/le-cer/",
  "/riconoscimenti/",
  "/notizie/",
  "/ardake/",
  "/ardake/demo/",
  "/ardake/monitoraggio/",
  "/diventa-socio/",
  "/diventa-socio/compilazione/",
  "/contatti/",
  "/note-legali/",
  "/404/",
];

/** Full matrix (nightly / before release). */
export const allRoutes = [...staticRoutes, ...team.map((m) => `/team/${m.slug}/`), ...articles.map((a) => `/notizie/${a.slug}/`)];

/** Quick set (every pack): the six reference screens + the heaviest pages. */
export const quickRoutes = ["/", "/team/", "/team/giorgio-venezia/", "/team/benedetta-petro/", "/ardake/", "/ardake/monitoraggio/", "/riconoscimenti/", "/diventa-socio/compilazione/"];

/** Both locales: Italian at "/…", Bergamasque at "/bergamasch/…" (pack 14). */
export const withLocales = (routes: string[]) => routes.flatMap((r) => [r, r === "/" ? "/bergamasch/" : `/bergamasch${r}`]);

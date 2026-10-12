import { common } from "./common";
import { home } from "./home";
import { team } from "./team";
import { ardake } from "./ardake";
import { pages } from "./pages";
import { riconoscimenti } from "./riconoscimenti";
import { socio } from "./socio";

/** Italian dictionary (source of truth for keys). */
export const it = { common, home, team, ardake, pages, riconoscimenti, socio } as const;

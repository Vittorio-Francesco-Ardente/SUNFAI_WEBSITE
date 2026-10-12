import type { Locale } from "@/lib/i18n";
import { it } from "./it";
import { lmo } from "./lmo";

/** Deep-widen literal types so the Bergamasque dictionary can hold different strings with the same shape. */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends null
      ? null
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : T extends object
          ? { readonly [K in keyof T]: Widen<T[K]> }
          : T;

export type Dict = Widen<typeof it>;

const dicts: Record<Locale, Dict> = { it, lmo };

/** Server-side accessor. Client components receive only the slices they need as props. */
export function getDict(locale: Locale): Dict {
  return dicts[locale];
}

/** "{name} del team" + { name: "Giorgio" } → "Giorgio del team". */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

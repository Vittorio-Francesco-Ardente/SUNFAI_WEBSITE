"use client";

import { usePathname } from "next/navigation";
import { asset } from "@/lib/asset";
import { localeMeta, rememberLocale, switchLocalePath, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content/dict";

/**
 * Footer language segmented control "Italiano | Bergamàsch" (16.7 §5) — the footer's only language control.
 * Keeps the current page; the active segment is a white pill.
 */
export function FooterLangSwitch({ t, locale }: { t: Dict["common"]["nav"]; locale: Locale }) {
  const pathname = usePathname() ?? "/";
  return (
    <nav aria-label={t.language} className="inline-flex w-full rounded-full bg-[#2F6A1E] p-1 sm:w-auto">
      {(["it", "lmo"] as Locale[]).map((l) => {
        const on = l === locale;
        return (
          <a
            key={l}
            href={asset(on ? pathname : switchLocalePath(pathname, l))}
            hrefLang={localeMeta[l].htmlLang}
            lang={localeMeta[l].htmlLang}
            aria-current={on ? "true" : undefined}
            onClick={() => rememberLocale(l)}
            className={
              on
                ? "inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-white px-4 text-[14px] font-bold text-ink sm:flex-none"
                : "inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-4 text-[14px] font-semibold text-white hover:bg-white/10 sm:flex-none"
            }
          >
            {localeMeta[l].label}
          </a>
        );
      })}
    </nav>
  );
}

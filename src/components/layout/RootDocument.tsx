import type { ReactNode } from "react";
import { jakarta, inter, fredoka } from "@/app/fonts";
import { NavShell } from "@/components/nav/NavShell";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/loader/Loader";
import { LOADER_PRECISION_INLINE } from "@/components/loader/loader-precisione-inline";
import { MotionObserver } from "@/components/layout/MotionObserver";
import { getDict } from "@/content/dict";
import { localeMeta, type Locale } from "@/lib/i18n";

/**
 * <head> preflight (runs before paint):
 *  - html.js; html.no-sda when CSS scroll-driven animations are unsupported (Motion-free fallback reveals);
 *  - html.sf-noloader only for explicit ?noloader=1, test automation and bots.
 */
const PREFLIGHT = `(function(){
  var d=document.documentElement;d.classList.add('js');
  try{if(!(window.CSS&&CSS.supports&&CSS.supports('animation-timeline: view()')))d.classList.add('no-sda')}catch(e){d.classList.add('no-sda')}
  var q=location.search;
  // Replay the loader on every FULL page load. Old sessionStorage entries are ignored.
  var skip=/[?&](noloader=1|test)(?:&|$)/.test(q)||/bot|crawl|spider|slurp|facebookexternalhit/i.test(navigator.userAgent);
  if(skip){d.classList.add('sf-noloader');d.classList.add('sf-loader-done')}
  if(/[?&]test(?:&|$)/.test(q))d.classList.add('sf-test');
  // Safety net: never leave a fixed overlay over the page after a script error.
  if(!skip)window.addEventListener('DOMContentLoaded',function(){setTimeout(function(){
    if(!d.classList.contains('sf-loader-done')){
      try{window.sfLoader&&window.sfLoader.destroy&&window.sfLoader.destroy()}catch(e){}
      d.classList.add('sf-loader-done');
      var h=document.getElementById('sf-loader');if(h)h.style.display='none';
    }
  },8000)},{once:true});
})();`;

export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const d = getDict(locale);
  return (
    <html lang={localeMeta[locale].htmlLang} className={`${jakarta.variable} ${inter.variable} ${fredoka.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFLIGHT }} />
        <script dangerouslySetInnerHTML={{ __html: LOADER_PRECISION_INLINE }} />
        <noscript>
          <style>{"#sf-loader{display:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <Loader tagline={d.common.loader} />
        <a className="skip-link" href="#contenuto">
          {d.common.nav.skip}
        </a>
        <NavShell t={d.common.nav} locale={locale} />
        <main id="contenuto" data-sunfai-version="v38-loader-events-mobile" tabIndex={-1} className="relative isolate outline-none">
          {children}
        </main>
        <Footer d={d} locale={locale} />
        <MotionObserver />
      </body>
    </html>
  );
}

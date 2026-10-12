import type { ReactNode } from "react";
import { jakarta, inter, fredoka } from "@/app/fonts";
import { NavShell } from "@/components/nav/NavShell";
import { Footer } from "@/components/layout/Footer";
import { Loader } from "@/components/loader/Loader";
import { MotionObserver } from "@/components/layout/MotionObserver";
import { getDict } from "@/content/dict";
import { localeMeta, type Locale } from "@/lib/i18n";

/**
 * <head> preflight (runs before paint):
 *  - html.js; html.no-sda when CSS scroll-driven animations are unsupported (Motion-free fallback reveals);
 *  - html.sf-noloader to skip the intro loader: seen this session, reduced motion, Save-Data, ?noloader=1, ?test, bots.
 */
const PREFLIGHT = `(function(){var d=document.documentElement;d.classList.add('js');
try{if(!(window.CSS&&CSS.supports&&CSS.supports('animation-timeline: view()')))d.classList.add('no-sda')}catch(e){d.classList.add('no-sda')}
var q=location.search,forced=/[?&]loader=(1|preview)(?:&|$)/.test(q);
var skip=/[?&](noloader=1|test)(?:&|$)/.test(q)||/bot|crawl|spider|slurp|facebookexternalhit|preview/i.test(navigator.userAgent);
try{skip=skip||matchMedia('(prefers-reduced-motion: reduce)').matches||!!(navigator.connection&&navigator.connection.saveData)}catch(e){}
try{if(!forced&&sessionStorage.getItem('sf-loader-p02-v33')==='1')skip=true;else if(!skip)sessionStorage.setItem('sf-loader-p02-v33','1')}catch(e){}
if(forced&&!/[?&](noloader=1|test)(?:&|$)/.test(q)){
  try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)skip=false}catch(e){skip=false}
}
if(skip)d.classList.add('sf-noloader');if(/[?&]test(?:&|$)/.test(q))d.classList.add('sf-test');})();`;

export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const d = getDict(locale);
  return (
    <html lang={localeMeta[locale].htmlLang} className={`${jakarta.variable} ${inter.variable} ${fredoka.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFLIGHT }} />
        <noscript>
          <style>{"#sf-loader,#sf-loader-shell{display:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <Loader tagline={d.common.loader} />
        <a className="skip-link" href="#contenuto">
          {d.common.nav.skip}
        </a>
        <NavShell t={d.common.nav} locale={locale} />
        <main id="contenuto" data-sunfai-version="v33-loader-p02-live" tabIndex={-1} className="relative isolate outline-none">
          {children}
        </main>
        <Footer d={d} locale={locale} />
        <MotionObserver />
      </body>
    </html>
  );
}

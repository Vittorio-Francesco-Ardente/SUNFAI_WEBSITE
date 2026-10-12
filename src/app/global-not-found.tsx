import type { Metadata } from "next";
import "./globals.css";
import { jakarta, inter } from "./fonts";
import { getDict } from "@/content/dict";
import { asset } from "@/lib/asset";
import { CanvasPanel, Ripple } from "@/components/canvas/Canvas";
import { Img } from "@/components/ui/Img";

const it = getDict("it").pages.notFound;
const lmo = getDict("lmo").pages.notFound;

export const metadata: Metadata = { title: `${it.title} · SUN-FAI`, robots: { index: false } };

/**
 * Static 404 (GitHub Pages serves out/404.html for any unknown URL). Two root layouts exist (it / lmo), so a single
 * global page shows both languages: a tiny inline script picks Bergamasque under /bergamasch/ and sets <html lang>.
 * V3: a cream canvas panel with a sun fan on the bottom-right corner and the surprised mascot (16.3: 07 → 404).
 */
export default function GlobalNotFound() {
  const pick = `(function(){var b=/\\/bergamasch(\\/|$)/.test(location.pathname.replace(${JSON.stringify(process.env.NEXT_PUBLIC_BASE_PATH ?? "")},''));if(b){document.documentElement.lang='lmo';document.documentElement.classList.add('nf-lmo')}})();`;
  const block = (t: typeof it, home: string, cls: string, lang: string) => (
    <div className={cls} lang={lang}>
      <p className="eyebrow">{t.eyebrow}</p>
      <h1 className="t-h1 mt-5">
        {t.title}
        <span className="dot">.</span>
      </h1>
      <p className="t-lead mt-6 max-w-[32rem]">{t.text}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a href={asset(home)} className="btn btn--primary btn--lg">
          {t.cta}
        </a>
        <a href={asset(home === "/" ? "/contatti/" : "/bergamasch/contatti/")} className="btn btn--outline btn--lg">
          {t.secondary}
        </a>
      </div>
    </div>
  );
  return (
    <html lang="it" className={`${jakarta.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: pick }} />
        <style>{`.nf-lmo .nf-it{display:none}.nf-lmo .nf-lmo-block{display:block!important}`}</style>
      </head>
      <body className="min-h-svh overflow-x-clip bg-paper">
        <CanvasPanel as="div" tone="cream" className="mt-[clamp(8px,1.2vw,16px)]" bg={<><Ripple at={{ x: 1, y: 1 }} family="sun" core={0.1} widths={[0.1, 0.06, 0.06, 0.07]} fan={{ count: 8, from: 92, to: 178 }} /><Ripple at={{ x: 0, y: 0 }} family="leaf" core={0.035} widths={[0.03, 0.03]} bands={2} /></>}>
        <main className="container-x relative z-[2] grid min-h-[calc(100svh-32px)] items-center gap-10 py-16 lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a href={asset("/")} aria-label="SUN-FAI" className="mb-10 inline-flex">
              <Img src="/brand/sunfai-logo.png" alt="SUN-FAI" sizes="200px" className="h-11 w-auto" />
            </a>
            {block(it, "/", "nf-it", "it")}
            {block(lmo, "/bergamasch/", "nf-lmo-block hidden", "lmo")}
          </div>
          <div className="relative flex items-end justify-center gap-3 lg:col-span-5">
            <span data-mascot="07-surprised-pointing-up" className="block w-[min(200px,48vw)] md:w-[300px]">
              <Img src="/mascot/mascot-07-surprised-pointing-up.webp" alt="" sizes="300px" className="h-auto w-full" />
            </span>
          </div>
        </main>
        </CanvasPanel>
      </body>
    </html>
  );
}

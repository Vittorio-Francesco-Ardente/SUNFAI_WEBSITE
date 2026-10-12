import { SunMark } from "@/components/geometry/shapes";
import { asset } from "@/lib/asset";

/**
 * SUN-FAI intro loader (pack 09): ≈ 2.2 s, CSS keyframes only, in the server HTML (no flash of content).
 * Skipped by the <head> preflight (html.sf-noloader) for: repeat visits in the session, reduced motion,
 * Save-Data, ?noloader=1 / ?test, bots. The page renders normally underneath (no CLS); pointer-events off from 1.7 s.
 * Decorative backdrop matches the homepage; original central logo/wordmark sequence is preserved.
 */
export function Loader({ tagline }: { tagline: string }) {
  return (
    <div id="sf-loader" aria-hidden="true">
      {/* Full-viewport SUN-FAI backdrop, derived from the homepage palette.
          Kept behind the original animated mark/wordmark. */}
      <div
        className="ld-backdrop"
        style={{ backgroundImage: `url("${asset("/loader/sunfai-loader-background-v28.webp")}")` }}
      />

      <div className="ld-center">
        <SunMark className="ld-mark" />
        {/* Official wordmark, cropped from the horizontal logo artwork (never set in a web font) */}
        <span className="ld-word">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/brand/sunfai-logo-horizontal.png")} alt="" width={939} height={270} />
        </span>
        <span className="ld-tag">{tagline}</span>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){var l=document.getElementById('sf-loader');if(!l)return;var done=function(){document.documentElement.classList.add('sf-loader-done')};l.addEventListener('animationend',function(e){if(e.animationName==='sf-ld-out')done()});setTimeout(done,2600)})();",
        }}
      />
    </div>
  );
}

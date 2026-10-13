import { CornerSunrise, SunMark } from "@/components/geometry/shapes";
import { asset } from "@/lib/asset";

/**
 * SUN-FAI intro loader (pack 09): short geometric intro, ≈ 1.5 s total, CSS keyframes only, in the server HTML (no flash of content).
 * Skipped by the <head> preflight (html.sf-noloader) for: repeat visits in the session, reduced motion,
 * Save-Data, ?noloader=1 / ?test, bots. The page renders normally underneath (no CLS); pointer-events off from 1.7 s.
 * Corner groups are purely geometric SUN-FAI motifs (no landscape imagery) and are complete shapes (edge-bleed only).
 */
export function Loader({ tagline }: { tagline: string }) {
  return (
    <div id="sf-loader" aria-hidden="true">
      {/* top-left: orange sail + cream dot */}
      <svg className="ld-corner ld-tl" viewBox="0 0 300 300" style={{ ["--d" as string]: "0ms" }}>
        <path d="M0 0 H300 C270 140 190 250 0 300 Z" fill="var(--geo-orange)" />
        <circle cx="236" cy="70" r="26" fill="var(--geo-cream)" />
      </svg>
      {/* top-right: pale solar rays fanning from the corner */}
      <svg className="ld-corner ld-tr" viewBox="0 0 300 300" style={{ ["--d" as string]: "60ms" }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const a0 = 182 + i * 18;
          const a1 = a0 + 10;
          const r = (deg: number) => (deg * Math.PI) / 180;
          const p = (rad: number, deg: number) => `${(300 + rad * Math.cos(r(deg))).toFixed(1)} ${(0 - rad * Math.sin(r(deg))).toFixed(1)}`;
          return <path key={i} d={`M${p(300, a0)} A300 300 0 0 0 ${p(300, a1)} L${p(70, a1)} A70 70 0 0 1 ${p(70, a0)} Z`} fill="var(--geo-solar)" opacity={i % 2 ? 0.55 : 0.9} />;
        })}
        <path d="M300 0 V60 A60 60 0 0 1 240 0 Z" fill="var(--geo-orange-soft)" />
      </svg>
      {/* bottom-left: yellow quarter disc + peach arc */}
      <svg className="ld-corner ld-bl" viewBox="0 0 300 300" style={{ ["--d" as string]: "120ms" }}>
        <path d="M0 300 V40 A260 260 0 0 1 260 300 Z" fill="var(--geo-peach)" />
        <path d="M0 300 V110 A190 190 0 0 1 190 300 Z" fill="var(--geo-yellow)" />
      </svg>
      {/* bottom-right: CornerSunrise */}
      <div className="ld-corner ld-br" style={{ ["--d" as string]: "180ms" }}>
        <CornerSunrise className="block h-full w-full" />
      </div>

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
            "(function(){var l=document.getElementById('sf-loader');if(!l)return;var done=function(){document.documentElement.classList.add('sf-loader-done')};l.addEventListener('animationend',function(e){if(e.animationName==='sf-ld-out')done()});setTimeout(done,1700)})();",
        }}
      />
    </div>
  );
}

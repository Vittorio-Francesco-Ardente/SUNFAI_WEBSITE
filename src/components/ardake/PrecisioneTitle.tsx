"use client";

import { useEffect, useId, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import GEO from "@/lib/ardake-geometry.json";
import { cn } from "@/lib/cn";

/* =====================================================================
   ARDAKÉ — "PRECISIONE" title animation (pack 05.2), ported from code/prototypes/precisione-title.html.
   0.05 pupil born at frame centre (spring 3.4 Hz, ζ .92) · 0.29–0.80 glides to its place
   0.52 → outlines trace both ways, nearest glyphs first, 45 ms apart, 0.55 s each
   0.75–1.42 radial mask from the eye fills the letters, outlines fade · glyphs align over their last 6 units
   (V3: the micro text "monitora la tua CER / con Sun-Fai" is REMOVED — the client crossed it out) · 2.65–3.13 wink · total ≈ 3.2 s · NO exit (it is a title).
   Pure render(t), driven by requestAnimationFrame, time-based (works at 30 fps), triggered once at 35 % visibility.
   ===================================================================== */

type Glyph = { id: string; fill: string; d: string };
const geo = GEO as { glyphs: Glyph[]; counter: string; pupil: { cx: number; cy: number; r: number }; micro: { x: number; y: number; c: string }[] };

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-5) break;
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return sy(Math.min(1, Math.max(0, t)));
  };
}
const E = {
  glide: bezier(0.65, 0, 0.35, 1),
  mask: bezier(0.45, 0, 0.2, 1),
  align: bezier(0.3, 0, 0.1, 1),
  trace: bezier(0.4, 0, 0.2, 1),
  lidClose: bezier(0.55, 0, 0.85, 0.35),
  lidOpen: bezier(0.12, 0.7, 0.3, 1),
  out: bezier(0.16, 0.84, 0.3, 1),
};
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (t: number, start: number, dur: number) => clamp((t - start) / dur);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const spring = (t: number, f = 3.4, z = 0.92) => {
  if (t <= 0) return 0;
  const w = 2 * Math.PI * f;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
};

const VB = { x: 20, y: 140, w: 580, h: 190 };
const DURATION = 3.2;
const FINAL = 2.2;

export function PrecisioneTitle({ title, replay, className, id }: { title: string; replay?: string; className?: string; id?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const renderRef = useRef<((t: number) => void) | null>(null);
  const raf = useRef(0);
  const [played, setPlayed] = useState(false);
  const uid = `p${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  const play = () => {
    const render = renderRef.current;
    if (!render) return;
    cancelAnimationFrame(raf.current);
    const reduce = matchMedia("(prefers-reduced-motion: reduce), (hover: none), (max-width: 1023px)").matches;
    if (reduce) {
      render(FINAL);
      setPlayed(true);
      return;
    }
    let t0 = 0;
    let hiddenAt = 0;
    const onVis = () => {
      if (document.hidden) hiddenAt = performance.now();
      else if (hiddenAt) t0 += performance.now() - hiddenAt;
    };
    document.addEventListener("visibilitychange", onVis);
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const t = ((now - t0) / 1000) * 1.8;
      render(Math.min(t, DURATION));
      if (t < DURATION) raf.current = requestAnimationFrame(tick);
      else {
        document.removeEventListener("visibilitychange", onVis);
        setPlayed(true);
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const q = <T extends Element>(s: string) => svg.querySelector(s) as T;
    const eye = geo.pupil;
    const maskCircle = q<SVGCircleElement>("[data-mask-circle]");
    const pupil = q<SVGCircleElement>("[data-pupil]");
    const lidTop = q<SVGRectElement>("[data-lid-top]");
    const lidBot = q<SVGRectElement>("[data-lid-bot]");
    const counterMeasure = q<SVGPathElement>("[data-counter-measure]");

    // Measure once, while the SVG is rendered (getBBox returns 0 inside <defs>/<clipPath> or when hidden).
    const cb = counterMeasure.getBBox();
    const glyphs = geo.glyphs.map((g) => {
      const grp = q<SVGGElement>(`[data-glyph="${g.id}"]`);
      const outline = grp.querySelector<SVGPathElement>("[data-outline]")!;
      const fill = grp.querySelector<SVGPathElement>("[data-fill]")!;
      const b = fill.getBBox();
      const c = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
      const dx = c.x - eye.cx, dy = c.y - eye.cy, dist = Math.hypot(dx, dy) || 1;
      const corners = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(([x, y]) => Math.hypot(x - eye.cx, y - eye.cy));
      return { grp, outline, c, dir: { x: dx / dist, y: dy / dist }, dist, near: Math.min(...corners) * 0.6, far: Math.max(...corners), len: outline.getTotalLength(), order: 0 };
    });
    [...glyphs].sort((a, b) => a.dist - b.dist).forEach((g, i) => (g.order = i));
    const R_MAX = Math.max(...glyphs.map((g) => g.far)) + 10;
    const start = { x: VB.x + VB.w / 2, y: VB.y + VB.h / 2 };
    const meet = cb.y + cb.height * 0.66;

    const render = (t: number) => {
      const born = spring(t - 0.05);
      const glide = E.glide(prog(t, 0.29, 0.51));
      pupil.setAttribute("cx", String(lerp(start.x, eye.cx, glide)));
      pupil.setAttribute("cy", String(lerp(start.y, eye.cy, glide)));
      pupil.setAttribute("r", String(eye.r * clamp(born, 0, 1.02)));
      const R = R_MAX * E.mask(prog(t, 0.75, 0.67));
      maskCircle.setAttribute("r", String(R));
      for (const g of glyphs) {
        const ts = 0.52 + g.order * 0.045;
        const tr = E.trace(prog(t, ts, 0.55));
        g.outline.style.strokeDasharray = `${g.len * tr} ${g.len}`;
        g.outline.style.strokeDashoffset = `${-(g.len / 2) * (1 - tr)}`;
        const cover = clamp((R - g.near) / (g.far - g.near));
        g.outline.style.opacity = String((tr > 0 ? 1 : 0) * (1 - cover));
        const al = E.align(prog(t, ts + 0.3, 0.55));
        const off = 6 * (1 - al), sc = lerp(0.985, 1, al);
        g.grp.setAttribute("transform", `translate(${g.dir.x * off} ${g.dir.y * off}) translate(${g.c.x} ${g.c.y}) scale(${sc}) translate(${-g.c.x} ${-g.c.y})`);
      }
      const w = (t - 2.65) * 1000;
      let close = 0;
      if (w > 0 && w < 190) close = E.lidClose(w / 190);
      else if (w >= 190 && w < 250) close = 1;
      else if (w >= 250 && w < 480) close = 1 - E.lidOpen((w - 250) / 230);
      lidTop.setAttribute("x", String(cb.x - 4));
      lidTop.setAttribute("width", String(cb.width + 8));
      lidTop.setAttribute("y", String(cb.y - 4));
      lidTop.setAttribute("height", String(Math.max(0, (meet - cb.y + 4) * close)));
      const hb = (cb.y + cb.height + 4 - meet) * close;
      lidBot.setAttribute("x", String(cb.x - 4));
      lidBot.setAttribute("width", String(cb.width + 8));
      lidBot.setAttribute("y", String(cb.y + cb.height + 4 - hb));
      lidBot.setAttribute("height", String(Math.max(0, hb)));
    };
    renderRef.current = render;
    (window as unknown as { renderPrecisioneAt?: (t: number) => void }).renderPrecisioneAt = render; // ?test frame-by-frame screenshots

    const test = /[?&]test/.test(location.search);
    const reduce = matchMedia("(prefers-reduced-motion: reduce), (hover: none), (max-width: 1023px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4;
    if (test || reduce) {
      render(FINAL);
      setPlayed(!test);
      return;
    }
    render(0);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(svg);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("relative", className)}>
      <h2 id={id} className="sr-only">
        {title}
      </h2>
      <svg ref={svgRef} viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} aria-hidden="true" className="block h-auto w-full overflow-visible">
        <defs>
          <mask id={`${uid}-reveal`} maskUnits="userSpaceOnUse" x={-200} y={-200} width={1200} height={800}>
            <rect x={-200} y={-200} width={1200} height={800} fill="black" />
            {/* SSR/no-JS: fully revealed final frame (r large) */}
            <circle data-mask-circle cx={geo.pupil.cx} cy={geo.pupil.cy} r={1200} fill="white" />
          </mask>
          <clipPath id={`${uid}-counter`}>
            <path d={geo.counter} />
          </clipPath>
        </defs>
        <path data-counter-measure d={geo.counter} fill="none" />
        {geo.glyphs.map((g) => (
          <g key={g.id} data-glyph={g.id}>
            <path data-outline d={g.d} fill="none" stroke={g.fill} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" style={{ opacity: 0 }} />
            <path data-fill d={g.d} fill={g.fill} mask={`url(#${uid}-reveal)`} />
          </g>
        ))}
        <circle data-pupil cx={geo.pupil.cx} cy={geo.pupil.cy} r={geo.pupil.r} fill="#FE5E01" />
        <g clipPath={`url(#${uid}-counter)`}>
          <rect data-lid-top fill="#FE5E01" height={0} />
          <rect data-lid-bot fill="#FE5E01" height={0} />
        </g>
      </svg>
      {replay && played ? (
        <button type="button" onClick={play} className="tlink tlink--ink mt-2 text-[15px]">
          <span>{replay}</span>
          <RotateCcw aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

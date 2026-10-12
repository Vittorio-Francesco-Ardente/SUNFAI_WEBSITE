"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One shared IntersectionObserver per page (pack 01.4 budgets):
 *  - starts the headline line reveal (.hl-anim → .is-in);
 *  - starts the V3 canvas-panel entrance (.canvas-panel → .is-in: ripples grow, people rise) once, on first view;
 *  - in browsers WITHOUT scroll-driven animations (html.no-sda, e.g. Firefox), reveals .reveal / .reveal-stagger / .rise.
 * End states are the CSS default, so nothing stays hidden if this never runs.
 */
export function MotionObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const noSda = document.documentElement.classList.contains("no-sda");
    const sel = noSda ? ".hl-anim:not(.is-in), .canvas-panel:not(.is-in), .reveal:not(.is-in), .reveal-stagger:not(.is-in), .rise:not(.is-in)" : ".hl-anim:not(.is-in), .canvas-panel:not(.is-in)";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const scan = () => document.querySelectorAll(sel).forEach((el) => io.observe(el));
    scan();
    // late content (client sections, carousels) — rescan on DOM additions, cheaply
    let t = 0;
    const mo = new MutationObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(scan, 120);
    });
    mo.observe(document.getElementById("contenuto") ?? document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(t);
    };
  }, [pathname]);
  return null;
}

"use client";

import { useEffect } from "react";

const THEME_ATTR = "data-sf-theme";
const HOST_SELECTORS = ["#sfLoader", "[data-sf-loader]", "[data-loader-root]"];

const OVERLAY_STYLE = `
.sf-autumn-loader-overlay {
  position: absolute;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  pointer-events: none;
  background: rgba(249, 243, 234, .92);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}
.sf-autumn-loader-scene {
  position: relative;
  width: min(72vw, 340px);
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
  isolation: isolate;
}
.sf-autumn-loader-halo,
.sf-autumn-loader-halo::before,
.sf-autumn-loader-halo::after {
  position: absolute;
  border-radius: 999px;
  inset: 0;
  content: "";
}
.sf-autumn-loader-halo {
  width: 80%;
  height: 80%;
  background: #EFE1CD;
  opacity: .95;
  animation: sfAutumnHaloPulse 1.9s ease-in-out infinite;
}
.sf-autumn-loader-halo::before {
  inset: -14%;
  border: 12px solid rgba(218, 195, 162, .45);
}
.sf-autumn-loader-halo::after {
  inset: -28%;
  border: 8px solid rgba(226, 189, 122, .34);
}
.sf-autumn-loader-ground {
  position: absolute;
  bottom: 15%;
  left: 50%;
  width: 58%;
  height: 9%;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgba(152, 120, 78, .18);
  filter: blur(1px);
}
.sf-autumn-loader-mark {
  position: relative;
  z-index: 2;
  width: 38%;
  height: auto;
  opacity: 0;
  transform: translateY(18px) scale(.94);
  filter: drop-shadow(0 12px 18px rgba(88, 49, 27, .15));
  animation:
    sfAutumnLogoIn .52s cubic-bezier(.22,1,.36,1) .08s forwards,
    sfAutumnLogoFloat 3s ease-in-out .7s infinite;
}
.sf-autumn-loader-riccio {
  position: absolute;
  z-index: 3;
  width: 36%;
  height: auto;
  left: 58%;
  bottom: 11%;
  opacity: 0;
  transform: translate(-50%, 88%);
  filter: drop-shadow(0 10px 16px rgba(77, 49, 29, .18));
  animation:
    sfAutumnRiccioPeek .68s cubic-bezier(.2,.9,.2,1.08) .42s forwards,
    sfAutumnRiccioBob 2.25s ease-in-out 1.2s infinite;
}
.sf-autumn-loader-overlay.is-exit {
  animation: sfAutumnLoaderExit .46s cubic-bezier(.4,0,.2,1) forwards;
}
@keyframes sfAutumnLogoIn {
  from { opacity: 0; transform: translateY(18px) scale(.94); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes sfAutumnLogoFloat {
  0%,100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-3px) scale(1.012); }
}
@keyframes sfAutumnRiccioPeek {
  0% { opacity: 0; transform: translate(-50%, 88%); }
  72% { opacity: 1; transform: translate(-50%, -2%); }
  100% { opacity: 1; transform: translate(-50%, 0); }
}
@keyframes sfAutumnRiccioBob {
  0%,100% { transform: translate(-50%, 0) rotate(0deg); }
  50% { transform: translate(-50%, -2px) rotate(-1.2deg); }
}
@keyframes sfAutumnHaloPulse {
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.025); }
}
@keyframes sfAutumnLoaderExit {
  to { opacity: 0; transform: scale(.985); }
}
`;

const OVERLAY_HTML = `
  <div class="sf-autumn-loader-scene" aria-hidden="true">
    <div class="sf-autumn-loader-halo"></div>
    <div class="sf-autumn-loader-ground"></div>
    <img class="sf-autumn-loader-mark" src="/brand/sunfai-logo-autunno.png" alt="" />
    <img class="sf-autumn-loader-riccio" src="/brand/autumn-hedgehog.svg" alt="" />
  </div>
`;

function themeIsAutumn() {
  return document.documentElement.dataset.sfTheme === "autumn";
}

function collectHosts() {
  const out: HTMLElement[] = [];
  for (const selector of HOST_SELECTORS) {
    document.querySelectorAll<HTMLElement>(selector).forEach((node) => {
      if (!out.includes(node)) out.push(node);
    });
  }
  return out;
}

function attachOverlay(host: HTMLElement) {
  const root = host.shadowRoot;
  if (!root) return;
  if (root.querySelector(".sf-autumn-loader-overlay")) return;

  const style = document.createElement("style");
  style.setAttribute("data-sf-autumn-loader-style", "true");
  style.textContent = OVERLAY_STYLE;

  const overlay = document.createElement("div");
  overlay.className = "sf-autumn-loader-overlay";
  overlay.innerHTML = OVERLAY_HTML;

  root.appendChild(style);
  root.appendChild(overlay);

  window.setTimeout(() => overlay.classList.add("is-exit"), 2350);
  window.setTimeout(() => {
    overlay.remove();
    style.remove();
  }, 2900);
}

function cleanupOverlay(host: HTMLElement) {
  const root = host.shadowRoot;
  if (!root) return;
  root.querySelector(".sf-autumn-loader-overlay")?.remove();
  root.querySelector("[data-sf-autumn-loader-style]")?.remove();
}

function syncLoaderDecoration() {
  const hosts = collectHosts();
  for (const host of hosts) {
    if (themeIsAutumn()) attachOverlay(host);
    else cleanupOverlay(host);
  }
}

export function AutumnLoaderBridge() {
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    const run = () => window.requestAnimationFrame(syncLoaderDecoration);

    run();
    const observer = new MutationObserver(run);
    observer.observe(html, { attributes: true, attributeFilter: [THEME_ATTR] });
    if (body) observer.observe(body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}

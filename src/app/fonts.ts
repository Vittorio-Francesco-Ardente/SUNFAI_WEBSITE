import localFont from "next/font/local";

/** Self-hosted (OFL) — no calls to external font services (see /note-legali). Latin subset covers ö ü è é à ò ì ù. */
export const jakarta = localFont({
  src: "./fonts/PlusJakartaSans-Variable.woff2",
  variable: "--font-jakarta",
  weight: "200 800",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

/** Ardaké micro-typography (Precisione title). Closest OFL match to the original. */
export const fredoka = localFont({
  src: "./fonts/Fredoka-700.woff2",
  variable: "--font-fredoka",
  weight: "700",
  display: "swap",
  preload: false,
});

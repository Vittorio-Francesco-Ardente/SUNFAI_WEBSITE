/** Motion constants shared by Motion (motion/react) components (pack 01.4). */
export const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT_SOFT = [0.65, 0, 0.35, 1] as const;
export const SPRING_SOFT = { type: "spring" as const, stiffness: 210, damping: 30, mass: 0.9 };
export const SPRING_LAYOUT = { type: "spring" as const, stiffness: 260, damping: 32, mass: 0.9 };

/** ?test flag: disables autoplay animations and the loader (pack 15.4). */
export function isTestMode() {
  if (typeof window === "undefined") return false;
  return /[?&]test\b/.test(window.location.search);
}

/** True in the browser when the user asked for reduced motion or the ?test flag is set. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || isTestMode();
}

/** Two-digit index: 4 → "04". */
export const pad2 = (n: number) => String(n).padStart(2, "0");

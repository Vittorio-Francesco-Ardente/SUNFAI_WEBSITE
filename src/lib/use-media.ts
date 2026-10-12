"use client";
/**
 * Small hooks for responsive behaviour that CSS alone can't decide (static-export safe:
 * they return a server-safe default during prerender and update after hydration).
 */
import { useEffect, useSyncExternalStore } from "react";

export function useMediaQuery(query: string, serverDefault = false): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverDefault,
  );
}

export const useIsPhone = () => useMediaQuery("(max-width: 767.98px)");
/** Real hover + fine pointer: enables magnification, hover reveals, cursor-follow effects. */
export const useCanHover = () => useMediaQuery("(hover: hover) and (pointer: fine)");
export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useLandscapePhone = () => useMediaQuery("(max-height: 500px) and (orientation: landscape)");

/** Data saver (Chrome Android) — skip MapLibre/three preloading and autoplay animations. */
export function useSaveData(): boolean {
  const media = useMediaQuery("(prefers-reduced-data: reduce)");
  const conn = typeof navigator !== "undefined" ? (navigator as Navigator & { connection?: { saveData?: boolean } }).connection : undefined;
  return media || !!conn?.saveData;
}

/**
 * Sets data-keyboard-open on <html> while the on-screen keyboard is open (visualViewport shrinks),
 * so the dock can hide (see mobile.css). Mount once in the root layout.
 */
export function useKeyboardFlag() {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const open = vv.height < window.innerHeight * 0.75 && !!document.activeElement?.matches("input, textarea, select, [contenteditable]");
      document.documentElement.dataset.keyboardOpen = String(open);
    };
    const onBlur = () => setTimeout(update, 50);
    vv.addEventListener("resize", update);
    window.addEventListener("focusin", update);
    window.addEventListener("focusout", onBlur);
    return () => {
      vv.removeEventListener("resize", update);
      window.removeEventListener("focusin", update);
      window.removeEventListener("focusout", onBlur);
    };
  }, []);
}

/** Marks low-end devices so expensive effects (backdrop blur) can be dropped. Mount once. */
export function useLowEndFlag() {
  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    if (cores <= 4 || mem <= 2) document.documentElement.classList.add("low-end");
  }, []);
}

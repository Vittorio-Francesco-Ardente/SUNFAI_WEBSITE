"use client";

import { useEffect, useRef, useState } from "react";
import { Palette, X } from "lucide-react";

const STORAGE_KEY = "sunfai-preview-theme-v1";
type Theme = "standard" | "autumn";

function themeFromDocument(): Theme {
  return document.documentElement.dataset.sfTheme === "autumn" ? "autumn" : "standard";
}

/** Optional, visitor-local visual preview. Never changes routes, people or content. */
export function ThemePreview() {
  const [theme, setTheme] = useState<Theme>("standard");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTheme(themeFromDocument());
  }, []);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const choose = (next: Theme) => {
    document.documentElement.dataset.sfTheme = next;
    setTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Theme remains usable even when browser storage is disabled.
    }
    setOpen(false);
  };

  return (
    <div className="sf-theme-preview" ref={rootRef} data-sf-theme-selector>
      {open && (
        <div className="sf-theme-preview-panel" role="group" aria-label="Seleziona il tema del sito">
          <div className="sf-theme-preview-heading">
            <span>Tema del sito</span>
            <button type="button" className="sf-theme-preview-close" aria-label="Chiudi selezione tema" onClick={() => setOpen(false)}>
              <X size={17} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
          <p className="sf-theme-preview-description">L’anteprima cambia solo l’aspetto grafico.</p>
          <div className="sf-theme-preview-options">
            <button type="button" aria-pressed={theme === "standard"} onClick={() => choose("standard")}
              className="sf-theme-preview-option">
              <span className="sf-theme-swatch sf-theme-swatch-standard" aria-hidden="true" /> Standard
            </button>
            <button type="button" aria-pressed={theme === "autumn"} onClick={() => choose("autumn")}
              className="sf-theme-preview-option">
              <img src="/brand/sunfai-logo-autunno.png" className="sf-theme-preview-mark" alt="" aria-hidden="true" /> Autunno
            </button>
          </div>
        </div>
      )}
      <button type="button" className="sf-theme-preview-trigger" aria-label="Scegli il tema grafico del sito"
        aria-expanded={open} onClick={() => setOpen((old) => !old)}>
        {theme === "autumn"
          ? <img src="/brand/sunfai-logo-autunno.png" className="sf-theme-preview-mark sf-theme-preview-mark--trigger" alt="" aria-hidden="true" />
          : <Palette size={18} strokeWidth={1.9} aria-hidden="true" />}
        <span>Tema</span>
      </button>
    </div>
  );
}

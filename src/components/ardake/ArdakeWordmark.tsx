"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";

const LETTERS = [
  { char: "A", color: "#F5C335", rotate: "-2deg" },
  { char: "r", color: "#4B8B2F", rotate: "1deg" },
  { char: "D", color: "#FE5F00", rotate: "-3deg" },
  { char: "a", color: "#F3C300", rotate: "2deg" },
  { char: "K", color: "#4B8B2F", rotate: "-2deg" },
  { char: "é", color: "#FE5F00", rotate: "3deg" },
];

export function ArdakeWordmark({ title, replay, className, id }: { title: string; replay?: string; className?: string; id?: string }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [playId, setPlayId] = useState(0);
  const [playedOnce, setPlayedOnce] = useState(false);

  const start = () => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlayedOnce(true);
      return;
    }
    setPlayId((current) => current + 1);
    setPlayedOnce(true);
  };

  useEffect(() => {
    const node = scopeRef.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPlayedOnce(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div className={cn("relative", className)} ref={scopeRef}>
      <h2 id={id} className="sr-only">{title}</h2>
      <div aria-hidden="true" className="ardake-wordmark">
        {LETTERS.map((letter, index) => (
          <span
            key={`${playId}-${index}`}
            className="ardake-wordmark-letter"
            style={{
              color: letter.color,
              rotate: letter.rotate,
              opacity: playId > 0 || playedOnce ? 1 : 0,
              animation: playId > 0 ? `ardake-wordmark-pop 560ms cubic-bezier(.2,.9,.25,1) both ${index * 90}ms` : undefined,
            }}
          >
            {letter.char}
          </span>
        ))}
      </div>
      {replay && playedOnce ? (
        <button type="button" onClick={start} className="tlink tlink--ink mt-3 text-[15px]">
          <span>{replay}</span>
          <RotateCcw aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

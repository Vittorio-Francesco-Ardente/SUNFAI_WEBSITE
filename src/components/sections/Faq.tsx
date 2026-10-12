import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

/** Native details/summary accordion: works without JavaScript; whole row is the button (≥ 56 px). */
export function Faq({ items, className }: { items: readonly { q: string; a: string }[]; className?: string }) {
  return (
    <div className={cn("faq divide-y divide-ink/10 border-y border-ink/10", className)}>
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-6 py-4 font-display text-[1.1rem] font-extrabold tracking-[-0.02em] text-ink sm:text-[1.25rem]">
            {item.q}
            <span className="faq-icon grid size-11 shrink-0 place-items-center rounded-full bg-paper-2 transition-[transform,background-color] duration-300">
              <Plus className="size-5" aria-hidden />
            </span>
          </summary>
          <div className="t-body max-w-[52rem] pb-6 pr-4 sm:pr-16">{item.a}</div>
        </details>
      ))}
    </div>
  );
}

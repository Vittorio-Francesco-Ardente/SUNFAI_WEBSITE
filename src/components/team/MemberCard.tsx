import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { lhref, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { MemberVisual, type MemberLite } from "./MemberVisual";

/** CONCEPT_3 small card: backdrop + cut-out (or initials), name on 2 lines, role, pill, arrow. Hover: lift, person rises, orange underline. */
export function MemberCard({
  m,
  locale,
  photoComing,
  size = "sm",
  usePose = false,
  sizes = "(max-width: 767px) 44vw, 18vw",
  className,
}: {
  m: MemberLite;
  locale: Locale;
  photoComing: string;
  size?: "sm" | "lg";
  usePose?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <Link href={lhref(locale, `/team/${m.slug}/`)} className={cn("card hover-card flex h-full flex-col overflow-hidden !rounded-[22px]", className)}>
      <span className={cn("relative block w-full overflow-hidden", size === "lg" ? "aspect-[1/1.08]" : "aspect-[1/1.05]")}>
        <MemberVisual m={m} usePose={usePose} sizes={sizes} photoComing={photoComing} />
      </span>
      <span className={cn("flex flex-1 flex-col gap-2", size === "lg" ? "p-5" : "p-3.5")}>
        <span className="flex items-start justify-between gap-2">
          <span className={cn("hc-name font-display font-extrabold leading-tight tracking-[-0.02em] text-ink", size === "lg" ? "text-[1.25rem]" : "text-[15px] sm:text-[16px]")}>
            <span className="block">{m.firstName}</span>
            <span className="block">{m.lastName}</span>
          </span>
          <span className={cn("hc-arrow grid shrink-0 place-items-center rounded-full bg-peach-light", size === "lg" ? "size-10" : "size-8")}>
            <ArrowRight className="size-4" aria-hidden />
          </span>
        </span>
        <span className="text-[13px] leading-snug text-slate sm:text-[14px]">{m.group === "board" ? m.role : m.groupLabel}</span>
        <span className="mt-auto flex flex-wrap gap-1.5">
          {m.tags.slice(0, size === "lg" ? 2 : 1).map((t) => (
            <span key={t} className="pill !whitespace-normal !text-[13px]">
              {t}
            </span>
          ))}
        </span>
      </span>
    </Link>
  );
}

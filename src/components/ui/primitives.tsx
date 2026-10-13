import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";

/** Intrinsic tags allowed for polymorphic primitives (keeps JSX props typed). */
export type Tagname = "h1" | "h2" | "h3" | "h4" | "p" | "div" | "section" | "span" | "article" | "li" | "header";
import { ArrowRight, ArrowUpRight, Download } from "lucide-react";
import { cn } from "@/lib/cn";
import { lhref, type Locale } from "@/lib/i18n";
import { asset } from "@/lib/asset";

/* ---------------- Headline: "line|line *accent*" → lines + accent + yellow full stop ---------------- */

type Part = { text: string; accent: boolean };
function parseLine(line: string): Part[] {
  const out: Part[] = [];
  line.split(/(\*[^*]+\*)/).forEach((chunk) => {
    if (!chunk) return;
    if (chunk.startsWith("*") && chunk.endsWith("*")) out.push({ text: chunk.slice(1, -1), accent: true });
    else out.push({ text: chunk, accent: false });
  });
  return out;
}

/** Plain-text version of a headline string (for aria/meta). */
export const plainHeadline = (h: string) => h.replace(/\|/g, " ").replace(/\*/g, "");

/**
 * Concept headline: huge, tight, accent word in orange (or leaf/solar), yellow full stop.
 * Lines split on "|" and reveal from a mask (pack 01.4 §2); the accent lands last, the dot pops.
 */
export function Headline({
  text,
  as: Tag = "h2",
  size = "h2",
  tone = "orange",
  className,
  dot = true,
  animate = true,
  delay,
  id,
}: {
  text: string;
  as?: Tagname;
  size?: "hero" | "h1" | "h2" | "h2s" | "h3";
  tone?: "orange" | "leaf" | "solar";
  className?: string;
  dot?: boolean;
  animate?: boolean;
  delay?: number;
  id?: string;
}) {
  const lines = text.split("|");
  const last = text.trim().slice(-1);
  const showDot = dot && last !== "?" && last !== "!";
  const accentCls = tone === "leaf" ? "accent accent--leaf" : tone === "solar" ? "accent accent--solar" : "accent";
  const sizeCls = { hero: "t-hero", h1: "t-h1", h2: "t-h2", h2s: "t-h2s", h3: "t-h3" }[size];
  const style = delay ? ({ "--hl-delay": `${delay}ms` } as CSSProperties) : undefined;
  return (
    <Tag id={id} className={cn(sizeCls, animate && "hl-anim", className)} style={{ ...style, "--n": lines.length } as CSSProperties}>
      {lines.map((line, i) => (
        <span key={i} className="hl-line">
          <span style={{ "--i": i } as CSSProperties}>
            {parseLine(line).map((p, j) =>
              p.accent ? (
                <span key={j} className={accentCls}>
                  {p.text}
                </span>
              ) : (
                <span key={j}>{p.text}</span>
              ),
            )}
            {showDot && i === lines.length - 1 ? (
              <span className="dot" aria-hidden="true">
                .
              </span>
            ) : null}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Rich inline text: "*word*" → highlighted with a flat tint marker (no gradient). */
export function Marked({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(/(\*[^*]+\*)/).map((c, i) =>
        c.startsWith("*") && c.endsWith("*") ? (
          <mark key={i} className="rounded-[4px] bg-[#FBF2DA] px-[.15em] text-ink [box-decoration-break:clone]">
            {c.slice(1, -1)}
          </mark>
        ) : (
          <span key={i}>{c}</span>
        ),
      )}
    </span>
  );
}

export function Eyebrow({
  children,
  upper = false,
  tone = "orange",
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  upper?: boolean;
  tone?: "orange" | "leaf";
  className?: string;
  as?: Tagname;
}) {
  return <Tag className={cn("eyebrow", upper && "eyebrow--upper", tone === "leaf" && "eyebrow--leaf", className)}>{children}</Tag>;
}

export function GhostNumeral({ n, className }: { n: string; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("ghost-num", className)}>
      {n}
    </span>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("pill", className)}>{children}</span>;
}

/* ---------------- Paper buttons (pack 01.1): flat, darker bottom edge, neutral shadow, icon INLINE ---------------- */

type Variant = "primary" | "dark" | "outline" | "light";
type Size = "sm" | "md" | "lg";

export function btnClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn("btn", `btn--${variant}`, `btn--${size}`, className);
}

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);
/** Raw public files (PDF, the online modules) bypass next/link but still need the basePath. */
const isFile = (href: string) => /\.(pdf|html)(#.*)?$/.test(href);
const rawHref = (href: string) => (href.startsWith("/") ? asset(href) : href);

/**
 * Button-styled link. Internal paths are localised with `locale`; external links open in a new tab.
 * `icon`: "arrow" (default) · "external" · "download" · false.
 */
export function ButtonLink({
  href,
  locale,
  children,
  variant = "primary",
  size = "md",
  icon = "arrow",
  className,
  download,
  ...rest
}: {
  href: string;
  locale?: Locale;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: "arrow" | "external" | "download" | false;
  className?: string;
  download?: boolean;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">) {
  const Icon = icon === "external" ? ArrowUpRight : icon === "download" ? Download : ArrowRight;
  const body = (
    <>
      {icon === "download" ? <Icon aria-hidden strokeWidth={2.2} /> : null}
      <span>{children}</span>
      {icon && icon !== "download" ? <Icon aria-hidden strokeWidth={2.2} className="btn-arrow" /> : null}
    </>
  );
  const cls = btnClass(variant, size, className);
  if (isExternal(href) || download || isFile(href)) {
    const ext = /^https?:/.test(href);
    return (
      <a href={rawHref(href)} className={cls} download={download || undefined} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {body}
      </a>
    );
  }
  return (
    <Link href={locale ? lhref(locale, href) : href} className={cls} {...rest}>
      {body}
    </Link>
  );
}

/** Underlined text link with a sliding arrow (concept "Scopri di più →"). */
export function TextLink({
  href,
  locale,
  children,
  tone = "leaf",
  icon = "arrow",
  className,
  ...rest
}: {
  href: string;
  locale?: Locale;
  children: ReactNode;
  tone?: "leaf" | "ink" | "orange";
  icon?: "arrow" | "external" | false;
  className?: string;
} & Omit<ComponentProps<"a">, "href" | "className" | "children">) {
  const cls = cn("tlink", tone === "ink" && "tlink--ink", tone === "orange" && "tlink--orange", className);
  const Icon = icon === "external" ? ArrowUpRight : ArrowRight;
  const body = (
    <>
      <span>{children}</span>
      {icon ? <Icon aria-hidden strokeWidth={2.1} /> : null}
    </>
  );
  if (isExternal(href) || isFile(href)) {
    const ext = /^https?:/.test(href);
    return (
      <a href={rawHref(href)} className={cls} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {body}
      </a>
    );
  }
  return (
    <Link href={locale ? lhref(locale, href) : href} className={cls} {...rest}>
      {body}
    </Link>
  );
}

/** Localised next/link. */
export function L({ href, locale, ...rest }: { href: string; locale: Locale } & Omit<ComponentProps<typeof Link>, "href">) {
  return <Link href={lhref(locale, href)} {...rest} />;
}

/** Section wrapper: clips only horizontally (pack 01.2), carries data-section for tests/QA. */
export function Section({
  id,
  name,
  bg = "paper",
  className,
  children,
  ...rest
}: {
  id?: string;
  name: string;
  bg?: "paper" | "paper-2" | "mint" | "none";
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"section">, "className" | "children" | "id">) {
  const bgCls = { paper: "bg-paper", "paper-2": "bg-paper-2", mint: "bg-mint", none: "" }[bg];
  return (
    <section id={id} data-section={name} className={cn("sf-section", bgCls, className)} {...rest}>
      {children}
    </section>
  );
}

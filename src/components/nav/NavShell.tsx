"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ComponentType, type MouseEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import {
  ArrowRight,
  Award,
  ChartLine,
  HandHeart,
  Mail,
  Menu as MenuIcon,
  Newspaper,
  Sunrise,
  UserPlus,
  Users,
  Wrench,
  X,
  type LucideProps,
} from "lucide-react";
import { SunMark, CornerSunrise } from "@/components/geometry/shapes";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { Img } from "@/components/ui/Img";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { lhref, localeMeta, rememberLocale, switchLocalePath, unlocalized, type Locale } from "@/lib/i18n";
import { useKeyboardFlag, useLowEndFlag } from "@/lib/use-media";
import { initialDockScrollState, nextDockScrollState } from "@/lib/dock-scroll";
import { EASE_OUT_SOFT } from "@/lib/motion";
import { site, social } from "@/lib/site";
import type { Dict } from "@/content/dict";

type NavLabels = Dict["common"]["nav"];
type Icon = ComponentType<LucideProps>;
type Item = { key: string; href: string; label: string; icon: Icon | "mark" };

const THRESHOLD = 80;

function buildItems(t: NavLabels) {
  const main: Item[] = [
    { key: "chi-siamo", href: "/chi-siamo/", label: t.chiSiamo, icon: HandHeart },
    { key: "cosa-facciamo", href: "/cosa-facciamo/", label: t.cosaFacciamo, icon: Wrench },
    { key: "team", href: "/team/", label: t.team, icon: Users },
    { key: "le-cer", href: "/le-cer/", label: t.leCer, icon: Sunrise },
    { key: "riconoscimenti", href: "/riconoscimenti/", label: t.riconoscimenti, icon: Award },
    { key: "notizie", href: "/notizie/", label: t.notizie, icon: Newspaper },
    { key: "ardake", href: "/ardake/", label: t.ardake, icon: ChartLine },
  ];
  const home: Item = { key: "home", href: "/", label: t.home, icon: "mark" };
  const contact: Item = { key: "contatti", href: "/contatti/", label: t.contattaci, icon: Mail };
  const join: Item = { key: "socio", href: "/diventa-socio/", label: t.diventaSocio, icon: UserPlus };
  return { main, home, contact, join };
}

function isActive(pathname: string, href: string) {
  const p = unlocalized(pathname);
  if (href === "/") return p === "/";
  return p === href || p.startsWith(href) || `${p}/` === href;
}

/** The 80 px sentinel: one IntersectionObserver, no scroll listener (pack 15.3). */
function useScrolledPast() {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const s = document.createElement("div");
    s.setAttribute("aria-hidden", "true");
    s.style.cssText = `position:absolute;top:0;left:0;width:1px;height:${THRESHOLD}px;pointer-events:none;visibility:hidden`;
    document.body.prepend(s);
    const io = new IntersectionObserver(([e]) => setPast(!e.isIntersecting), { threshold: 0 });
    io.observe(s);
    return () => {
      io.disconnect();
      s.remove();
    };
  }, []);
  return past;
}

export function NavShell({ t, locale }: { t: NavLabels; locale: Locale }) {
  const pathname = usePathname() ?? "/";
  const past = useScrolledPast();
  const [sheet, setSheet] = useState(false);
  const [atTop8, setAtTop8] = useState(true);
  const [dockVisible, setDockVisible] = useState(false);
  const dockScroll = useRef(initialDockScrollState());
  const items = buildItems(t);
  useKeyboardFlag();
  useLowEndFlag();

  useEffect(() => {
    let frame = 0;
    dockScroll.current = initialDockScrollState(window.scrollY);
    setDockVisible(dockScroll.current.visible);
    const measure = () => {
      frame = 0;
      const y = window.scrollY;
      setAtTop8(y < 8);
      const next = nextDockScrollState(dockScroll.current, y);
      if (next.visible !== dockScroll.current.visible) setDockVisible(next.visible);
      dockScroll.current = next;
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.sheetOpen = String(sheet);
  }, [sheet]);

  const firstPath = useRef(true);
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    dockScroll.current = initialDockScrollState(window.scrollY);
    setDockVisible(dockScroll.current.visible);
    if (window.location.hash) {
      const targetId = decodeURIComponent(window.location.hash.slice(1));
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          document.getElementById(targetId)?.scrollIntoView({ behavior: "auto", block: "start" });
        });
      });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.getElementById("contenuto")?.focus?.({ preventScroll: true });
  }, [pathname]);

  const close = useCallback(() => setSheet(false), []);

  return (
    <>
      <TopBar t={t} locale={locale} pathname={pathname} items={items} hidden={past} solid={!atTop8} onMenu={() => setSheet(true)} menuOpen={sheet} />
      <DesktopDock t={t} locale={locale} pathname={pathname} items={items} visible={dockVisible && !sheet} />
      <MobileDock t={t} locale={locale} pathname={pathname} items={items} visible={dockVisible && !sheet} onMore={() => setSheet(true)} moreOpen={sheet} />
      <MenuSheet t={t} locale={locale} pathname={pathname} items={items} open={sheet} onClose={close} />
    </>
  );
}

/* ---------------------------------------------------------------- Logo */
function Logo({ locale, t, onClick, className }: { locale: Locale; t: NavLabels; onClick?: () => void; className?: string }) {
  const router = useRouter();
  const path = usePathname() ?? "/";
  const href = lhref(locale, "/");
  const timer = useRef<number | null>(null);
  const cleanup = useRef<number | null>(null);
  const [returning, setReturning] = useState(false);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    if (cleanup.current !== null) window.clearTimeout(cleanup.current);
    document.documentElement.classList.remove("sf-logo-nav-home");
  }, []);

  // Keep the class until the destination has actually rendered, including on slow devices.
  useEffect(() => {
    if (!returning || !isActive(path, "/")) return;
    if (cleanup.current !== null) window.clearTimeout(cleanup.current);
    cleanup.current = window.setTimeout(() => {
      setReturning(false);
      document.documentElement.classList.remove("sf-logo-nav-home");
      cleanup.current = null;
    }, 460);
  }, [path, returning]);

  const goHome = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    // The same logo also appears in the menu sheet: closing the sheet unmounts
    // this instance, so that link must use normal immediate navigation.
    if (onClick) return;
    // Leave browser-native modified clicks and external new-tab behavior intact.
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    event.preventDefault();
    if (timer.current !== null) window.clearTimeout(timer.current);
    if (cleanup.current !== null) window.clearTimeout(cleanup.current);
    setReturning(true);
    const onHome = isActive(path, "/");
    if (!onHome) document.documentElement.classList.add("sf-logo-nav-home");
    timer.current = window.setTimeout(() => {
      if (onHome) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push(href);
      }
      timer.current = null;
    }, 160);
    cleanup.current = window.setTimeout(() => {
      setReturning(false);
      document.documentElement.classList.remove("sf-logo-nav-home");
      cleanup.current = null;
    }, 2400);
  };

  return (
    <Link href={href} aria-label={t.logoAria} onClick={goHome} data-returning={returning} className={cn("sf-home-logo relative inline-flex min-h-11 shrink-0 items-center", className)}>
      <Img src="/brand/sunfai-logo.png" alt="" sizes="200px" priority className="h-[30px] w-auto md:h-[34px] lg:h-[38px] xl:h-[42px] 2xl:h-[46px]" />
    </Link>
  );
}

/* ---------------------------------------------------------------- Language switch */
function LangSwitch({ locale, pathname, t, variant = "segmented" }: { locale: Locale; pathname: string; t: NavLabels; variant?: "segmented" | "large" | "round" }) {
  const other: Locale = locale === "it" ? "lmo" : "it";
  const go = (l: Locale) => asset(switchLocalePath(pathname, l));
  if (variant === "round") {
    return (
      <a
        href={go(other)}
        hrefLang={localeMeta[other].htmlLang}
        lang={localeMeta[other].htmlLang}
        onClick={() => rememberLocale(other)}
        aria-label={localeMeta[other].label}
        className="flex size-full items-center justify-center rounded-full bg-dock-item text-[13px] font-bold tracking-wide text-ink/80 transition-colors hover:bg-dock-item-hover"
      >
        {localeMeta[other].short}
      </a>
    );
  }
  if (variant === "large") {
    return (
      <div role="group" aria-label={t.language} className="grid grid-cols-2 gap-2">
        {(["it", "lmo"] as Locale[]).map((l) => (
          <a
            key={l}
            href={go(l)}
            hrefLang={localeMeta[l].htmlLang}
            lang={localeMeta[l].htmlLang}
            aria-current={l === locale ? "true" : undefined}
            onClick={() => rememberLocale(l)}
            className={cn(
              "flex min-h-[56px] items-center justify-center rounded-2xl px-4 font-display text-[1.1rem] font-extrabold tracking-[-0.02em] transition-colors",
              l === locale ? "bg-ink text-white" : "bg-card-warm text-ink shadow-[inset_0_0_0_1.5px_rgb(5_42_34/.14)]",
            )}
          >
            {localeMeta[l].label}
          </a>
        ))}
      </div>
    );
  }
  return (
    <div role="group" aria-label={t.language} className="flex h-11 items-center rounded-full bg-paper-2 p-1 shadow-[inset_0_0_0_1px_rgb(5_42_34/.08)]">
      {(["it", "lmo"] as Locale[]).map((l) => (
        <a
          key={l}
          href={go(l)}
          hrefLang={localeMeta[l].htmlLang}
          lang={localeMeta[l].htmlLang}
          title={localeMeta[l].label}
          aria-label={localeMeta[l].label}
          aria-current={l === locale ? "true" : undefined}
          onClick={() => rememberLocale(l)}
          className={cn(
            "flex h-9 min-w-11 items-center justify-center rounded-full px-3 text-[13px] font-bold tracking-wide transition-colors",
            l === locale ? "bg-card text-ink shadow-[inset_0_-2px_0_rgb(0_0_0/.08),0_1px_2px_rgb(5_42_34/.12)]" : "text-ink/60 hover:text-ink",
          )}
        >
          {localeMeta[l].short}
        </a>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- Top bar */
function TopBar({
  t,
  locale,
  pathname,
  items,
  hidden,
  solid,
  onMenu,
  menuOpen,
}: {
  t: NavLabels;
  locale: Locale;
  pathname: string;
  items: ReturnType<typeof buildItems>;
  hidden: boolean;
  solid: boolean;
  onMenu: () => void;
  menuOpen: boolean;
}) {
  return (
    <header
      data-topbar
      data-hidden={hidden}
      data-solid={solid}
      className={cn(
        "topbar sticky top-0 z-40 transition-[opacity,transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(.22,1,.36,1)] lg:h-[calc(76px+var(--safe-t))] lg:bg-paper/84 lg:backdrop-blur-[12px] lg:shadow-[0_1px_0_var(--color-hairline)]",
        "data-[hidden=true]:pointer-events-none data-[hidden=true]:-translate-y-3 data-[hidden=true]:opacity-0 motion-reduce:data-[hidden=true]:translate-y-0",
        solid && "bg-paper/92 shadow-[0_1px_0_var(--color-hairline),0_14px_32px_-28px_rgb(5_42_34/.45)] backdrop-blur-[14px]",
      )}
    >
      <div className="container-x flex h-full items-center gap-2 lg:gap-2.5 xl:gap-3 2xl:gap-5">
        <Logo locale={locale} t={t} />
        <nav aria-label={t.navMain} className="hidden min-w-0 flex-1 justify-center lg:flex">
          <ul className="flex min-w-0 items-center gap-2 lg:gap-2 xl:gap-3 2xl:gap-6">
            {items.main.map((it) => {
              const active = isActive(pathname, it.href);
              return (
                <li key={it.key}>
                  <Link
                    href={lhref(locale, it.href)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-11 items-center whitespace-nowrap text-[12px] font-medium transition-colors xl:text-[13px] 2xl:text-[16px]",
                      active ? "font-semibold text-orange-text" : "font-medium text-ink/92 hover:text-ink",
                      "after:absolute after:inset-x-0 after:bottom-[3px] after:h-[2px] after:origin-left after:rounded-full after:bg-orange after:transition-transform after:duration-300",
                      active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
                    )}
                  >
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2.5 lg:ml-0">
          <div className="hidden md:block">
            <LangSwitch locale={locale} pathname={pathname} t={t} />
          </div>
          <Link
            href={lhref(locale, items.contact.href)}
            className="btn btn--outline btn--sm hidden md:inline-flex lg:hidden xl:inline-flex"
            aria-current={isActive(pathname, items.contact.href) ? "page" : undefined}
          >
            {t.contattaci}
          </Link>
          <Link href={lhref(locale, items.join.href)} className="btn btn--primary btn--sm hidden md:inline-flex" aria-current={isActive(pathname, items.join.href) ? "page" : undefined}>
            {t.diventaSocio}
            <ArrowRight aria-hidden strokeWidth={2.2} />
          </Link>
          <button
            type="button"
            onClick={onMenu}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className="btn btn--light btn--sm gap-2 !px-4 md:hidden"
          >
            <MenuIcon aria-hidden strokeWidth={2.1} />
            {t.menu}
          </button>
        </div>
      </div>
      {/* Tablets in portrait retain all seven destinations in a second row when they cannot
          fit legibly on one line. Landscape tablets use the same one-row navigation as desktop. */}
      <nav aria-label={t.navMain} className="hidden md:flex lg:hidden min-h-[48px] w-full items-center justify-center border-t border-ink/10 px-4">
        <ul className="mx-auto flex w-full max-w-[1110px] items-center justify-between gap-2">
          {items.main.map((it) => {
            const active = isActive(pathname, it.href);
            return (
              <li key={it.key} className="min-w-0">
                <Link href={lhref(locale, it.href)} aria-current={active ? "page" : undefined}
                  className={cn("relative flex h-11 items-center justify-center whitespace-nowrap px-1 font-medium text-[clamp(11px,1.18vw,15px)] text-ink transition-colors hover:text-orange-text", active && "!font-bold !text-orange-text after:absolute after:bottom-1 after:inset-x-1 after:h-0.5 after:rounded-full after:bg-orange")}>
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

/* ---------------------------------------------------------------- Desktop dock (magnification ≤ 1.25×) */
const BASE = 44;
const MAG = 55;
const DIST = 130;
const SPRING = { mass: 0.12, stiffness: 190, damping: 22 };

function DesktopDock({ t, locale, pathname, items, visible }: { t: NavLabels; locale: Locale; pathname: string; items: ReturnType<typeof buildItems>; visible: boolean }) {
  const mouseX = useMotionValue(Infinity);
  const [canHover, setCanHover] = useState(false);
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setCanHover(matchMedia("(hover: hover) and (pointer: fine)").matches);
    setReduce(matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  const list = [items.home, ...items.main];
  return (
    <AnimatePresence>
      {visible ? (
        <motion.nav
          key="ddock"
          data-dock
          data-visible="true"
          aria-label={t.navQuick}
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : 20 }}
          transition={{ duration: 0.28, ease: EASE_OUT_SOFT }}
          className="pointer-events-none fixed inset-x-0 bottom-[calc(28px+var(--safe-b))] z-50 hidden justify-center 2xl:flex"
        >
          <div
            onMouseMove={(e) => canHover && !reduce && mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="pointer-events-auto flex h-[68px] items-center justify-center gap-1.5 rounded-full bg-dock px-3 py-2 shadow-[0_0_0_1px_var(--color-hairline),var(--shadow-lift)]"
          >
            {list.map((it) => (
              <DockItem key={it.key} item={it} locale={locale} active={isActive(pathname, it.href)} mouseX={mouseX} />
            ))}
            <span aria-hidden className="mx-1 mb-2.5 h-6 w-px self-end bg-ink/15" />
            <DockItem item={items.contact} locale={locale} active={isActive(pathname, items.contact.href)} mouseX={mouseX} />
            <DockSlot mouseX={mouseX} label={localeMeta[locale === "it" ? "lmo" : "it"].label}>
              <LangSwitch locale={locale} pathname={pathname} t={t} variant="round" />
            </DockSlot>
            <Link
              href={lhref(locale, items.join.href)}
              aria-current={isActive(pathname, items.join.href) ? "page" : undefined}
              className="btn btn--primary btn--sm ml-1 !inline-flex !h-11 shrink-0 items-center justify-center whitespace-nowrap !px-5 !py-0 !leading-none"
            >
              {t.diventaSocio}
              <ArrowRight aria-hidden strokeWidth={2.2} />
            </Link>
          </div>
        </motion.nav>
      ) : null}
    </AnimatePresence>
  );
}

function useMagnify(mouseX: MotionValue<number>) {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r || !Number.isFinite(x)) return Infinity;
    return x - r.left - r.width / 2;
  });
  const target = useTransform(distance, [-DIST, 0, DIST], [BASE, MAG, BASE]);
  const size = useSpring(target, SPRING);
  return { ref, size };
}

function Tooltip({ show, label }: { show: boolean; label: string }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.span
          role="tooltip"
          initial={{ opacity: 0, y: 2, x: "-50%" }}
          animate={{ opacity: 1, y: -6, x: "-50%", transition: { delay: 0.15, duration: 0.16 } }}
          exit={{ opacity: 0, y: 2, x: "-50%", transition: { duration: 0.1 } }}
          className="pointer-events-none absolute -top-9 left-1/2 whitespace-nowrap rounded-[8px] bg-ink px-2.5 py-1 text-[12px] font-semibold text-white"
        >
          {label}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

function DockSlot({ mouseX, label, children }: { mouseX: MotionValue<number>; label: string; children: ReactNode }) {
  const { ref, size } = useMagnify(mouseX);
  const [tip, setTip] = useState(false);
  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      className="relative shrink-0"
      onMouseEnter={() => setTip(true)}
      onMouseLeave={() => setTip(false)}
      onFocus={() => setTip(true)}
      onBlur={() => setTip(false)}
    >
      {children}
      <Tooltip show={tip} label={label} />
    </motion.div>
  );
}

function DockItem({ item, locale, active, mouseX }: { item: Item; locale: Locale; active: boolean; mouseX: MotionValue<number> }) {
  const { ref, size } = useMagnify(mouseX);
  const icon = useTransform(size, (s) => Math.round(s * 0.45));
  const [tip, setTip] = useState(false);
  const Icon = item.icon === "mark" ? null : item.icon;
  return (
    <motion.div ref={ref} style={{ width: size, height: size }} className="relative shrink-0">
      <Link
        href={lhref(locale, item.href)}
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        onMouseEnter={() => setTip(true)}
        onMouseLeave={() => setTip(false)}
        onFocus={() => setTip(true)}
        onBlur={() => setTip(false)}
        className={cn(
          "flex size-full items-center justify-center rounded-full transition-colors duration-150",
          active ? "bg-ink text-white" : "bg-dock-item text-ink/80 hover:bg-dock-item-hover hover:text-ink",
        )}
      >
        <motion.span style={{ width: icon, height: icon }} className="block">
          {Icon ? <Icon className="size-full" strokeWidth={1.9} aria-hidden /> : <SunMark className="size-full" />}
        </motion.span>
      </Link>
      <Tooltip show={tip} label={item.label} />
    </motion.div>
  );
}

/* ---------------------------------------------------------------- Mobile dock: Home · Le CER · Ardaké · Socio · Altro */
function MobileDock({
  t,
  locale,
  pathname,
  items,
  visible,
  onMore,
  moreOpen,
}: {
  t: NavLabels;
  locale: Locale;
  pathname: string;
  items: ReturnType<typeof buildItems>;
  visible: boolean;
  onMore: () => void;
  moreOpen: boolean;
}) {
  const cer = items.main.find((i) => i.key === "le-cer")!;
  const ark = items.main.find((i) => i.key === "ardake")!;
  const list = [items.home, cer, ark];
  return (
    <AnimatePresence>
      {visible ? (
        <motion.nav
          key="mdock"
          data-dock
          data-visible="true"
          aria-label={t.navQuick}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.26, ease: EASE_OUT_SOFT }}
          className="dock-mobile md:hidden"
        >
          <div className="mx-auto flex h-full max-w-[480px] items-center justify-between gap-1 rounded-full bg-dock px-2 shadow-[0_0_0_1px_var(--color-hairline),var(--shadow-lift)]">
            {list.map((it) => {
              const active = isActive(pathname, it.href);
              const Icon = it.icon === "mark" ? null : it.icon;
              return (
                <span key={it.key} className="relative">
                  <Link
                    href={lhref(locale, it.href)}
                    aria-label={it.label}
                    aria-current={active ? "page" : undefined}
                    className={cn("tap-48 flex size-12 items-center justify-center rounded-full", active ? "bg-ink text-white" : "bg-dock-item text-ink/80 active:bg-dock-item-hover")}
                  >
                    {Icon ? <Icon className="size-[22px]" strokeWidth={1.9} aria-hidden /> : <SunMark className="size-[24px]" />}
                  </Link>
                </span>
              );
            })}
            <Link
              href={lhref(locale, items.join.href)}
              aria-current={isActive(pathname, items.join.href) ? "page" : undefined}
              className="btn btn--primary h-12 gap-1.5 px-4 text-[15px] max-[359px]:px-3"
            >
              {t.socio}
              <ArrowRight aria-hidden strokeWidth={2.2} className="max-[359px]:hidden" />
            </Link>
            <button
              type="button"
              data-dock-more
              onClick={onMore}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              aria-label={t.altro}
              className="tap-48 flex size-12 items-center justify-center rounded-full bg-dock-item text-ink/80 active:bg-dock-item-hover"
            >
              <MenuIcon className="size-[22px]" strokeWidth={1.9} aria-hidden />
            </button>
          </div>
        </motion.nav>
      ) : null}
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------------- Menu sheet (dialog, focus trap, Esc, scroll lock) */
function MenuSheet({ t, locale, pathname, items, open, onClose }: { t: NavLabels; locale: Locale; pathname: string; items: ReturnType<typeof buildItems>; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const lastPath = useRef(pathname);

  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // true modal: everything behind the sheet leaves the accessibility tree and stops taking focus
    const behind = [...document.querySelectorAll<HTMLElement>("#contenuto, body > footer, [data-topbar], .skip-link")];
    behind.forEach((el) => {
      el.setAttribute("aria-hidden", "true");
      el.inert = true;
    });
    const id = requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const f = [...ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (!ref.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = prev;
      behind.forEach((el) => {
        el.removeAttribute("aria-hidden");
        el.inert = false;
      });
      window.removeEventListener("keydown", onKey);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  const links = [items.home, ...items.main];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="sheet"
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={t.menu}
          data-menu-sheet
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.26, ease: EASE_OUT_SOFT }}
          className="h-sheet fixed inset-0 z-[60] flex flex-col overflow-hidden bg-paper pb-[var(--safe-b)] pt-[var(--safe-t)]"
        >
          <CornerSunrise className="pointer-events-none absolute -bottom-10 -right-14 w-[min(62vw,380px)] opacity-90" />
          <div className="container-x flex h-[var(--topbar-h)] shrink-0 items-center justify-between">
            <Logo locale={locale} t={t} onClick={onClose} />
            <button ref={closeRef} type="button" onClick={onClose} className="paper-round" aria-label={t.chiudi}>
              <X aria-hidden strokeWidth={2.2} />
            </button>
          </div>
          <nav aria-label={t.navFull} className="container-x relative flex-1 overflow-y-auto overscroll-contain pb-10">
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {links.map((it, i) => {
                const active = isActive(pathname, it.href);
                return (
                  <motion.li key={it.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 + Math.min(i, 3) * 0.04, duration: 0.3 }}>
                    <Link
                      href={lhref(locale, it.href)}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-[56px] items-center justify-between py-2 font-display text-[clamp(1.6rem,1.2rem+2vw,2.1rem)] font-extrabold tracking-[-0.035em]",
                        active ? "text-orange-text" : "text-ink",
                      )}
                    >
                      {it.label}
                      <ArrowRight className="size-6 text-ink/30" aria-hidden />
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <div className="mt-8 grid gap-3">
              <Link href={lhref(locale, items.join.href)} onClick={onClose} className="btn btn--primary btn--lg btn--block">
                {t.diventaSocio}
                <ArrowRight aria-hidden strokeWidth={2.2} />
              </Link>
              <Link href={lhref(locale, items.contact.href)} onClick={onClose} className="btn btn--outline btn--md btn--block">
                {t.contattaci}
              </Link>
            </div>
            <div className="mt-8">
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-slate">{t.language}</p>
              <LangSwitch locale={locale} pathname={pathname} t={t} variant="large" />
            </div>
            <div className="relative mt-8 grid max-w-[60%] gap-2 text-[15px] text-slate">
              <p className="text-[13px] font-semibold uppercase tracking-[0.12em]">{t.sheetContacts}</p>
              <p>
                {site.address.street}, {site.address.postalCode} {site.address.city} ({site.address.province})
              </p>
              <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-leaf decoration-2 underline-offset-4">
                {site.email}
              </a>
              <div className="mt-1 flex gap-3">
                <a href={social.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={social.instagram.label} className="paper-round">
                  <InstagramIcon className="size-5" />
                </a>
                <a href={social.linkedin.url} target="_blank" rel="noopener noreferrer" aria-label={social.linkedin.label} className="paper-round">
                  <LinkedinIcon className="size-[18px]" />
                </a>
                <a href={social.facebook.url} target="_blank" rel="noopener noreferrer" aria-label={social.facebook.label} className="paper-round">
                  <FacebookIcon className="size-[18px]" />
                </a>
              </div>
            </div>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

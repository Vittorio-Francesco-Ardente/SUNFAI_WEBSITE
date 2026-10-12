import { Eyebrow, Headline } from "@/components/ui/primitives";
import { CanvasPanel, Confetto, HalfDisc, PanelMascot, Ripple } from "@/components/canvas/Canvas";
import { CountUp } from "@/components/ui/CountUp";
import { LiveEnergy } from "./LiveEnergy";
import type { Dict } from "@/content/dict";

const ON_SOLAR_FAN = ["#FFFFFF", "#F26A1B", "#FFF1C2", "#4B8B2F", "#FFFFFF", "#FE9845", "#FFF1C2", "#4B8B2F"];
const NUM = "font-display font-extrabold leading-none tracking-[-0.05em]";

/**
 * Numbers, V3 (mockup 02 / 16.8 Home): the page's SOLAR statement panel. Ink "soci" card + white stat cards,
 * the cheering mascot standing in front of an onSolar fan ripple on the right edge. The 20-year incentive is a
 * line under the grid. No photo here (the V2 rectangle crop is gone).
 */
export function Numbers({ d, ui, mascotAlt }: { d: Dict["home"]["numbers"]; ui: Dict["common"]["ui"]; mascotAlt: string }) {
  const it = d.items;
  const white = [
    { v: Number(it.cer.value), unit: "", label: it.cer.label, mark: "#4B8B2F", quarter: true },
    { v: Number(it.kwp.value), unit: it.kwp.unit, label: it.kwp.label, mark: "#F5C335" },
    { v: Number(it.comuni.value), unit: "", label: it.comuni.label, mark: "#F26A1B", quarter: true },
  ];
  return (
    <CanvasPanel
      tone="solar"
      data-section="numbers"
      phoneUnit={1.4}
      bg={
        <>
          <Ripple at={{ x: 1, y: 0.95 }} atSm={{ x: 1, y: 1 }} family="onSolar" core={0.035} widths={[0.08, 0.07, 0.08, 0.09]} fan={{ count: 8, from: 95, to: 178, colors: ON_SOLAR_FAN, bandColor: "#FFE08A" }} />
          <Ripple at={{ x: 0, y: 0 }} family="leaf" core={0.035} widths={[0.03, 0.03]} bands={2} />
          <Ripple at={{ x: 1, y: 0 }} hideSm family="onSolar" core={0.02} widths={[0.012]} bands={1} seg={{ r0: 0.08, r1: 0.12, from: 182, to: 268, count: 8, colors: ["#FFFFFF", "#F26A1B", "#FFF1C2", "#4B8B2F"] }} noCore />
          <HalfDisc at={{ x: 0.55, y: 1 }} r={0.04} edge="bottom" fill="#FFFFFF" hideSm />
          <Confetto at={{ x: 0.89, y: 0.25 }} r={0.0135} fill="#4B8B2F" ring hideSm />
          <HalfDisc at={{ x: 1, y: 0.3 }} r={0.022} edge="right" fill="#FFFFFF" hideSm />
        </>
      }
    >
      <div className="container-x relative z-[2] py-[clamp(48px,6vw,84px)] max-lg:pb-[clamp(240px,62cqw,320px)]">
        <div className="lg:w-[66%]">
          <Eyebrow>{d.eyebrow}</Eyebrow>
          <Headline text={d.title} className="mt-4" />
          <p className="t-lead mt-4 max-w-[36rem] !text-ink/80">{d.lead}</p>
          <dl className="reveal-stagger mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-[minmax(0,.8fr)_minmax(0,1fr)_minmax(0,1fr)] md:grid-rows-2">
            <div className="col-span-2 flex flex-col justify-between rounded-[24px] bg-ink p-6 text-white md:col-span-1 md:row-span-2 md:p-7">
              <dt className="sr-only">{it.soci.label}</dt>
              <dd className={`${NUM} text-[clamp(3.6rem,2.4rem+4vw,6.4rem)] text-[#FF5A1F]`}>
                <CountUp value={Number(it.soci.value)} />
              </dd>
              <dd aria-hidden className="mt-6 text-[clamp(1.1rem,1rem+.4vw,1.45rem)] font-bold">
                {it.soci.label}
              </dd>
            </div>
            {white.map((s) => (
              <div key={s.label} className="rounded-[24px] bg-white p-5 shadow-[0_18px_30px_-24px_rgb(5_42_34/.45)] sm:p-6">
                <span aria-hidden className={s.quarter ? "block size-[18px] rounded-tl-full" : "block size-[18px] rounded-full"} style={{ background: s.mark }} />
                <dt className="sr-only">{s.label}</dt>
                <dd className={`${NUM} mt-3 text-[clamp(2.1rem,1.6rem+1.4vw,3rem)] text-ink`}>
                  <CountUp value={s.v} />
                  {s.unit ? <span className="ml-1 text-[0.45em] font-bold tracking-[-0.02em]">{s.unit}</span> : null}
                </dd>
                <dd aria-hidden className="mt-2 text-[14px] font-medium leading-snug text-slate sm:text-[15px]">
                  {s.label}
                </dd>
              </div>
            ))}
            <div className="rounded-[24px] bg-white p-5 shadow-[0_18px_30px_-24px_rgb(5_42_34/.45)] sm:p-6">
              <span aria-hidden className="block size-[18px] rounded-full bg-[#B9D68F]" />
              <dt className="sr-only">{it.energy.label}</dt>
              <dd className="mt-3">
                <LiveEnergy unit={it.energy.unit} liveLabel={ui.live} snapshotLabel={ui.snapshot} numberClass={`${NUM} text-[clamp(2.1rem,1.6rem+1.4vw,3rem)] text-ink`} />
              </dd>
              <dd aria-hidden className="mt-1 text-[14px] font-medium leading-snug text-slate sm:text-[15px]">
                {it.energy.label}
              </dd>
            </div>
          </dl>
          <p className="mt-5 inline-flex flex-wrap items-baseline gap-x-2 rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-white">
            <span className="font-display text-[1.25rem] font-extrabold text-[#FECF49]">
              {it.anni.value} {it.anni.unit}
            </span>
            {it.anni.label} · <span className="font-medium text-white/85">{it.anni.note}</span>
          </p>
        </div>
      </div>
      <PanelMascot src="/mascot/mascot-06-cheering.webp" alt={mascotAlt} className="bottom-[4%] right-[10%] w-[clamp(180px,24cqw,340px)] max-lg:right-[6%] max-lg:bottom-[14px]" />
    </CanvasPanel>
  );
}

"use client";

import { Card, CardBody } from "@heroui/react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

export const ORANGE = "#F15022";

/* ── sparkline ──────────────────────────────────────────────── */
export function Spark({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-[3px] h-[30px]">
      {data.map((d, i) => (
        <div
          key={i}
          className="w-1 rounded-sm"
          style={{
            height: `${Math.max(16, (d / max) * 100)}%`,
            background: color,
            opacity: i === data.length - 1 ? 1 : 0.28 + (i / data.length) * 0.45,
          }}
        />
      ))}
    </div>
  );
}

/* ── tone chip / badge ──────────────────────────────────────── */
export type Tone = "success" | "danger" | "warning" | "primary" | "secondary" | "neutral";
const TONE: Record<Tone, { fg: string; bg: string }> = {
  success:   { fg: "#15803D", bg: "#E7F6EC" },
  danger:    { fg: "#C2410C", bg: "#FDECE4" },
  warning:   { fg: "#B45309", bg: "#FEF3E2" },
  primary:   { fg: "#0369A1", bg: "#E8F4FF" },
  secondary: { fg: "#7C3AED", bg: "#F3ECFF" },
  neutral:   { fg: "#6B5F55", bg: "#F4EFEB" },
};

export function Badge({
  children, tone = "neutral", dot, color,
}: { children: React.ReactNode; tone?: Tone; dot?: boolean; color?: string }) {
  const t = TONE[tone];
  return (
    <span
      className="inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full text-[11.5px] font-bold whitespace-nowrap"
      style={{ background: color ? `${color}14` : t.bg, color: color || t.fg }}
    >
      {dot && <span className="w-[6px] h-[6px] rounded-full" style={{ background: color || t.fg }} />}
      {children}
    </span>
  );
}

export function GroupChip({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-[5px] px-[9px] py-[2px] rounded-full text-[11.5px] font-semibold whitespace-nowrap"
      style={{ background: `${color}14`, color }}
    >
      <span className="w-[5px] h-[5px] rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

export function Avatar({ initials, color = "#9A8C80", size = 40 }: { initials: string; color?: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center font-extrabold flex-shrink-0 tracking-[-0.01em]"
      style={{
        width: size, height: size, borderRadius: Math.round(size * 0.28),
        background: `${color}14`, border: `1px solid ${color}2E`,
        fontSize: Math.round(size * 0.34), color,
      }}
    >
      {initials}
    </div>
  );
}

/* ── KPI card ───────────────────────────────────────────────── */
export type KpiTone = "green" | "orange" | "blue" | "purple" | "amber" | "red";

const TONE_STYLES: Record<KpiTone, { fg: string; bg: string }> = {
  green:  { fg: "#15803D", bg: "#E7F6EC" },
  orange: { fg: "#C2410C", bg: "#FDECE4" },
  blue:   { fg: "#0369A1", bg: "#E0F2FE" },
  purple: { fg: "#6D28D9", bg: "#EDE9FE" },
  amber:  { fg: "#B45309", bg: "#FEF3C7" },
  red:    { fg: "#B91C1C", bg: "#FEE2E2" },
};

export interface KpiData {
  key: string;
  icon: LucideIcon;
  tint: string;
  accent: string;
  label: string;
  value: string | number;
  sub?: string;
  delta?: string;
  deltaUp?: boolean;
  /** Pill color tone — overrides deltaUp's green/orange. No trend arrow when set. */
  deltaTone?: KpiTone;
  sparkData: number[];
}

export function KpiCard({ kpi }: { kpi: KpiData }) {
  const Icon = kpi.icon;
  return (
    <Card shadow="none" radius="lg" className="flex-1 min-w-0 border border-[#EEEAE6] bg-white rounded-2xl"
      style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
      <CardBody className="p-[16px] px-[18px] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[9px]">
            <div className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center" style={{ background: kpi.tint }}>
              <Icon size={16} color={kpi.accent} strokeWidth={2} />
            </div>
            <span className="text-[12.5px] font-semibold text-[#8A8079]">{kpi.label}</span>
          </div>
          {kpi.delta && (() => {
            const tone = kpi.deltaTone ?? (kpi.deltaUp ? "green" : "orange");
            const { fg, bg } = TONE_STYLES[tone];
            const showArrow = !kpi.deltaTone && kpi.deltaUp !== undefined;
            return (
              <span className="inline-flex items-center gap-[3px] px-[8px] py-[2px] rounded-full text-[11.5px] font-bold whitespace-nowrap"
                style={{ color: fg, background: bg }}>
                {showArrow && (kpi.deltaUp
                  ? <TrendingUp size={12} color={fg} />
                  : <TrendingDown size={12} color={fg} />)}
                {kpi.delta}
              </span>
            );
          })()}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-[5px] min-w-0 flex-1">
            <span className="text-[26px] font-bold text-ink tracking-[-0.02em] tnum truncate min-w-0" title={String(kpi.value)}>{kpi.value}</span>
            {kpi.sub && <span className="text-[13px] font-medium text-warm-500 whitespace-nowrap">{kpi.sub}</span>}
          </div>
          <Spark data={kpi.sparkData} color={kpi.accent} />
        </div>
      </CardBody>
    </Card>
  );
}

/* KPI row: flex on desktop, horizontal snap carousel on mobile */
export function KpiRow({ kpis }: { kpis: KpiData[] }) {
  return (
    <>
      <div className="hidden lg:flex gap-[14px]">
        {kpis.map((k) => <KpiCard key={k.key} kpi={k} />)}
      </div>
      <div className="flex lg:hidden gap-3 overflow-x-auto pb-[6px] no-sb snap-x snap-mandatory -mx-4 px-4">
        {kpis.map((k) => (
          <div key={k.key} className="w-[220px] flex-shrink-0 snap-start flex"><KpiCard kpi={k} /></div>
        ))}
      </div>
    </>
  );
}

/* ── page header ────────────────────────────────────────────── */
export function PageHeader({
  title, subtitle, actions,
}: { title: string; subtitle?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[24px] font-extrabold tracking-[-0.025em] m-0">{title}</h1>
        {subtitle && <p className="mt-[5px] text-[13.5px] text-warm-500 font-medium">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-[9px] flex-shrink-0">{actions}</div>}
    </div>
  );
}

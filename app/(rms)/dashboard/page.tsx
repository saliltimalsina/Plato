"use client";

import { useState } from "react";
import { Button, Tabs, Tab, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import {
  PieChart, ShoppingCart, TrendingUp, Wallet, ChevronDown, Calendar, ChevronRight,
  Bell, CalendarCheck, Bike, ShoppingBag, UsersRound, ArrowDownLeft, ArrowUpRight,
  ArrowLeftRight, Plus, Printer, UtensilsCrossed, ClipboardList, Receipt, Armchair, BookOpen,
} from "lucide-react";
import { Spark, ORANGE, KpiRow, KpiData } from "@/components/rms/primitives";

/* ── sample data ──────────────────────────────────────────────── */
const SALES = 24580, PURCHASE = 8200, INCOME = 16380, EXPENSES = 3150, PAY_IN = 21300, PAY_OUT = 9800;
const PAID = 20100, UNPAID = 4480;
const ORDERS_TOTAL = 48, KOT_TAKEN = 53, AVG_ORDER = 512;

const HOURLY = [2, 3, 5, 4, 6, 9, 12, 8, 11, 14, 18, 13, 16, 10, 7, 9, 12, 15, 19, 22, 17, 12, 8, 5];
const SP1 = [3, 5, 4, 6, 8, 7, 9, 11], SP2 = [6, 4, 7, 5, 8, 6, 9, 7], SP3 = [2, 4, 3, 6, 5, 8, 7, 10];

const SALES_BREAKDOWN = [
  { icon: Bell, tint: "#E0F2FE", accent: "#0369A1", label: "Dine In Service", value: 15200 },
  { icon: CalendarCheck, tint: "#EDE9FE", accent: "#6D28D9", label: "Reservation Services", value: 2400 },
  { icon: Bike, tint: "#E3F6F1", accent: "#1FA98B", label: "Delivery Services", value: 5180 },
  { icon: ShoppingBag, tint: "#FDECE4", accent: ORANGE, label: "Takeaway Services", value: 1800 },
];

const STAFF = [
  { name: "Salil Timalsina", orders: 24, amount: 18400 },
  { name: "Bibek Gurung", orders: 9, amount: 6180 },
];
const CUSTOMERS = [
  { name: "Sita Rai", orders: 11, amount: 4200 },
  { name: "Anish Shrestha", orders: 7, amount: 3100 },
  { name: "Ramesh Karki", orders: 5, amount: 2400 },
];
const PLATFORMS = [
  { name: "FoodMandu", orders: 12, amount: 3200, color: "#F4C400", abbr: "FM" },
  { name: "Pathao Food", orders: 7, amount: 1980, color: "#E11D2A", abbr: "PF" },
  { name: "Website", orders: 3, amount: 540, color: "#E11D2A", abbr: "RX" },
];
const TOP_DISHES = [
  { emoji: "🍕", name: "Chicken Pizza", sold: 42 },
  { emoji: "🍔", name: "Burger", sold: 31 },
  { emoji: "☕", name: "Coffee", sold: 28 },
  { emoji: "🥤", name: "Coke", sold: 24 },
  { emoji: "🧋", name: "Iced Latte", sold: 19 },
];
const TOP_ADDONS = [
  { emoji: "🧀", name: "Extra Cheese", sold: 18 },
  { emoji: "🥩", name: "Extra Patty", sold: 12 },
  { emoji: "🍟", name: "Fries", sold: 9 },
];
const TOP_CATEGORIES = [
  { emoji: "🍱", name: "Lunch", sold: 64 },
  { emoji: "🥤", name: "Beverages", sold: 51 },
  { emoji: "🍿", name: "Snacks", sold: 22 },
];
const TXNS = [
  { entry: "06-22-2026", txnDate: "06-22-2026", no: "TXN-1042", particular: "Dine In - Cabin 1", type: "Sales", party: "Walk-in", mode: "Cash", amount: 685, status: "Paid", by: "Salil Timalsina" },
  { entry: "06-22-2026", txnDate: "06-22-2026", no: "TXN-1041", particular: "Delivery - FoodMandu", type: "Sales", party: "Sita Rai", mode: "eSewa", amount: 520, status: "Paid", by: "Bibek Gurung" },
  { entry: "06-21-2026", txnDate: "06-21-2026", no: "TXN-1040", particular: "Vegetable purchase", type: "Purchase", party: "Fresh Mart", mode: "Bank", amount: 1800, status: "Paid", by: "Salil Timalsina" },
  { entry: "06-21-2026", txnDate: "06-21-2026", no: "TXN-1039", particular: "Takeaway - Counter", type: "Sales", party: "Walk-in", mode: "Khalti", amount: 240, status: "Paid", by: "Salil Timalsina" },
];

/* finance tab */
const PAYMENTS = [
  { name: "Sita Rai", note: "Dine In · Cabin 1", dir: "in" as const, amount: 685, mode: "Cash" },
  { name: "FoodMandu", note: "Delivery settlement", dir: "in" as const, amount: 520, mode: "eSewa" },
  { name: "Fresh Mart", note: "Vegetable purchase", dir: "out" as const, amount: 1800, mode: "Bank" },
  { name: "Walk-in", note: "Takeaway - Counter", dir: "in" as const, amount: 240, mode: "Khalti" },
];
const PAY_METHODS = [
  { name: "Cash", share: 52, amount: 12800, color: "#15803D" },
  { name: "eSewa", share: 24, amount: 5900, color: "#0EA5E9" },
  { name: "Khalti", share: 14, amount: 3400, color: "#6D28D9" },
  { name: "Bank Transfer", share: 10, amount: 2480, color: "#F59E0B" },
];

/* order tab */
const DINE_SERIES = [0, 0, 1, 0, 2, 1, 3, 2, 4, 3, 2, 1, 3, 2, 4, 3, 2, 4, 3, 2, 1, 1, 0, 0];
const DELIVERY_SERIES = [0, 0, 0, 1, 0, 1, 1, 2, 1, 2, 1, 0, 1, 2, 1, 2, 1, 1, 2, 1, 0, 0, 0, 0];
const KOT_SERIES = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 3, 2, 3, 3, 4, 4, 3, 4, 4, 3, 2, 1, 1, 0];
const LIVE_STATUS = [
  { label: "Completed Order", value: 38, color: "#22C55E" },
  { label: "Pending Order", value: 9, color: "#F59E0B" },
  { label: "Cancelled Order", value: 1, color: "#EF4444" },
];
const CHECKOUT = [
  { label: "Dish Discount", value: 420, color: "#2563EB" },
  { label: "General Discount", value: 260, color: "#7C3AED" },
  { label: "Loyalty Discount", value: 180, color: "#0EA5E9" },
  { label: "Service Charge", value: 350, color: "#93C5FD" },
];
const ORDER_SERVICES = [
  { name: "Dine In", orders: 31, amount: 15200, color: "#0369A1", icon: UtensilsCrossed },
  { name: "Delivery", orders: 12, amount: 5180, color: "#1FA98B", icon: Bike },
  { name: "Takeaway", orders: 5, amount: 1800, color: ORANGE, icon: ShoppingBag },
];
const TOP_TABLES = [
  { name: "Cabin 1", sold: 14, amount: 9600 },
  { name: "Table 2", sold: 11, amount: 6480 },
  { name: "Booth B", sold: 7, amount: 4100 },
];
const TOP_SUBMENUS = [
  { emoji: "🍕", name: "Pizzas", sold: 38 },
  { emoji: "🥤", name: "Cold Drinks", sold: 29 },
  { emoji: "☕", name: "Hot Beverages", sold: 17 },
];

function rs(n: number) { return `Rs ${n.toLocaleString()}`; }

/* ── KPI sets (reuse shared KpiRow primitive) ────────────────── */
const FINANCE_KPIS: KpiData[] = [
  { key: "sales", icon: PieChart, tint: "#E0F2FE", accent: "#0369A1", label: "Sales", value: rs(SALES), delta: "12.4%", deltaUp: true, sparkData: HOURLY },
  { key: "purchase", icon: ShoppingCart, tint: "#FEF3E2", accent: "#F59E0B", label: "Purchase", value: rs(PURCHASE), delta: "3.1%", deltaUp: true, sparkData: SP1 },
  { key: "income", icon: TrendingUp, tint: "#E7F6EC", accent: "#15803D", label: "Income", value: rs(INCOME), delta: "9.8%", deltaUp: true, sparkData: SP2 },
  { key: "expenses", icon: Wallet, tint: "#FDECE4", accent: ORANGE, label: "Expenses", value: rs(EXPENSES), delta: "2.2%", deltaUp: false, sparkData: SP3 },
  { key: "payin", icon: ArrowDownLeft, tint: "#E3F6F1", accent: "#1FA98B", label: "Payment In", value: rs(PAY_IN), delta: "7.5%", deltaUp: true, sparkData: SP1 },
  { key: "payout", icon: ArrowUpRight, tint: "#EDE9FE", accent: "#6D28D9", label: "Payment Out", value: rs(PAY_OUT), delta: "1.4%", deltaUp: false, sparkData: SP2 },
];
const OVERVIEW_KPIS: KpiData[] = FINANCE_KPIS.slice(0, 4);
const ORDER_KPIS: KpiData[] = [
  { key: "sales", icon: PieChart, tint: "#E7F6EC", accent: "#15803D", label: "Sales", value: rs(SALES), delta: "12.4%", deltaUp: true, sparkData: HOURLY },
  { key: "served", icon: UtensilsCrossed, tint: "#FEF3E2", accent: "#F59E0B", label: "Order Served", value: ORDERS_TOTAL, delta: "6", deltaUp: true, sparkData: SP1 },
  { key: "kot", icon: ClipboardList, tint: "#E0F2FE", accent: "#0369A1", label: "KOT Taken", value: KOT_TAKEN, delta: "8", deltaUp: true, sparkData: SP2 },
  { key: "avg", icon: Receipt, tint: "#EDE9FE", accent: "#6D28D9", label: "Avg Order Amount", value: rs(AVG_ORDER), delta: "3.4%", deltaUp: true, sparkData: SP3 },
];

/* ── charts ───────────────────────────────────────────────────── */
function SalesChart({ data }: { data: number[] }) {
  const W = 720, H = 180, pad = 8;
  const max = Math.max(...data, 1);
  const stepX = (W - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => [pad + i * stepX, H - pad - (v / max) * (H - pad * 2)] as const);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${H - pad} L${pts[0][0].toFixed(1)} ${H - pad} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[180px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ORANGE} stopOpacity="0.22" />
          <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={pad} x2={W - pad} y1={pad + g * (H - pad * 2)} y2={pad + g * (H - pad * 2)} stroke="#EFEAE6" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#salesFill)" />
      <path d={line} fill="none" stroke={ORANGE} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function MultiLineChart({ series }: { series: { color: string; data: number[] }[] }) {
  const W = 720, H = 200, pad = 10;
  const max = Math.max(...series.flatMap((s) => s.data), 4);
  const len = series[0].data.length;
  const stepX = (W - pad * 2) / (len - 1);
  const y = (v: number) => H - pad - (v / max) * (H - pad * 2);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[200px]" preserveAspectRatio="none">
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={pad} x2={W - pad} y1={pad + g * (H - pad * 2)} y2={pad + g * (H - pad * 2)} stroke="#EFEAE6" strokeWidth="1" />
      ))}
      {series.map((s, si) => (
        <path key={si} fill="none" stroke={s.color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round"
          d={s.data.map((v, i) => `${i ? "L" : "M"}${(pad + i * stepX).toFixed(1)} ${y(v).toFixed(1)}`).join(" ")} />
      ))}
    </svg>
  );
}

/* semicircle gauge for Live Order Status */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)] as const;
}
function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}
function Gauge({ segments, label }: { segments: { value: number; color: string }[]; label: string }) {
  const cx = 110, cy = 112, r = 90, sw = 20;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let a = 180;
  return (
    <svg viewBox="0 0 220 130" className="w-full max-w-[260px] mx-auto">
      <path d={arc(cx, cy, r, 180, 0)} fill="none" stroke="#F1ECE7" strokeWidth={sw} strokeLinecap="round" />
      {segments.map((s, i) => {
        if (s.value <= 0) return null;
        const a1 = a - (s.value / total) * 180;
        const d = arc(cx, cy, r, a, a1);
        a = a1;
        return <path key={i} d={d} fill="none" stroke={s.color} strokeWidth={sw} />;
      })}
      <text x={cx} y={cy - 30} textAnchor="middle" style={{ fontSize: 28, fontWeight: 800, fill: "#11181C" }}>{total}</text>
      <text x={cx} y={cy - 10} textAnchor="middle" style={{ fontSize: 12, fill: "#9A8C80" }}>{label}</text>
    </svg>
  );
}

/* donut for Checkout Breakdown */
function Donut({ segments }: { segments: { value: number; color: string }[] }) {
  const cx = 70, cy = 70, r = 54, sw = 16, c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  return (
    <svg viewBox="0 0 140 140" className="w-[140px] h-[140px] flex-shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1ECE7" strokeWidth={sw} />
      {segments.map((s, i) => {
        const len = (s.value / total) * c;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={sw}
            strokeDasharray={`${len.toFixed(2)} ${(c - len).toFixed(2)}`} strokeDashoffset={(-offset).toFixed(2)}
            transform={`rotate(-90 ${cx} ${cy})`} />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}

/* ── shared card shells ──────────────────────────────────────── */
function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#EEEAE6] rounded-2xl p-5 ${className}`} style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
      {children}
    </div>
  );
}

function ViewAllBtn({ icon: Icon = ChevronRight }: { icon?: typeof ChevronRight }) {
  return <button className="inline-flex items-center gap-[2px] text-[12px] font-bold" style={{ color: ORANGE }}>View All <Icon size={13} color={ORANGE} /></button>;
}

function SummaryCard({ icon: Icon, tint, accent, title, subtitle, children, headerRight }: {
  icon: typeof UsersRound; tint: string; accent: string; title: string; subtitle: string; children: React.ReactNode; headerRight?: React.ReactNode;
}) {
  return (
    <Panel className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-[9px]">
          <span className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center" style={{ background: tint }}><Icon size={16} color={accent} /></span>
          <div><div className="text-[13.5px] font-extrabold text-ink leading-tight">{title}</div><div className="text-[11.5px] text-warm-500">{subtitle}</div></div>
        </div>
        {headerRight ?? <ViewAllBtn />}
      </div>
      {children}
    </Panel>
  );
}

function TxnTable() {
  return (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-warm-200">
        <span className="text-[15px] font-extrabold text-ink">Transaction History</span>
        <ViewAllBtn icon={ChevronDown} />
      </div>
      <div className="overflow-x-auto no-sb">
        <div className="min-w-[940px]">
          <div className="grid bg-cream border-b border-warm-200 px-4 py-[10px] text-[11px] font-bold text-warm-600 uppercase tracking-[0.04em]"
            style={{ gridTemplateColumns: "1fr 1fr 1fr 1.6fr 0.9fr 1fr 0.9fr 0.9fr 0.9fr 1.3fr" }}>
            <span>Entry Date</span><span>TXN Date</span><span>TXN No</span><span>Particular</span><span>TXN Type</span><span>Parties</span><span>PMT Mode</span><span className="text-right">Amount</span><span>Status</span><span>Entry By</span>
          </div>
          {TXNS.map((t) => (
            <div key={t.no} className="grid items-center px-4 py-3 border-t border-warm-200 text-[12.5px]"
              style={{ gridTemplateColumns: "1fr 1fr 1fr 1.6fr 0.9fr 1fr 0.9fr 0.9fr 0.9fr 1.3fr" }}>
              <span className="tnum text-warm-600">{t.entry}</span>
              <span className="tnum text-warm-600">{t.txnDate}</span>
              <span className="font-mono text-warm-700">{t.no}</span>
              <span className="text-ink truncate">{t.particular}</span>
              <span className="text-warm-600">{t.type}</span>
              <span className="text-warm-600">{t.party}</span>
              <span className="text-warm-600">{t.mode}</span>
              <span className="text-right font-bold text-ink tnum">{rs(t.amount)}</span>
              <span className="inline-flex"><span className="px-[8px] py-[2px] rounded-full text-[11px] font-bold bg-[#E7F6EC] text-[#15803D]">{t.status}</span></span>
              <span className="text-warm-600 truncate">{t.by}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Legend({ items }: { items: { label: string; color: string; value: React.ReactNode }[] }) {
  return (
    <div className="flex flex-col gap-[10px]">
      {items.map((it) => (
        <div key={it.label} className="flex items-center justify-between text-[13px]">
          <span className="inline-flex items-center gap-2 text-warm-700"><span className="w-[10px] h-[10px] rounded-[3px]" style={{ background: it.color }} />{it.label}</span>
          <span className="font-bold text-ink tnum">{it.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── page ─────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [tab, setTab] = useState<"overview" | "finance" | "order">("overview");

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Tabs size="sm" radius="md" selectedKey={tab} onSelectionChange={(k) => setTab(k as typeof tab)}
          classNames={{ tabList: "bg-[#F6EFE8]", cursor: "bg-white shadow-sm", tabContent: "font-bold text-[13px]" }}>
          <Tab key="overview" title="Overview" />
          <Tab key="finance" title="Finance" />
          <Tab key="order" title="Order" />
        </Tabs>
        <div className="flex items-center gap-[9px]">
          <Dropdown><DropdownTrigger>
            <Button size="sm" radius="md" variant="bordered" className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-700"
              startContent={<Calendar size={14} color="#6B5F55" />} endContent={<ChevronDown size={13} color="#8A7D72" />}>Today</Button>
          </DropdownTrigger><DropdownMenu aria-label="Range">{["Today", "This Week", "This Month"].map((r) => <DropdownItem key={r}>{r}</DropdownItem>)}</DropdownMenu></Dropdown>
          <Dropdown><DropdownTrigger>
            <Button size="sm" radius="md" variant="bordered" className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-700"
              endContent={<ChevronDown size={13} color="#8A7D72" />}>Daybook: All</Button>
          </DropdownTrigger><DropdownMenu aria-label="Daybook">{["All", "Cash", "Bank"].map((r) => <DropdownItem key={r}>{r}</DropdownItem>)}</DropdownMenu></Dropdown>
        </div>
      </div>

      {tab === "overview" && <OverviewTab />}
      {tab === "finance" && <FinanceTab />}
      {tab === "order" && <OrderTab />}
    </>
  );
}

/* ── Overview tab ─────────────────────────────────────────────── */
function OverviewTab() {
  const totalSales = SALES_BREAKDOWN.reduce((s, b) => s + b.value, 0);
  return (
    <>
      <KpiRow kpis={OVERVIEW_KPIS} />

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-[14px]">
        <div className="rounded-2xl p-5" style={{ background: "linear-gradient(150deg,#FFF1F0,#FFF8F6)", border: "1px solid #F8DAD2", boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
          <div className="text-[13px] font-semibold text-warm-500">Sales</div>
          <div className="flex items-end justify-between gap-2 mt-1">
            <div><div className="text-[26px] font-bold text-ink tracking-[-0.02em] tnum">{rs(totalSales)}</div>
              <div className="text-[12.5px] text-warm-500">Total Sales</div></div>
            <Spark data={HOURLY} color={ORANGE} />
          </div>
          <div className="mt-4 flex flex-col gap-1 border-t border-warm-200 pt-3">
            {SALES_BREAKDOWN.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="flex items-center justify-between py-[7px]">
                  <span className="flex items-center gap-[9px] text-[13px] text-warm-700">
                    <span className="w-[26px] h-[26px] rounded-[8px] flex items-center justify-center" style={{ background: b.tint }}><Icon size={14} color={b.accent} /></span>
                    {b.label}
                  </span>
                  <span className="text-[13px] font-bold text-ink tnum">{rs(b.value)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <Panel>
          <div className="text-[15px] font-extrabold text-ink">Sales Overview</div>
          <div className="text-[12.5px] text-warm-500 mb-3">Here is a live overview of your sales</div>
          <SalesChart data={HOURLY} />
          <div className="flex justify-between text-[10.5px] text-warm-400 mt-2"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span></div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px]">
        <SummaryCard icon={UsersRound} tint="#E0F2FE" accent="#0369A1" title="Sales By Staff" subtitle="Top Staffs">
          <div className="flex flex-col gap-2">
            {STAFF.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2"><span className="w-7 h-7 rounded-[8px] bg-[#E8E4FB] text-[#6D28D9] flex items-center justify-center text-[11px] font-bold">{s.name.split(" ").map((x) => x[0]).join("")}</span><span className="font-semibold text-ink">{s.name}</span></span>
                <span className="text-warm-700 tnum">{rs(s.amount)} <span className="text-warm-400">· {s.orders}</span></span>
              </div>
            ))}
          </div>
        </SummaryCard>
        <SummaryCard icon={UsersRound} tint="#EDE9FE" accent="#6D28D9" title="Top Customers" subtitle="Customers By Spend.">
          <div className="flex flex-col gap-2">
            {CUSTOMERS.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-[13px]">
                <span className="font-semibold text-ink">{c.name}</span>
                <span className="text-warm-700 tnum">{rs(c.amount)} <span className="text-warm-400">· {c.orders}</span></span>
              </div>
            ))}
          </div>
        </SummaryCard>
        <SummaryCard icon={Bike} tint="#FDECE4" accent={ORANGE} title="Delivery Platform" subtitle="Delivery Platform Summary">
          <div className="flex flex-col gap-2">
            {PLATFORMS.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2"><span className="w-7 h-7 rounded-[8px] flex items-center justify-center text-white text-[10px] font-extrabold" style={{ background: p.color }}>{p.abbr}</span><span className="font-semibold text-ink">{p.name}</span></span>
                <span className="text-warm-700 tnum">{rs(p.amount)} <span className="text-warm-400">· {p.orders}</span></span>
              </div>
            ))}
          </div>
        </SummaryCard>
      </div>

      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#D8420F,#F15022)" }}>
        <h2 className="text-[22px] font-extrabold text-white tracking-[-0.02em]">Do you know your best-selling dishes?</h2>
        <p className="text-[13px] text-white/85 mt-1">We have listed the top 5 best-selling dishes, top categories, and add-ons here.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px] mt-5">
          <BestCard title="Top Selling Dishes" subtitle="More people loved these dishes." rows={TOP_DISHES} unit="sold" />
          <BestCard title="Top Selling Add-Ons" subtitle="More people loved these add-ons." rows={TOP_ADDONS} unit="sold" />
          <BestCard title="Top Selling Category" subtitle="More people loved this category." rows={TOP_CATEGORIES} unit="sold" />
        </div>
      </div>

      <TxnTable />
    </>
  );
}

/* ── Finance tab ──────────────────────────────────────────────── */
function FinanceTab() {
  return (
    <>
      <KpiRow kpis={FINANCE_KPIS} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-[14px]">
        <Panel>
          <div className="text-[15px] font-extrabold text-ink">Sales Overview</div>
          <div className="text-[12.5px] text-warm-500 mb-3">Here is a live overview of your sales</div>
          <SalesChart data={HOURLY} />
          <div className="flex justify-between text-[10.5px] text-warm-400 mt-2"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span></div>
        </Panel>
        <Panel>
          <div className="text-[15px] font-extrabold text-ink">Sales Summary</div>
          <div className="text-[12.5px] text-warm-500">Real-time sales tracking.</div>
          <div className="text-center my-6">
            <div className="text-[12.5px] text-warm-500">Total Sales</div>
            <div className="text-[30px] font-bold text-ink tracking-[-0.02em] tnum mt-1">{rs(SALES)}</div>
          </div>
          <div className="border-t border-warm-200 pt-4">
            <Legend items={[
              { label: "Paid", color: "#0EA5E9", value: rs(PAID) },
              { label: "Unpaid Sales", color: "#EC4899", value: rs(UNPAID) },
            ]} />
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px]">
        <SummaryCard icon={ArrowLeftRight} tint="#E0F2FE" accent="#0369A1" title="Recent Payment In/Out" subtitle="Track your payment history">
          <div className="flex flex-col gap-2">
            {PAYMENTS.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-7 h-7 rounded-[8px] flex items-center justify-center" style={{ background: p.dir === "in" ? "#E7F6EC" : "#FDECE4" }}>
                    {p.dir === "in" ? <ArrowDownLeft size={14} color="#15803D" /> : <ArrowUpRight size={14} color={ORANGE} />}
                  </span>
                  <span className="min-w-0"><span className="block font-semibold text-ink truncate">{p.name}</span><span className="block text-[11.5px] text-warm-500 truncate">{p.note} · {p.mode}</span></span>
                </span>
                <span className="font-bold tnum" style={{ color: p.dir === "in" ? "#15803D" : ORANGE }}>{p.dir === "in" ? "+" : "−"}{rs(p.amount)}</span>
              </div>
            ))}
          </div>
        </SummaryCard>

        <SummaryCard icon={Wallet} tint="#EDE9FE" accent="#6D28D9" title="Payment Methods" subtitle="Top payment methods overview">
          <div className="flex flex-col gap-3">
            {PAY_METHODS.map((m) => (
              <div key={m.name}>
                <div className="flex items-center justify-between text-[13px] mb-1">
                  <span className="font-semibold text-ink">{m.name}</span>
                  <span className="text-warm-700 tnum">{rs(m.amount)} <span className="text-warm-400">· {m.share}%</span></span>
                </div>
                <div className="h-[6px] rounded-full bg-warm-200 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${m.share}%`, background: m.color }} /></div>
              </div>
            ))}
          </div>
        </SummaryCard>

        <TipsCard
          title="Get the most out of Finance"
          tips={["Add a payment method to start collecting payments", "Record cash & bank transactions daily", "Reconcile unpaid sales weekly"]}
        />
      </div>

      <TxnTable />
    </>
  );
}

/* ── Order tab ────────────────────────────────────────────────── */
function OrderTab() {
  return (
    <>
      <KpiRow kpis={ORDER_KPIS} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-[14px]">
        <Panel>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
            <div>
              <div className="text-[15px] font-extrabold text-ink">Order Insight</div>
              <div className="text-[12.5px] text-warm-500">Here is a live overview of your orders.</div>
            </div>
            <div className="flex items-center gap-3 text-[12px] font-semibold text-warm-600">
              <span className="inline-flex items-center gap-[5px]"><span className="w-[9px] h-[9px] rounded-full bg-[#2563EB]" />Dine In</span>
              <span className="inline-flex items-center gap-[5px]"><span className="w-[9px] h-[9px] rounded-full bg-[#7C3AED]" />Delivery</span>
              <span className="inline-flex items-center gap-[5px]"><span className="w-[9px] h-[9px] rounded-full bg-[#0EA5E9]" />Total KOT</span>
            </div>
          </div>
          <MultiLineChart series={[
            { color: "#2563EB", data: DINE_SERIES },
            { color: "#7C3AED", data: DELIVERY_SERIES },
            { color: "#0EA5E9", data: KOT_SERIES },
          ]} />
          <div className="flex justify-between text-[10.5px] text-warm-400 mt-2"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span></div>
        </Panel>

        <Panel>
          <div className="text-[15px] font-extrabold text-ink">Live Order Status</div>
          <div className="text-[12.5px] text-warm-500 mb-2">Here is a live overview of your orders status.</div>
          <Gauge segments={LIVE_STATUS.map((s) => ({ value: s.value, color: s.color }))} label="Orders" />
          <div className="border-t border-warm-200 pt-4 mt-2">
            <Legend items={LIVE_STATUS.map((s) => ({ label: s.label, color: s.color, value: s.value }))} />
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px]">
        <SummaryCard icon={Receipt} tint="#FEF3E2" accent="#F59E0B" title="Checkout Breakdown" subtitle="Checkout breakdown of sales."
          headerRight={<button className="inline-flex items-center gap-[3px] text-[12px] font-bold text-warm-600"><Printer size={13} color="#6B5F55" />Print</button>}>
          <div className="flex items-center gap-4">
            <Donut segments={CHECKOUT.map((c) => ({ value: c.value, color: c.color }))} />
            <div className="flex-1 min-w-0"><Legend items={CHECKOUT.map((c) => ({ label: c.label, color: c.color, value: rs(c.value) }))} /></div>
          </div>
        </SummaryCard>

        <SummaryCard icon={UtensilsCrossed} tint="#E7F6EC" accent="#15803D" title="Order Services" subtitle="Top Services"
          headerRight={<button className="inline-flex items-center gap-[3px] text-[12px] font-bold text-warm-600"><Printer size={13} color="#6B5F55" />Print</button>}>
          <div className="flex flex-col gap-2">
            {ORDER_SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.name} className="flex items-center justify-between text-[13px]">
                  <span className="flex items-center gap-2"><span className="w-7 h-7 rounded-[8px] flex items-center justify-center" style={{ background: `${s.color}1A` }}><Icon size={14} color={s.color} /></span><span className="font-semibold text-ink">{s.name}</span></span>
                  <span className="text-warm-700 tnum">{rs(s.amount)} <span className="text-warm-400">· {s.orders}</span></span>
                </div>
              );
            })}
          </div>
        </SummaryCard>

        <SummaryCard icon={Bike} tint="#FDECE4" accent={ORANGE} title="Delivery Platform" subtitle="Delivery Platform Summary">
          <div className="flex flex-col gap-2">
            {PLATFORMS.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2"><span className="w-7 h-7 rounded-[8px] flex items-center justify-center text-white text-[10px] font-extrabold" style={{ background: p.color }}>{p.abbr}</span><span className="font-semibold text-ink">{p.name}</span></span>
                <span className="text-warm-700 tnum">{rs(p.amount)} <span className="text-warm-400">· {p.orders}</span></span>
              </div>
            ))}
          </div>
        </SummaryCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px]">
        <SummaryCard icon={Armchair} tint="#E0F2FE" accent="#0369A1" title="Top Selling Table" subtitle="Here is your top selling table.">
          <div className="flex flex-col gap-2">
            {TOP_TABLES.map((t, i) => (
              <div key={t.name} className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2"><span className="text-warm-400 font-bold tnum w-4">{i + 1}</span><span className="font-semibold text-ink">{t.name}</span></span>
                <span className="text-warm-700 tnum">{rs(t.amount)} <span className="text-warm-400">· {t.sold}</span></span>
              </div>
            ))}
          </div>
        </SummaryCard>

        <SummaryCard icon={BookOpen} tint="#E7F6EC" accent="#15803D" title="Sales by Submenus" subtitle="Top Submenus">
          <div className="flex flex-col gap-2">
            {TOP_SUBMENUS.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2"><span className="text-warm-400 font-bold tnum w-4">{i + 1}</span><span className="text-[16px]">{s.emoji}</span><span className="font-semibold text-ink">{s.name}</span></span>
                <span className="text-warm-600 tnum">{s.sold} sold</span>
              </div>
            ))}
          </div>
        </SummaryCard>

        <TipsCard
          title="Get the most out of Orders"
          tips={["Add dishes to your menu for faster billing", "Set up tables & spaces for dine-in orders", "Connect a printer to auto-print KOT tickets"]}
        />
      </div>
    </>
  );
}

/* ── small shared pieces ─────────────────────────────────────── */
function BestCard({ title, subtitle, rows, unit }: { title: string; subtitle: string; rows: { emoji: string; name: string; sold: number }[]; unit: string }) {
  return (
    <div className="bg-white rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div><div className="text-[13.5px] font-extrabold text-ink">{title}</div><div className="text-[11.5px] text-warm-500">{subtitle}</div></div>
        <ViewAllBtn />
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((r, i) => (
          <div key={r.name} className="flex items-center justify-between text-[13px]">
            <span className="flex items-center gap-2">
              <span className="text-warm-400 font-bold tnum w-4">{i + 1}</span>
              <span className="text-[16px]">{r.emoji}</span>
              <span className="font-semibold text-ink">{r.name}</span>
            </span>
            <span className="text-warm-600 tnum">{r.sold} {unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TipsCard({ title, tips }: { title: string; tips: string[] }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col" style={{ background: "linear-gradient(150deg,#FFF1F0,#FFF8F6)", border: "1px solid #F8DAD2", boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
      <div className="text-[14px] font-extrabold text-ink">{title}</div>
      <div className="text-[12px] text-warm-500 mt-[2px] mb-3">A few things to set up next.</div>
      <div className="flex flex-col gap-2">
        {tips.map((t) => (
          <div key={t} className="flex items-start gap-2 text-[13px] text-warm-700">
            <span className="mt-[6px] w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: ORANGE }} />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

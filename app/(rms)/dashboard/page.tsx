"use client";

import { useState } from "react";
import { Button, Tabs, Tab, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import {
  PieChart, ShoppingCart, TrendingUp, Wallet, ChevronDown, Calendar, ChevronRight,
  Bell, CalendarCheck, Bike, ShoppingBag, UsersRound, TrendingDown,
} from "lucide-react";
import { Spark, ORANGE } from "@/components/rms/primitives";

const SALES_BREAKDOWN = [
  { icon: Bell, tint: "#E0F2FE", accent: "#0369A1", label: "Dine In Service", value: 15200 },
  { icon: CalendarCheck, tint: "#EDE9FE", accent: "#6D28D9", label: "Reservation Services", value: 2400 },
  { icon: Bike, tint: "#E3F6F1", accent: "#1FA98B", label: "Delivery Services", value: 5180 },
  { icon: ShoppingBag, tint: "#FDECE4", accent: ORANGE, label: "Takeaway Services", value: 1800 },
];

const HOURLY = [2, 3, 5, 4, 6, 9, 12, 8, 11, 14, 18, 13, 16, 10, 7, 9, 12, 15, 19, 22, 17, 12, 8, 5];

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

function rs(n: number) { return `Rs ${n.toLocaleString()}`; }

function StatCard({ icon: Icon, label, value, delta, up, tint, accent, cardBg, border }: { icon: typeof PieChart; label: string; value: string; delta: string; up: boolean; tint: string; accent: string; cardBg: string; border: string }) {
  return (
    <div className="flex-1 min-w-0 rounded-2xl p-4 px-[18px]" style={{ background: cardBg, border: `1px solid ${border}`, boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[9px]">
          <span className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center" style={{ background: tint }}><Icon size={16} color={accent} /></span>
          <span className="text-[12.5px] font-semibold text-[#8A8079]">{label}</span>
        </div>
        <span className="inline-flex items-center gap-[3px] px-[8px] py-[2px] rounded-full text-[11.5px] font-bold" style={{ color: up ? "#15803D" : "#C2410C", background: up ? "#E7F6EC" : "#FDECE4" }}>
          {up ? <TrendingUp size={12} color="#15803D" /> : <TrendingDown size={12} color="#C2410C" />}{delta}
        </span>
      </div>
      <div className="text-[24px] font-bold text-ink tracking-[-0.02em] tnum mt-2">{value}</div>
      <div className="text-[12px] text-warm-500 mt-[2px]">vs previous period</div>
    </div>
  );
}

/* area + line chart for Sales Overview */
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

function SummaryCard({ icon: Icon, tint, accent, title, subtitle, children }: { icon: typeof UsersRound; tint: string; accent: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 min-w-0 bg-white border border-[#EEEAE6] rounded-2xl p-4" style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-[9px]">
          <span className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center" style={{ background: tint }}><Icon size={16} color={accent} /></span>
          <div><div className="text-[13.5px] font-extrabold text-ink leading-tight">{title}</div><div className="text-[11.5px] text-warm-500">{subtitle}</div></div>
        </div>
        <button className="inline-flex items-center gap-[2px] text-[12px] font-bold" style={{ color: ORANGE }}>View All <ChevronRight size={13} color={ORANGE} /></button>
      </div>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const [tab, setTab] = useState<"overview" | "finance" | "order">("overview");
  const totalSales = SALES_BREAKDOWN.reduce((s, b) => s + b.value, 0);

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
          </DropdownTrigger><DropdownMenu aria-label="Range">{["Today","This Week","This Month"].map((r) => <DropdownItem key={r}>{r}</DropdownItem>)}</DropdownMenu></Dropdown>
          <Dropdown><DropdownTrigger>
            <Button size="sm" radius="md" variant="bordered" className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-700"
              endContent={<ChevronDown size={13} color="#8A7D72" />}>Daybook: All</Button>
          </DropdownTrigger><DropdownMenu aria-label="Daybook">{["All","Cash","Bank"].map((r) => <DropdownItem key={r}>{r}</DropdownItem>)}</DropdownMenu></Dropdown>
        </div>
      </div>

      {/* top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[14px]">
        <StatCard icon={PieChart} label="Sales" value={rs(totalSales)} delta="12.4%" up tint="#E0F2FE" accent="#0369A1" cardBg="linear-gradient(135deg,#EFF6FF,#FFFFFF)" border="#DCEBFB" />
        <StatCard icon={ShoppingCart} label="Purchase" value={rs(8200)} delta="3.1%" up tint="#FEF3E2" accent="#F59E0B" cardBg="linear-gradient(135deg,#FFFBEB,#FFFFFF)" border="#F6ECCF" />
        <StatCard icon={TrendingUp} label="Income" value={rs(totalSales - 8200)} delta="9.8%" up tint="#E7F6EC" accent="#15803D" cardBg="linear-gradient(135deg,#F0FDF4,#FFFFFF)" border="#D5EFDD" />
        <StatCard icon={Wallet} label="Expenses" value={rs(3150)} delta="2.2%" up={false} tint="#FDECE4" accent={ORANGE} cardBg="linear-gradient(135deg,#FEF2F2,#FFFFFF)" border="#F8DAD2" />
      </div>

      {/* sales + overview */}
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

        <div className="bg-white border border-[#EEEAE6] rounded-2xl p-5" style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
          <div className="text-[15px] font-extrabold text-ink">Sales Overview</div>
          <div className="text-[12.5px] text-warm-500 mb-3">Here is a live overview of your sales</div>
          <SalesChart data={HOURLY} />
          <div className="flex justify-between text-[10.5px] text-warm-400 mt-2"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span></div>
        </div>
      </div>

      {/* three summary cards */}
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

      {/* best selling banner */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#D8420F,#F15022)" }}>
        <h2 className="text-[22px] font-extrabold text-white tracking-[-0.02em]">Do you know your best-selling dishes?</h2>
        <p className="text-[13px] text-white/85 mt-1">We have listed the top 5 best-selling dishes, top categories, and add-ons here.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[14px] mt-5">
          <BestCard title="Top Selling Dishes" subtitle="More people loved these dishes." rows={TOP_DISHES} unit="sold" />
          <BestCard title="Top Selling Add-Ons" subtitle="More people loved these add-ons." rows={TOP_ADDONS} unit="sold" />
          <BestCard title="Top Selling Category" subtitle="More people loved this category." rows={TOP_CATEGORIES} unit="sold" />
        </div>
      </div>

      {/* transaction history */}
      <div className="bg-white border border-[#EEEAE6] rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-warm-200">
          <span className="text-[15px] font-extrabold text-ink">Transaction History</span>
          <button className="inline-flex items-center gap-[2px] text-[12px] font-bold" style={{ color: ORANGE }}>View All <ChevronDown size={13} color={ORANGE} /></button>
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
    </>
  );
}

function BestCard({ title, subtitle, rows, unit }: { title: string; subtitle: string; rows: { emoji: string; name: string; sold: number }[]; unit: string }) {
  return (
    <div className="bg-white rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div><div className="text-[13.5px] font-extrabold text-ink">{title}</div><div className="text-[11.5px] text-warm-500">{subtitle}</div></div>
        <button className="inline-flex items-center gap-[2px] text-[12px] font-bold" style={{ color: ORANGE }}>View All <ChevronRight size={13} color={ORANGE} /></button>
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

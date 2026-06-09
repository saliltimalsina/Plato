"use client";

import {
  Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button,
} from "@heroui/react";
import {
  Box, TrendingUp, TrendingDown, Clock, ChevronDown, Pencil, Trash2, X,
  LucideIcon,
} from "lucide-react";
import {
  STATUS_COLOR, GROUP_COLOR, ORANGE, status, pct, StockItem,
} from "./data";

const MU_MAP: Record<string, string> = {
  kg: "Kilogram (kg)", L: "Litre (L)", btl: "Bottle (btl)", pcs: "Piece (pcs)", g: "Gram (g)",
};
const DISH_MAP: Record<number, { n: string; q: number; a: string }[]> = {
  1: [{ n: "Chicken-Burger", q: 2, a: "Rs 400" }],
  2: [{ n: "Margherita Pizza", q: 3, a: "Rs 360" }, { n: "Garden Salad", q: 1, a: "Rs 120" }],
  3: [{ n: "Grilled Chicken Platter", q: 4, a: "Rs 3,400" }],
  6: [{ n: "Margherita Pizza", q: 2, a: "Rs 1,900" }],
};
const ADDON_MAP: Record<number, { n: string; q: number; a: string }[]> = {
  4: [{ n: "Extra Coke (Large)", q: 5, a: "Rs 400" }],
};
const q2 = (v: number) => Number(v).toFixed(2);

interface Props {
  item: StockItem;
  onClose: () => void;
  onEdit: (it: StockItem) => void;
  onDelete: (it: StockItem) => void;
}

export function DetailDrawer({ item, onClose, onEdit, onDelete }: Props) {
  const p = pct(item);
  const hasSupplier = item.supplier && item.supplier !== "—";
  const stockOut = Math.max(0, item.opening - item.closing);
  const dishes = DISH_MAP[item.id] || [];
  const addons = ADDON_MAP[item.id] || [];

  return (
    <Drawer
      isOpen
      onClose={onClose}
      placement="right"
      size="sm"
      classNames={{
        base: "sm:max-w-[460px]",
        closeButton: "hidden",
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-2 border-b border-warm-200">
          <div className="flex-1 min-w-0 flex items-center gap-[9px]">
            <span className="text-[18px] font-extrabold text-ink tracking-[-0.02em] truncate">{item.name}</span>
            <span className="text-[11px] font-semibold font-mono text-warm-500 bg-warm-200 px-[7px] py-[2px] rounded-md flex-shrink-0">
              #{String(item.id).padStart(4, "0")}
            </span>
          </div>
          <Button size="sm" variant="bordered" radius="md" className="h-[34px] border border-[#E6E1DC] bg-white font-semibold text-warm-600 text-[12.5px]"
            startContent={<Clock size={14} color="#8A7D72" />} onPress={() => onEdit(item)}>
            Stock History
          </Button>
          <Button isIconOnly size="sm" variant="bordered" radius="md" className="w-[34px] h-[34px] min-w-[34px] border border-[#E6E1DC] bg-white" onPress={() => onDelete(item)}>
            <Trash2 size={16} color={ORANGE} />
          </Button>
          <Button isIconOnly size="sm" variant="bordered" radius="md" className="w-[34px] h-[34px] min-w-[34px] border border-[#E6E1DC] bg-white" onPress={onClose}>
            <X size={16} color="#8A7D72" />
          </Button>
        </DrawerHeader>

        <DrawerBody className="px-5">
          {/* basic details + ring */}
          <Section title="Basic Details" first>
            <div className="flex gap-4">
              <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-4">
                <DField label="Measuring Unit">{MU_MAP[item.unit] || item.unit}</DField>
                <DField label="Default Price">{item.rate}</DField>
                <DField label="Reorder Level"><span className="text-[#C0B4A8]">—</span></DField>
                <DField label="Reorder Quantity"><span className="text-[#C0B4A8]">—</span></DField>
              </div>
              <Ring p={p} color={STATUS_COLOR[status(item)].bar} />
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-4">
              <DField label="Group">
                <div className="flex gap-[5px] flex-wrap">
                  {item.groups.map((g) => {
                    const c = GROUP_COLOR[g] || "#697177";
                    return <span key={g} className="text-[11.5px] font-semibold px-[9px] py-[2px] rounded-full" style={{ color: c, background: `${c}14` }}>{g}</span>;
                  })}
                </div>
              </DField>
              <DField label="Default Supplier">
                <div className="flex items-center justify-between h-9 px-[11px] rounded-[9px] border border-[#E6E1DC] bg-white">
                  <span className="text-[13px]" style={{ fontWeight: hasSupplier ? 600 : 500, color: hasSupplier ? "#3F3933" : "#B0A69E" }}>
                    {hasSupplier ? item.supplier : "Select an option"}
                  </span>
                  <ChevronDown size={14} color="#B0A69E" />
                </div>
              </DField>
            </div>
            <div className="mt-4">
              <DField label="Description"><span className="text-warm-500 font-medium">No description added yet.</span></DField>
            </div>
          </Section>

          {/* stock ledger */}
          <Section title="Stock Ledger">
            <div className="flex gap-2">
              <Ledger icon={Box} tint="#F3ECFF" fg="#9B51E0" label="Current Stock" value={`${q2(item.closing)} ${item.unit}`} />
              <Ledger icon={TrendingDown} tint="#E7F6EC" fg="#22C55E" label="Stock In" value={`${q2(0)} ${item.unit}`} sub="this month" />
              <Ledger icon={TrendingUp} tint="#FDECE4" fg={ORANGE} label="Stock Out" value={`${q2(stockOut)} ${item.unit}`} sub="this month" />
            </div>
            <div className="flex items-center gap-2 mt-3 px-3 py-[10px] bg-cream rounded-[11px] border border-warm-200">
              <Clock size={14} color="#A89B8F" />
              <span className="flex-1 text-[12.5px] text-warm-600">Opening stock of {q2(item.opening)} {item.unit} was recorded for {item.name}.</span>
              <span className="text-[12px] font-bold whitespace-nowrap" style={{ color: "#0EA5E9" }}>Jun 05, 2026</span>
            </div>
          </Section>

          <Section title="Dish Consumptions" action={dishes.length > 0 ? <span className="text-[11.5px] font-bold text-warm-500">{dishes.length} dish{dishes.length > 1 ? "es" : ""}</span> : undefined}>
            <ConsTable rows={dishes} />
          </Section>
          <Section title="Add-ons Consumptions">
            <ConsTable rows={addons} />
          </Section>
        </DrawerBody>

        <DrawerFooter className="border-t border-warm-200 bg-warm-50">
          <Button variant="bordered" radius="lg" className="h-[42px] border border-[#E6E1DC] bg-white font-semibold text-warm-600"
            startContent={<Trash2 size={16} color={ORANGE} />} onPress={() => onDelete(item)}>
            Delete
          </Button>
          <Button radius="lg" className="flex-1 h-[42px] font-bold text-white"
            style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
            startContent={<Pencil size={15} color="#fff" />} onPress={() => onEdit(item)}>
            Edit item
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function Ring({ p, color, size = 92 }: { p: number; color: string; size?: number }) {
  const r = (size - 11) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F0ECE8" strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p / 100)} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-extrabold text-ink leading-none tnum">{p}%</span>
        <span className="text-[10px] text-warm-500 mt-[2px]">in stock</span>
      </div>
    </div>
  );
}

function DField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.05em] mb-[6px]">{label}</div>
      <div className="text-[14px] font-semibold text-warm-700">{children}</div>
    </div>
  );
}

function Section({ title, action, children, first }: { title: string; action?: React.ReactNode; children: React.ReactNode; first?: boolean }) {
  return (
    <div className={first ? "pt-1 pb-[18px]" : "py-[18px] border-t border-warm-200"}>
      <div className="flex items-center justify-between mb-[14px]">
        <span className="text-[11.5px] font-extrabold text-warm-600 uppercase tracking-[0.06em]">{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}

function Ledger({ icon: Icon, tint, fg, label, value, sub }: { icon: LucideIcon; tint: string; fg: string; label: string; value: string; sub?: string }) {
  return (
    <div className="flex-1 min-w-0 p-3 bg-white border border-[#EEEAE6] rounded-[12px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-warm-500 uppercase tracking-[0.04em]">{label}</span>
        <div className="w-[22px] h-[22px] rounded-[7px] flex items-center justify-center flex-shrink-0" style={{ background: tint }}>
          <Icon size={12} color={fg} />
        </div>
      </div>
      <div className="text-[16px] font-extrabold text-ink tnum whitespace-nowrap">{value}</div>
      {sub && <div className="text-[10.5px] text-warm-500 mt-[2px]">{sub}</div>}
    </div>
  );
}

function ConsTable({ rows }: { rows: { n: string; q: number; a: string }[] }) {
  if (!rows.length) {
    return (
      <div className="border-[1.5px] border-dashed border-warm-200 rounded-[12px] py-[22px] text-center flex flex-col items-center gap-2">
        <div className="w-[34px] h-[34px] rounded-[10px] bg-warm-100 flex items-center justify-center"><Box size={16} color="#C9BCB0" /></div>
        <span className="text-[12.5px] text-warm-500 font-medium">No consumptions recorded yet.</span>
      </div>
    );
  }
  return (
    <div className="border border-[#EEEAE6] rounded-[12px] overflow-hidden">
      <div className="grid bg-cream border-b border-warm-200 px-3 py-2 text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em]" style={{ gridTemplateColumns: "34px 1fr 46px 86px" }}>
        <span>S.N</span><span>Name</span><span className="text-center">Qty</span><span className="text-right">Amount</span>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid px-3 py-[10px] items-center" style={{ gridTemplateColumns: "34px 1fr 46px 86px", borderBottom: i === rows.length - 1 ? "none" : "1px solid #F4EFEB" }}>
          <span className="text-[12px] font-mono text-warm-500">{i + 1}</span>
          <span className="text-[13px] font-semibold text-ink">{r.n}</span>
          <span className="text-[13px] font-semibold text-warm-600 text-center">{r.q}</span>
          <span className="text-[13px] font-bold text-ink text-right tnum">{r.a}</span>
        </div>
      ))}
    </div>
  );
}

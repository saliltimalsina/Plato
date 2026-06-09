"use client";

import { useMemo, useState } from "react";
import { ScrollText, Check } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { Badge, ORANGE, KpiData } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import {
  StockHistoryRow, STOCK_HISTORY, MovementType, MOVEMENT_TONE,
} from "@/components/rms/data/inventory";

const COLUMNS = [
  { key: "sn", label: "SN" },
  { key: "date", label: "Date", sortable: true },
  { key: "item", label: "Item", sortable: true },
  { key: "type", label: "Type" },
  { key: "qty", label: "Qty", align: "end" as const },
  { key: "balance", label: "Balance", align: "end" as const },
  { key: "by", label: "By" },
];

const MOVEMENT_TYPES: MovementType[] = ["Stock In", "Stock Out", "Opening", "Adjustment"];

function qtyColor(qty: string): string {
  if (qty.trim().startsWith("+")) return "#15803D";
  if (qty.trim().startsWith("-")) return "#C2410C";
  return "#3F3933";
}

export default function StockHistoryPage() {
  const [types, setTypes] = useState<MovementType[]>([]);

  const filterPredicate = useMemo(
    () => (r: StockHistoryRow) => types.length === 0 || types.includes(r.type),
    [types],
  );

  const s = useListState<StockHistoryRow>({
    initial: STOCK_HISTORY.map((r) => ({ ...r })),
    searchableText: (r) => `${r.item} ${r.type} ${r.by}`,
    sortAccessors: { date: (r) => r.date, item: (r) => r.item.toLowerCase() },
    filterPredicate,
  });

  const kpis: KpiData[] = [
    { key: "moves", icon: ScrollText, tint: "#FDECE4", accent: ORANGE, label: "Total Movements", value: s.items.length, sub: "entries", sparkData: [3, 4, 4, 5, 5, 6, 6, 6, 7, 7, 7, s.items.length] },
  ];

  const renderCell = (r: StockHistoryRow, key: string) => {
    switch (key) {
      case "sn": return <span className="font-mono text-[12.5px] text-warm-500">{String(r.id).padStart(2, "0")}</span>;
      case "date": return <span className="text-[13px] text-warm-600 tnum whitespace-nowrap">{r.date}</span>;
      case "item": return <span className="text-[13.5px] font-bold text-ink whitespace-nowrap">{r.item}</span>;
      case "type": return <Badge tone={MOVEMENT_TONE[r.type]}>{r.type}</Badge>;
      case "qty": return <span className="text-[13px] font-bold tnum whitespace-nowrap" style={{ color: qtyColor(r.qty) }}>{r.qty}</span>;
      case "balance": return <span className="text-[13px] text-warm-600 tnum whitespace-nowrap">{r.balance}</span>;
      case "by": return <span className="text-[12.5px] text-warm-500">{r.by}</span>;
      default: return null;
    }
  };

  const renderCard = (r: StockHistoryRow) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-ink">{r.item}</div>
          <div className="mt-[3px] flex items-center gap-[7px]">
            <Badge tone={MOVEMENT_TONE[r.type]}>{r.type}</Badge>
            <span className="text-[12px] text-warm-500 tnum">{r.date}</span>
          </div>
        </div>
        <span className="text-[15px] font-extrabold tnum whitespace-nowrap" style={{ color: qtyColor(r.qty) }}>{r.qty}</span>
      </div>
      <div className="mt-[11px] pt-[11px] border-t border-warm-200 flex items-center justify-between text-[12px]">
        <span className="text-warm-500">{r.by}</span>
        <span className="text-warm-600 tnum">Balance <span className="font-bold text-ink">{r.balance}</span></span>
      </div>
    </div>
  );

  const filterContent = (
    <div className="w-full">
      <div className="px-[14px] py-[10px] border-b border-warm-200 lg:flex hidden justify-between items-center">
        <span className="text-[12px] font-bold text-ink">Filter by type</span>
        {types.length > 0 && <button onClick={() => setTypes([])} className="text-[11.5px] font-semibold" style={{ color: ORANGE }}>Clear</button>}
      </div>
      <div className="p-[6px] flex flex-wrap lg:block gap-2">
        {MOVEMENT_TYPES.map((t) => {
          const on = types.includes(t);
          return (
            <button key={t} onClick={() => setTypes((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t])}
              className="lg:w-full flex items-center justify-between lg:px-[9px] px-[13px] py-[7px] rounded-lg lg:rounded-lg rounded-full hover:bg-warm-100 lg:border-0 border"
              style={{ borderColor: on ? ORANGE : "#E6E1DC", background: on ? "#FFF1EB" : undefined }}>
              <span className="text-[13px] font-medium" style={{ color: on ? ORANGE : "#3F3933" }}>{t}</span>
              {on && <Check size={15} color={ORANGE} className="hidden lg:block" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <ListScaffold
      state={s}
      title="Stock History"
      kpis={kpis}
      totalCount={s.items.length}
      columns={COLUMNS}
      renderCell={renderCell}
      renderCard={renderCard}
      selectable={false}
      searchPlaceholder="Search history…"
      filterContent={filterContent}
      filterCount={types.length}
    />
  );
}

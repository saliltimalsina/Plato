"use client";

import { useMemo, useState } from "react";
import { Select, SelectItem } from "@heroui/react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { GroupChip, ORANGE } from "@/components/rms/primitives";
import { GROUP_COLOR } from "@/components/stock/data";
import { useListState } from "@/components/rms/useListState";
import {
  StockHistoryRow, STOCK_HISTORY, MovementType,
} from "@/components/rms/data/inventory";
import { labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";

const MOVEMENT_TYPES: ("All" | MovementType)[] = ["All", "Stock In", "Stock Out", "Opening", "Adjustment"];
const YEARS = ["This Year", "Last Year", "All Time"];
const STAFF = ["All", "Salil Timalsina", "Priya Yadav", "Bikash Gurung"];

const COLUMNS = [
  { key: "sn",          label: "SN" },
  { key: "date",        label: "Date",        sortable: true },
  { key: "item",        label: "Stock Item",  sortable: true },
  { key: "groups",      label: "Stock Group" },
  { key: "particular",  label: "Particulars" },
  { key: "party",       label: "Parties" },
  { key: "opening",     label: "Opening",     align: "end" as const },
  { key: "in",          label: "In",          align: "center" as const },
  { key: "out",         label: "Out",         align: "center" as const },
  { key: "rate",        label: "Rate",        align: "end" as const },
  { key: "amount",      label: "Amount",      align: "end" as const },
  { key: "closing",     label: "Closing",     align: "end" as const },
  { key: "stockValue",  label: "Stock Value", align: "end" as const },
];

export default function StockHistoryPage() {
  const [year, setYear]           = useState("This Year");
  const [staff, setStaff]         = useState("All");
  const [type, setType]           = useState<"All" | MovementType>("All");
  const [stockItem, setStockItem] = useState("All");
  const [group, setGroup]         = useState("All");

  const stockItems = useMemo(() => ["All", ...new Set(STOCK_HISTORY.map((r) => r.item))], []);
  const groups     = useMemo(() => ["All", ...new Set(STOCK_HISTORY.flatMap((r) => r.groups))], []);

  const filterPredicate = useMemo(
    () => (r: StockHistoryRow) => {
      if (staff !== "All" && r.by !== staff) return false;
      if (type !== "All" && r.type !== type) return false;
      if (stockItem !== "All" && r.item !== stockItem) return false;
      if (group !== "All" && !r.groups.includes(group)) return false;
      return true;
    },
    [staff, type, stockItem, group],
  );

  const s = useListState<StockHistoryRow>({
    initial: STOCK_HISTORY.map((r) => ({ ...r })),
    searchableText: (r) => `${r.item} ${r.particular} ${r.party} ${r.by} ${r.groups.join(" ")}`,
    sortAccessors: { date: (r) => r.date, item: (r) => r.item.toLowerCase() },
    filterPredicate,
  });

  const activeFilters =
    (year !== "This Year" ? 1 : 0) +
    (staff !== "All" ? 1 : 0) +
    (type !== "All" ? 1 : 0) +
    (stockItem !== "All" ? 1 : 0) +
    (group !== "All" ? 1 : 0);

  /* filter popover body (single panel with 5 selects) */
  const filterContent = (
    <div className="w-full p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-ink">Filters</span>
        {activeFilters > 0 && (
          <button onClick={() => { setYear("This Year"); setStaff("All"); setType("All"); setStockItem("All"); setGroup("All"); }}
            className="text-[11.5px] font-semibold" style={{ color: ORANGE }}>Clear all</button>
        )}
      </div>
      <SelectField label="Date"        value={year}      options={YEARS}              onChange={setYear} />
      <SelectField label="Staff"       value={staff}     options={STAFF}              onChange={setStaff} />
      <SelectField label="Type"        value={type}      options={MOVEMENT_TYPES as string[]} onChange={(v) => setType(v as "All" | MovementType)} />
      <SelectField label="Stock Item"  value={stockItem} options={stockItems}         onChange={setStockItem} />
      <SelectField label="Group"       value={group}     options={groups}             onChange={setGroup} />
    </div>
  );

  const renderCell = (r: StockHistoryRow, key: string) => {
    switch (key) {
      case "sn":          return <span className="font-mono text-[12.5px] text-warm-500">{r.id}</span>;
      case "date":        return <span className="text-[12.5px] text-warm-600 tnum whitespace-nowrap">{r.date}</span>;
      case "item":        return <span className="text-[13px] font-semibold text-ink whitespace-nowrap">{r.item}</span>;
      case "groups":
        return r.groups.length === 0
          ? <span className="text-warm-400">—</span>
          : (
            <span className="inline-flex flex-wrap gap-[5px]">
              {r.groups.map((g) => <GroupChip key={g} label={g} color={GROUP_COLOR[g] ?? "#6B5F55"} />)}
            </span>
          );
      case "particular":  return (
        <span className="text-[12.5px] text-warm-700 whitespace-nowrap">
          Opening <span className="text-[#0EA5E9] font-semibold">{r.particularKind}</span>
        </span>
      );
      case "party":       return <span className="text-[13px] font-semibold text-ink whitespace-nowrap">{r.party}</span>;
      case "opening":     return <span className="text-[12.5px] text-ink tnum">{r.opening}</span>;
      case "in":          return <span className="text-[12.5px] text-warm-500">{r.in}</span>;
      case "out":         return <span className="text-[12.5px] font-bold" style={{ color: "#C2410C" }}>{r.out}</span>;
      case "rate":        return <span className="text-[12.5px] font-bold tnum" style={{ color: "#15803D" }}>{r.rate}</span>;
      case "amount":      return (
        <span className="inline-flex items-center justify-end gap-[3px] text-[12.5px] font-bold tnum" style={{ color: r.amountUp ? "#15803D" : "#C2410C" }}>
          {r.amountUp
            ? <ArrowUp size={11} color="#15803D" strokeWidth={2.6} />
            : <ArrowDown size={11} color="#C2410C" strokeWidth={2.6} />}
          {r.amount}
        </span>
      );
      case "closing":     return <span className="text-[12.5px] text-ink tnum whitespace-nowrap">{r.closing}</span>;
      case "stockValue":  return <span className="text-[12.5px] text-ink tnum">{r.stockValue}</span>;
      default: return null;
    }
  };

  const renderCard = (r: StockHistoryRow) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-[14.5px] font-bold text-ink">{r.item}</div>
          <div className="mt-[3px] text-[12px] text-warm-500 tnum">{r.date}</div>
        </div>
        <span className="inline-flex items-center gap-1 text-[14px] font-extrabold tnum"
          style={{ color: r.amountUp ? "#15803D" : "#C2410C" }}>
          {r.amountUp
            ? <ArrowUp size={13} color="#15803D" strokeWidth={2.6} />
            : <ArrowDown size={13} color="#C2410C" strokeWidth={2.6} />}
          {r.amount}
        </span>
      </div>
      <div className="mt-[10px] flex items-center justify-between">
        <span className="inline-flex flex-wrap gap-[5px]">
          {r.groups.map((g) => <GroupChip key={g} label={g} color={GROUP_COLOR[g] ?? "#6B5F55"} />)}
        </span>
        <span className="text-[12px] text-warm-600 tnum">Closing <span className="font-bold text-ink">{r.closing}</span></span>
      </div>
    </div>
  );

  return (
    <ListScaffold
      state={s}
      title="Stock History"
      totalCount={s.items.length}
      columns={COLUMNS}
      renderCell={renderCell}
      renderCard={renderCard}
      selectable={false}
      searchPlaceholder="Search history…"
      filterContent={filterContent}
      filterCount={activeFilters}
    />
  );
}

/* compact select used inside filter popover */
function SelectField({
  label, value, options, onChange,
}: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <Select
      label={label} labelPlacement="outside"
      selectedKeys={[value]}
      onSelectionChange={(k) => onChange(Array.from(k)[0] as string)}
      size="sm" variant="bordered" radius="md"
      classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
    >
      {options.map((o) => <SelectItem key={o}>{o}</SelectItem>)}
    </Select>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input,
} from "@heroui/react";
import { ChevronDown, Search, ArrowUp, ArrowDown } from "lucide-react";
import { PageHeader, GroupChip } from "@/components/rms/primitives";
import { GROUP_COLOR } from "@/components/stock/data";
import {
  StockHistoryRow, STOCK_HISTORY, MovementType,
} from "@/components/rms/data/inventory";

const MOVEMENT_TYPES: ("All" | MovementType)[] = ["All", "Stock In", "Stock Out", "Opening", "Adjustment"];
const YEARS = ["This Year", "Last Year", "All Time"];
const STAFF  = ["All", "Salil Timalsina", "Priya Yadav", "Bikash Gurung"];

type Filter = "Date" | "Staff" | "Type" | "Stock Item" | "Group";

function FilterChip({
  label, value, options, onSelect,
}: { label: string; value: string; options: string[]; onSelect: (v: string) => void }) {
  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <Button size="sm" radius="md" variant="bordered"
          className="h-9 border border-[#E6E1DC] bg-white text-warm-600 text-[12.5px] font-semibold"
          endContent={<ChevronDown size={13} color="#8A7D72" />}>
          {label === "Date" ? value : `${label}: ${value}`}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label={label} onAction={(k) => onSelect(String(k))}>
        {options.map((o) => <DropdownItem key={o}>{o}</DropdownItem>)}
      </DropdownMenu>
    </Dropdown>
  );
}

export default function StockHistoryPage() {
  const [search, setSearch]     = useState("");
  const [year, setYear]         = useState("This Year");
  const [staff, setStaff]       = useState("All");
  const [type, setType]         = useState<"All" | MovementType>("All");
  const [stockItem, setStockItem] = useState("All");
  const [group, setGroup]       = useState("All");

  const stockItems = useMemo(() => ["All", ...new Set(STOCK_HISTORY.map((r) => r.item))], []);
  const groups     = useMemo(() => ["All", ...new Set(STOCK_HISTORY.flatMap((r) => r.groups))], []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return STOCK_HISTORY.filter((r) => {
      if (q && !`${r.item} ${r.particular} ${r.party} ${r.by}`.toLowerCase().includes(q)) return false;
      if (staff !== "All" && r.by !== staff) return false;
      if (type !== "All" && r.type !== type) return false;
      if (stockItem !== "All" && r.item !== stockItem) return false;
      if (group !== "All" && !r.groups.includes(group)) return false;
      return true;
    });
  }, [search, staff, type, stockItem, group]);

  const COLS = "44px 1.2fr 1fr 0.9fr 1.1fr 1.1fr 0.7fr 0.5fr 0.5fr 0.7fr 0.8fr 0.8fr 0.8fr";

  return (
    <>
      <PageHeader
        title="Stock History"
        actions={
          <div className="hidden lg:flex items-center gap-[9px]">
            <Input size="sm" radius="md" placeholder="Search…"
              value={search} onValueChange={setSearch}
              startContent={<Search size={15} color="#B0A69E" />}
              classNames={{ base: "w-[210px]", inputWrapper: "bg-white border border-[#E6E1DC] h-9 shadow-none" }} />
          </div>
        }
      />

      {/* mobile search */}
      <div className="flex lg:hidden">
        <Input radius="lg" placeholder="Search…" value={search} onValueChange={setSearch}
          startContent={<Search size={16} color="#B0A69E" />}
          classNames={{ base: "flex-1", inputWrapper: "bg-white border border-[#E6E1DC] h-11 shadow-none" }} />
      </div>

      {/* filter chip row */}
      <div className="flex items-center gap-2 flex-wrap">
        <FilterChip label="Date" value={year} options={YEARS} onSelect={setYear} />
        <FilterChip label="Staff" value={staff} options={STAFF} onSelect={setStaff} />
        <FilterChip label="Type" value={type} options={MOVEMENT_TYPES} onSelect={(v) => setType(v as "All" | MovementType)} />
        <FilterChip label="Stock Item" value={stockItem} options={stockItems} onSelect={setStockItem} />
        <FilterChip label="Group" value={group} options={groups} onSelect={setGroup} />
      </div>

      {/* table */}
      <div className="bg-white border border-[#EEEAE6] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <div className="grid gap-x-5 bg-cream border-b border-warm-200 px-5 py-[12px] text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em] min-w-[1320px]"
            style={{ gridTemplateColumns: COLS }}>
            <span>SN</span><span>Date</span><span>Stock Item</span><span>Stock Group</span>
            <span>Particulars</span><span>Parties</span>
            <span className="text-right">Opening</span>
            <span className="text-center">In</span>
            <span className="text-center">Out</span>
            <span className="text-right">Rate</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Closing</span>
            <span className="text-right">Stock Value</span>
          </div>
          {filtered.map((r, i) => (
            <div key={r.id} className="grid gap-x-5 px-5 py-4 items-center min-w-[1320px]"
              style={{ gridTemplateColumns: COLS, borderBottom: i === filtered.length - 1 ? "none" : "1px solid #F4EFEB" }}>
              <span className="text-[12px] font-mono text-warm-500">{i + 1}</span>
              <span className="text-[12.5px] text-warm-600 tnum whitespace-nowrap">{r.date}</span>
              <span className="text-[13px] font-semibold text-ink truncate">{r.item}</span>
              <span className="min-w-0">
                {r.groups.length === 0 ? (
                  <span className="text-warm-400">—</span>
                ) : (
                  <span className="inline-flex flex-wrap gap-[5px]">
                    {r.groups.map((g) => (
                      <GroupChip key={g} label={g} color={GROUP_COLOR[g] ?? "#6B5F55"} />
                    ))}
                  </span>
                )}
              </span>
              <span className="text-[12.5px] text-warm-700">
                Opening <span className="text-[#0EA5E9] font-semibold">{r.particularKind}</span>
              </span>
              <span className="text-[13px] font-semibold text-ink truncate">{r.party}</span>
              <span className="text-[12.5px] text-ink text-right tnum">{r.opening}</span>
              <span className="text-[12.5px] text-warm-500 text-center">{r.in}</span>
              <span className="text-[12.5px] text-[#C2410C] font-bold text-center">{r.out}</span>
              <span className="text-[12.5px] font-bold text-[#15803D] text-right tnum">{r.rate}</span>
              <span className="text-[12.5px] font-bold text-[#15803D] text-right tnum inline-flex items-center justify-end gap-[3px]">
                {r.amountUp
                  ? <ArrowUp size={11} color="#15803D" strokeWidth={2.6} />
                  : <ArrowDown size={11} color="#C2410C" strokeWidth={2.6} />}
                {r.amount}
              </span>
              <span className="text-[12.5px] text-ink text-right tnum">{r.closing}</span>
              <span className="text-[12.5px] text-ink text-right tnum">{r.stockValue}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-3 py-10 text-center text-[13px] text-warm-500 font-medium">No movements match these filters.</div>
          )}
        </div>
      </div>

      <div className="text-[12px] text-warm-500">0 of {filtered.length} row(s) selected.</div>
    </>
  );
}

// keep export stable
export type _StockHistoryPageRow = StockHistoryRow;

"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import {
  Box, Coins, RefreshCw, TriangleAlert, MoreHorizontal, Package, Pencil,
  RotateCcw, Trash2, Check, Upload, Download, BarChart3,
} from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { DeleteModal } from "@/components/rms/ModalShell";
import { GroupChip, Badge, ORANGE, KpiData } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import {
  ITEMS, StockItem, ALL_GROUPS, GROUP_COLOR, STATUS_COLOR, pct, status, fmtK,
} from "@/components/stock/data";
import { AddEditModal } from "@/components/stock/AddEditModal";
import { StockItemsContext, StockItemsCtx } from "@/components/stock/StockItemsContext";

const COLUMNS = [
  { key: "sn", label: "SN" },
  { key: "name", label: "Stock Item", sortable: true },
  { key: "group", label: "Group" },
  { key: "rate", label: "Consumption Rate", sortable: true },
  { key: "opening", label: "Opening" },
  { key: "stock", label: "Closing", sortable: true },
  { key: "value", label: "Stock Value", sortable: true, align: "end" as const },
  { key: "status", label: "Status" },
  { key: "supplier", label: "Supplier" },
  { key: "actions", label: "", align: "center" as const },
];

const BASE = "/inventory/stock-items";

export default function StockItemsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [statusTab, setStatusTab] = useState("all");
  const [groups, setGroups] = useState<string[]>([]);

  const filterPredicate = useMemo(() => (it: StockItem) => {
    const mg = groups.length === 0 || it.groups.some((g) => groups.includes(g));
    const mt = statusTab === "all" || status(it) === statusTab;
    return mg && mt;
  }, [statusTab, groups]);

  const s = useListState<StockItem>({
    initial: ITEMS.map((i) => ({ ...i, groups: [...i.groups] })),
    searchableText: (i) => `${i.name} ${i.supplier}`,
    sortAccessors: { name: (i) => i.name.toLowerCase(), rate: (i) => i.rateNum, stock: (i) => pct(i), value: (i) => i.valueNum },
    filterPredicate,
  });

  const totalValue = s.items.reduce((a, i) => a + i.valueNum, 0);
  const lowCount = s.items.filter((i) => status(i) !== "ok").length;

  const kpis: KpiData[] = [
    { key: "items", icon: Box, tint: "#E8F4FF", accent: "#0EA5E9", label: "Total Stock Items", value: s.items.length, sub: "/ 1,000", delta: "+3", deltaUp: true, sparkData: [4,5,5,6,6,7,7,8,8,9,9,s.items.length] },
    { key: "value", icon: Coins, tint: "#F3ECFF", accent: "#9B51E0", label: "Total Stock Value", value: fmtK(totalValue), delta: "+6%", deltaUp: true, sparkData: [30,32,34,36,38,40,42,44,45,46,47,Math.round(totalValue/1000)] },
    { key: "restock", icon: RefreshCw, tint: "#E7F6EC", accent: "#22C55E", label: "Restocked this week", value: "3", sub: "items", delta: "+2", deltaUp: true, sparkData: [2,1,3,2,4,3,2,1,2,1,3,3] },
    { key: "low", icon: TriangleAlert, tint: "#FDECE4", accent: ORANGE, label: "Low Stock Items", value: lowCount, sub: "alerts", delta: "+1", deltaUp: false, sparkData: [1,2,1,1,2,1,2,2,1,2,2,Math.max(1,lowCount)] },
  ];

  const statusTabs = [
    { key: "all", label: "All", count: s.filtered.length },
    { key: "ok", label: "In stock", count: s.items.filter((i) => status(i) === "ok").length },
    { key: "watch", label: "Running low", count: s.items.filter((i) => status(i) === "watch").length },
    { key: "low", label: "Reorder", count: s.items.filter((i) => status(i) === "low").length },
  ];

  const goDetail = (it: StockItem) => router.push(`${BASE}/${it.id}`);

  const renderCell = (it: StockItem, key: string) => {
    switch (key) {
      case "sn": return <span className="font-mono text-[12.5px] text-warm-500">{String(it.id).padStart(2, "0")}</span>;
      case "name": return <span className="text-[13.5px] font-bold text-ink whitespace-nowrap">{it.name}</span>;
      case "group": return <div className="flex gap-[5px]">{it.groups.map((g) => <GroupChip key={g} label={g} color={GROUP_COLOR[g] || "#697177"} />)}</div>;
      case "rate": return <span className="text-[13px] font-semibold text-warm-600 tnum whitespace-nowrap">{it.rate}</span>;
      case "opening": return <span className="text-[13px] text-warm-600 tnum whitespace-nowrap">{it.opening} {it.unit}</span>;
      case "stock": return <span className="text-[13px] font-bold text-ink tnum whitespace-nowrap">{Number.isInteger(it.closing) ? it.closing : it.closing.toFixed(1)} {it.unit}</span>;
      case "value": return <span className="text-[13.5px] font-bold text-ink tnum whitespace-nowrap">{it.value}</span>;
      case "status": { const st = STATUS_COLOR[status(it)]; return <Badge color={st.dot}><span style={{ color: st.fg }}>{st.label}</span></Badge>; }
      case "supplier": return <span className="text-[12.5px] text-warm-500 max-w-[116px] inline-block">{it.supplier}</span>;
      case "actions": return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="view" startContent={<Package size={15} color="#8A7D72" />} onPress={() => goDetail(it)}>View details</DropdownItem>
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(it)}>Edit item</DropdownItem>
            <DropdownItem key="reset" startContent={<RotateCcw size={15} color="#8A7D72" />} onPress={() => resetStock(it)}>Reset stock</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color={ORANGE} />} onPress={() => s.setDel({ item: it })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const resetStock = (it: StockItem) => {
    s.setItems((p) => p.map((x) => x.id === it.id ? { ...x, closing: x.opening, valueNum: Math.round(x.opening * x.rateNum), value: "Rs " + Math.round(x.opening * x.rateNum).toLocaleString() } : x));
    s.toast(`"${it.name}" stock reset to full`, "primary");
  };

  const renderCard = (it: StockItem) => {
    const st = STATUS_COLOR[status(it)];
    const c = GROUP_COLOR[it.groups[0]] || "#9A8C80";
    return (
      <div onClick={() => goDetail(it)} className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px] cursor-pointer active:bg-warm-50">
        <div className="flex items-center gap-3">
          <div className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center font-extrabold flex-shrink-0" style={{ background: `${c}14`, border: `1px solid ${c}2E`, color: c, fontSize: 16 }}>
            {it.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-ink">{it.name}</div>
            <div className="flex items-center gap-[7px] mt-[3px]">
              <GroupChip label={it.groups[0]} color={c} />
              <span className="text-[11.5px] text-warm-500">·</span>
              <span className="text-[12px] font-semibold text-warm-500 tnum">{it.rate}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[13px] tnum"><span className="font-bold text-ink">{Number.isInteger(it.closing) ? it.closing : it.closing.toFixed(1)} {it.unit}</span><span className="text-warm-500 font-medium"> of {it.opening} {it.unit}</span></span>
          <Badge color={st.dot}><span style={{ color: st.fg }}>{st.label}</span></Badge>
        </div>
        <div className="mt-[11px] pt-[11px] border-t border-warm-200 flex items-center justify-between">
          <span className="text-[12px] text-warm-500">{it.supplier}</span>
          <span className="text-[15px] font-extrabold text-ink tnum">{it.value}</span>
        </div>
      </div>
    );
  };

  const filterContent = (
    <div className="w-full">
      <div className="px-[14px] py-[10px] border-b border-warm-200 flex justify-between items-center lg:flex hidden">
        <span className="text-[12px] font-bold text-ink">Filter by group</span>
        {groups.length > 0 && <button onClick={() => setGroups([])} className="text-[11.5px] font-semibold" style={{ color: ORANGE }}>Clear</button>}
      </div>
      <div className="p-[6px] flex flex-wrap lg:block gap-2">
        {ALL_GROUPS.map((g) => {
          const on = groups.includes(g); const c = GROUP_COLOR[g];
          return (
            <button key={g} onClick={() => setGroups((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g])}
              className="lg:w-full flex items-center justify-between lg:px-[9px] px-[13px] py-[7px] rounded-lg lg:rounded-lg rounded-full hover:bg-warm-100 lg:border-0 border"
              style={{ borderColor: on ? c : "#E6E1DC", background: on ? `${c}14` : undefined }}>
              <span className="inline-flex items-center gap-2 text-[13px] font-medium" style={{ color: on ? c : "#3F3933" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{g}
              </span>
              {on && <Check size={15} color={ORANGE} className="hidden lg:block" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  const findById = useCallback(
    (id: number) => s.items.find((x) => x.id === id),
    [s.items],
  );

  const ctx: StockItemsCtx = {
    items: s.items,
    findById,
    save: s.save,
    requestEdit: (it) => s.setEditing(it),
    requestDelete: (it) => s.setDel({ item: it }),
    toast: s.toast,
  };

  return (
    <StockItemsContext.Provider value={ctx}>
      <ListScaffold
        state={s}
        title="Stock Items"
        kpis={kpis}
        totalCount={s.items.length}
        columns={COLUMNS}
        renderCell={renderCell}
        renderCard={renderCard}
        onRowOpen={goDetail}
        searchPlaceholder="Search ingredients…"
        statusTabs={statusTabs}
        statusKey={statusTab}
        onStatus={setStatusTab}
        filterContent={filterContent}
        filterCount={groups.length}
        addLabel="Add Item"
        onAdd={() => router.push(`${BASE}/add`)}
        moreActions={[
          { key: "export", label: "Export to Excel", icon: Upload },
          { key: "import", label: "Import items", icon: Download },
          { key: "columns", label: "Manage columns", icon: BarChart3 },
        ]}
        onMore={(k) => s.toast(`${k} — coming soon`, "secondary")}
      />

      {/* edit modal (in-list edit, not URL-driven) */}
      {s.editing !== undefined && s.editing !== null && (
        <AddEditModal item={s.editing} onClose={() => s.setEditing(undefined)} onSave={s.save} />
      )}
      {s.del && (
        <DeleteModal
          label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} stock items`}
          onClose={() => s.setDel(null)}
          onConfirm={() => s.doDelete((it) => `"${it.name}"`)}
        />
      )}

      {children}
    </StockItemsContext.Provider>
  );
}

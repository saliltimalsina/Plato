"use client";

import { useMemo, useState } from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import {
  Layers, Wallet, MoreHorizontal, Eye, Pencil, Trash2, Check, Upload, Download,
} from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { DeleteModal } from "@/components/rms/ModalShell";
import { Badge, ORANGE, KpiData } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import {
  CONSUMPTIONS, CONSUMPTION_TYPES, type Consumption, type ConsumptionType,
} from "@/components/rms/data/consumption";
import { ConsumptionDetail } from "@/components/rms/consumption/ConsumptionDetail";
import { CreateConsumptionModal } from "@/components/rms/consumption/CreateConsumptionModal";

const COLUMNS = [
  { key: "sn", label: "SN" },
  { key: "name", label: "Finished Good", sortable: true },
  { key: "price", label: "Sales Price", sortable: true },
  { key: "type", label: "Type" },
  { key: "cost", label: "Cost", sortable: true, align: "end" as const },
  { key: "itemUsed", label: "Item Used" },
  { key: "actions", label: "", align: "center" as const },
];

const fmtRs = (n: number) => "Rs " + n.toLocaleString();

export default function ConsumptionPage() {
  const [types, setTypes] = useState<ConsumptionType[]>([]);

  const filterPredicate = useMemo(() => (c: Consumption) => {
    return types.length === 0 || types.includes(c.type);
  }, [types]);

  const s = useListState<Consumption>({
    initial: CONSUMPTIONS.map((c) => ({ ...c, stocksUsed: c.stocksUsed.map((x) => ({ ...x })) })),
    searchableText: (c) => `${c.finishedGood} ${c.type} ${c.itemUsed}`,
    sortAccessors: {
      name: (c) => c.finishedGood.toLowerCase(),
      price: (c) => c.salesPriceNum,
      cost: (c) => c.costNum,
    },
    filterPredicate,
  });

  const totalCost = s.items.reduce((a, c) => a + c.costNum, 0);

  const kpis: KpiData[] = [
    { key: "count", icon: Layers, tint: "#E3F6F1", accent: "#1FA98B", label: "Total Consumptions", value: s.items.length, sub: "recipes", delta: "+2", deltaUp: true, sparkData: [2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 7, s.items.length] },
    { key: "cost", icon: Wallet, tint: "#FDECE4", accent: ORANGE, label: "Total Cost", value: fmtRs(totalCost), delta: "+4%", deltaUp: true, sparkData: [40, 42, 44, 46, 48, 50, 52, 54, 55, 56, 57, Math.round(totalCost / 20)] },
  ];

  const renderCell = (c: Consumption, key: string) => {
    switch (key) {
      case "sn": return <span className="font-mono text-[12.5px] text-warm-500">{String(c.id).padStart(2, "0")}</span>;
      case "name": return <span className="text-[13.5px] font-bold text-ink whitespace-nowrap">{c.finishedGood}</span>;
      case "price": return <span className="text-[13px] font-semibold tnum whitespace-nowrap" style={{ color: "#15803D" }}>{c.salesPrice}</span>;
      case "type": return <Badge tone="secondary">{c.type}</Badge>;
      case "cost": return <span className="text-[13.5px] font-bold text-ink tnum whitespace-nowrap">{c.cost}</span>;
      case "itemUsed": return <span className="text-[12.5px] text-warm-500 max-w-[180px] inline-block truncate align-bottom">{c.itemUsed}</span>;
      case "actions": return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="view" startContent={<Eye size={15} color="#8A7D72" />} onPress={() => s.setDetail(c)}>View details</DropdownItem>
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(c)}>Edit</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color={ORANGE} />} onPress={() => s.setDel({ item: c })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (c: Consumption) => (
    <div onClick={() => s.setDetail(c)} className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px] cursor-pointer active:bg-warm-50">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-ink truncate">{c.finishedGood}</div>
          <div className="mt-[5px]"><Badge tone="secondary">{c.type}</Badge></div>
        </div>
        <span className="text-[13px] font-semibold tnum whitespace-nowrap flex-shrink-0" style={{ color: "#15803D" }}>{c.salesPrice}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[12px] text-warm-500 truncate max-w-[200px]">{c.itemUsed}</span>
        <span className="text-[15px] font-extrabold text-ink tnum whitespace-nowrap">{c.cost}</span>
      </div>
    </div>
  );

  const filterContent = (
    <div className="w-full">
      <div className="px-[14px] py-[10px] border-b border-warm-200 flex justify-between items-center lg:flex hidden">
        <span className="text-[12px] font-bold text-ink">Filter by type</span>
        {types.length > 0 && <button onClick={() => setTypes([])} className="text-[11.5px] font-semibold" style={{ color: ORANGE }}>Clear</button>}
      </div>
      <div className="p-[6px] flex flex-wrap lg:block gap-2">
        {CONSUMPTION_TYPES.map((t) => {
          const on = types.includes(t);
          return (
            <button key={t} onClick={() => setTypes((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t])}
              className="lg:w-full flex items-center justify-between lg:px-[9px] px-[13px] py-[7px] rounded-lg lg:rounded-lg rounded-full hover:bg-warm-100 lg:border-0 border"
              style={{ borderColor: on ? ORANGE : "#E6E1DC", background: on ? "#FFF1EB" : undefined }}>
              <span className="inline-flex items-center gap-2 text-[13px] font-medium" style={{ color: on ? ORANGE : "#3F3933" }}>
                {t}
              </span>
              {on && <Check size={15} color={ORANGE} className="hidden lg:block" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s}
        title="Consumption"
        kpis={kpis}
        totalCount={s.items.length}
        columns={COLUMNS}
        renderCell={renderCell}
        renderCard={renderCard}
        onRowOpen={(c) => s.setDetail(c)}
        searchPlaceholder="Search consumptions…"
        filterContent={filterContent}
        filterCount={types.length}
        addLabel="Add New"
        onAdd={() => s.setEditing(null)}
        moreActions={[
          { key: "export", label: "Export to Excel", icon: Upload },
          { key: "import", label: "Import consumptions", icon: Download },
        ]}
        onMore={(k) => s.toast(`${k} — coming soon`, "secondary")}
      />

      {s.editing !== undefined && (
        <CreateConsumptionModal onClose={() => s.setEditing(undefined)} onSave={s.save} />
      )}
      {s.detail && (
        <ConsumptionDetail
          item={s.detail}
          onClose={() => s.setDetail(null)}
          onEdit={(c) => { s.setDetail(null); s.setEditing(c); }}
          onDelete={(c) => s.setDel({ item: c })}
        />
      )}
      {s.del && (
        <DeleteModal
          label={"item" in s.del ? `"${s.del.item.finishedGood}"` : `${s.selected.length} consumptions`}
          onClose={() => s.setDel(null)}
          onConfirm={() => s.doDelete((c) => `"${c.finishedGood}"`)}
        />
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Input, Select, SelectItem,
} from "@heroui/react";
import { Ruler, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import {
  ModalShell, ModalFooterButtons, DeleteModal, labelCx, wrapCx, inputCx,
} from "@/components/rms/ModalShell";
import { Badge, Tone, KpiData } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import { MeasuringUnit, MEASURING_UNITS, UNIT_TYPES } from "@/components/rms/data/inventory";

const COLUMNS = [
  { key: "sn", label: "SN" },
  { key: "name", label: "Name", sortable: true },
  { key: "symbol", label: "Symbol" },
  { key: "type", label: "Type" },
  { key: "actions", label: "", align: "center" as const },
];

const TYPE_TONE: Record<MeasuringUnit["type"], Tone> = {
  Weight: "primary",
  Volume: "secondary",
  Count: "neutral",
};

/* ── create / edit modal ──────────────────────────────────────── */
function UnitModal({
  unit, onClose, onSave,
}: { unit: MeasuringUnit | null; onClose: () => void; onSave: (u: MeasuringUnit) => void }) {
  const [name, setName] = useState(unit?.name ?? "");
  const [symbol, setSymbol] = useState(unit?.symbol ?? "");
  const [type, setType] = useState<MeasuringUnit["type"]>(unit?.type ?? "Weight");

  const valid = name.trim().length > 0;
  const submit = () =>
    onSave({ id: unit?.id ?? 0, name: name.trim(), symbol: symbol.trim(), type });

  return (
    <ModalShell
      title={unit ? "Edit Unit" : "Add Unit"}
      subtitle={unit ? "Update this measuring unit." : "Create a new measuring unit."}
      size="sm"
      onClose={onClose}
      footer={<ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel={unit ? "Save changes" : "Add Unit"} disabled={!valid} />}
    >
      <Input
        label="Name" labelPlacement="outside" placeholder="e.g. Kilogram"
        size="sm" variant="bordered" value={name} onValueChange={setName}
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
      />
      <Input
        label="Symbol" labelPlacement="outside" placeholder="e.g. kg"
        size="sm" variant="bordered" value={symbol} onValueChange={setSymbol}
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
      />
      <Select
        label="Type" labelPlacement="outside" placeholder="Select type"
        size="sm" variant="bordered" selectedKeys={[type]}
        onSelectionChange={(k) => { const v = [...k][0]; if (v) setType(String(v) as MeasuringUnit["type"]); }}
        classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
      >
        {UNIT_TYPES.map((t) => <SelectItem key={t}>{t}</SelectItem>)}
      </Select>
    </ModalShell>
  );
}

export default function MeasuringUnitsPage() {
  const s = useListState<MeasuringUnit>({
    initial: MEASURING_UNITS.map((u) => ({ ...u })),
    searchableText: (u) => `${u.name} ${u.symbol}`,
    sortAccessors: { name: (u) => u.name.toLowerCase() },
  });

  const kpis: KpiData[] = [
    { key: "units", icon: Ruler, tint: "#E3F6F1", accent: "#1FA98B", label: "Total Units", value: s.items.length, sub: "units", delta: "+1", deltaUp: true, sparkData: [2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, s.items.length] },
  ];

  const renderCell = (u: MeasuringUnit, key: string) => {
    switch (key) {
      case "sn": return <span className="font-mono text-[12.5px] text-warm-500">{String(u.id).padStart(2, "0")}</span>;
      case "name": return <span className="text-[13.5px] font-bold text-ink whitespace-nowrap">{u.name}</span>;
      case "symbol": return <Badge tone="neutral"><span className="font-mono">{u.symbol}</span></Badge>;
      case "type": return <Badge tone={TYPE_TONE[u.type]}>{u.type}</Badge>;
      case "actions": return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(u)}>Edit</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color="#F15022" />} onPress={() => s.setDel({ item: u })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (u: MeasuringUnit) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-[15px] font-bold text-ink">{u.name}</div>
          <div className="mt-[6px] flex items-center gap-[7px]">
            <Badge tone="neutral"><span className="font-mono">{u.symbol}</span></Badge>
            <Badge tone={TYPE_TONE[u.type]}>{u.type}</Badge>
          </div>
        </div>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-8 h-8 min-w-8"><MoreHorizontal size={18} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(u)}>Edit</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color="#F15022" />} onPress={() => s.setDel({ item: u })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s}
        title="Measuring Units"
        kpis={kpis}
        totalCount={s.items.length}
        columns={COLUMNS}
        renderCell={renderCell}
        renderCard={renderCard}
        searchPlaceholder="Search units…"
        addLabel="Add Unit"
        onAdd={() => s.setEditing(null)}
      />

      {s.editing !== undefined && <UnitModal unit={s.editing} onClose={() => s.setEditing(undefined)} onSave={s.save} />}
      {s.del && <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} units`} onClose={() => s.setDel(null)} onConfirm={() => s.doDelete((u) => `"${u.name}"`)} />}
    </>
  );
}

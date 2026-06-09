"use client";

import { useState } from "react";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Input, Textarea,
} from "@heroui/react";
import { Ruler, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import {
  ModalShell, ModalFooterButtons, DeleteModal, labelCx, wrapCx, inputCx,
} from "@/components/rms/ModalShell";
import { KpiData } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import { MeasuringUnit, MEASURING_UNITS } from "@/components/rms/data/inventory";

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;

const COLUMNS = [
  { key: "sn", label: "SN" },
  { key: "symbol", label: "Short Name", sortable: true },
  { key: "name", label: "Unit Name", sortable: true },
  { key: "description", label: "Description" },
  { key: "actions", label: "", align: "center" as const },
];

/* ── create / edit modal ──────────────────────────────────────── */
function UnitModal({
  unit, onClose, onSave,
}: { unit: MeasuringUnit | null; onClose: () => void; onSave: (u: MeasuringUnit) => void }) {
  const [name, setName] = useState(unit?.name ?? "");
  const [symbol, setSymbol] = useState(unit?.symbol ?? "");
  const [description, setDescription] = useState(unit?.description ?? "");

  const valid = name.trim().length > 0 && symbol.trim().length > 0;
  const submit = () =>
    onSave({
      id: unit?.id ?? 0,
      name: name.trim(),
      symbol: symbol.trim(),
      type: unit?.type ?? "Weight",
      description: description.trim(),
    });

  const reset = () => { setName(unit?.name ?? ""); setSymbol(unit?.symbol ?? ""); setDescription(unit?.description ?? ""); };

  return (
    <ModalShell
      title={unit ? "Edit Measuring Unit" : "Create Measuring Unit"}
      size="lg"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={reset}>
            Reset
          </Button>
          <ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel={unit ? "Save changes" : "Save Measuring Unit"} disabled={!valid} />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          autoFocus
          label={<>Measuring Unit<Req /></>}
          labelPlacement="outside"
          placeholder="Enter unit, eg: Kilogram, Litre, Pieces"
          size="sm" variant="bordered" value={name} onValueChange={setName}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
        <Input
          label={<>Short Name<Req /></>}
          labelPlacement="outside"
          placeholder="Enter short name, eg: kg, l, pcs"
          size="sm" variant="bordered" value={symbol} onValueChange={setSymbol}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
      </div>
      <Textarea
        label="Description" labelPlacement="outside"
        placeholder="Enter description"
        minRows={2} maxLength={200}
        value={description} onValueChange={setDescription}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: `${wrapCx} h-auto min-h-[64px]`, input: inputCx }}
      />
    </ModalShell>
  );
}

export default function MeasuringUnitsPage() {
  const s = useListState<MeasuringUnit>({
    initial: MEASURING_UNITS.map((u) => ({ ...u })),
    searchableText: (u) => `${u.name} ${u.symbol} ${u.description ?? ""}`,
    sortAccessors: { name: (u) => u.name.toLowerCase(), symbol: (u) => u.symbol.toLowerCase() },
  });

  const kpis: KpiData[] = [
    { key: "units", icon: Ruler, tint: "#E3F6F1", accent: "#1FA98B", label: "Total Units", value: s.items.length, sub: "units", delta: "+1", deltaUp: true, sparkData: [2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, s.items.length] },
  ];

  const renderCell = (u: MeasuringUnit, key: string) => {
    switch (key) {
      case "sn": return <span className="font-mono text-[12.5px] text-warm-500">{u.id}</span>;
      case "symbol": return <span className="font-mono text-[13px] font-semibold text-ink">{u.symbol}</span>;
      case "name": return <span className="text-[13.5px] font-semibold text-ink whitespace-nowrap">{u.name}</span>;
      case "description": return (
        <span className="text-[12.5px] text-warm-600 line-clamp-1 max-w-[520px]">
          {u.description?.trim() || <span className="text-warm-400">—</span>}
        </span>
      );
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
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[13px] font-bold text-ink">{u.symbol}</span>
            <span className="text-warm-300">·</span>
            <span className="text-[14px] font-semibold text-ink">{u.name}</span>
          </div>
          {u.description?.trim() && (
            <div className="mt-1 text-[12px] text-warm-600 line-clamp-2">{u.description}</div>
          )}
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
        title="Measuring Unit"
        kpis={kpis}
        totalCount={s.items.length}
        columns={COLUMNS}
        renderCell={renderCell}
        renderCard={renderCard}
        searchPlaceholder="Search units…"
        addLabel="Add New"
        onAdd={() => s.setEditing(null)}
      />

      {s.editing !== undefined && <UnitModal unit={s.editing} onClose={() => s.setEditing(undefined)} onSave={s.save} />}
      {s.del && <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} units`} onClose={() => s.setDel(null)} onConfirm={() => s.doDelete((u) => `"${u.name}"`)} />}
    </>
  );
}

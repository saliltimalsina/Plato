"use client";

import { useState } from "react";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input,
} from "@heroui/react";
import { Layers, MoreHorizontal, Pencil, Trash2, Check } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import {
  ModalShell, ModalFooterButtons, DeleteModal, labelCx, wrapCx, inputCx,
} from "@/components/rms/ModalShell";
import { KpiData } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import { StockGroupRow, STOCK_GROUPS, GROUP_COLORS } from "@/components/rms/data/inventory";

const COLUMNS = [
  { key: "sn", label: "SN" },
  { key: "name", label: "Name", sortable: true },
  { key: "color", label: "Color" },
  { key: "items", label: "Items", sortable: true, align: "end" as const },
  { key: "actions", label: "", align: "center" as const },
];

/* ── create / edit modal ──────────────────────────────────────── */
function GroupModal({
  group, onClose, onSave,
}: { group: StockGroupRow | null; onClose: () => void; onSave: (g: StockGroupRow) => void }) {
  const [name, setName] = useState(group?.name ?? "");
  const [color, setColor] = useState(group?.color ?? GROUP_COLORS[0]);

  const valid = name.trim().length > 0;
  const submit = () =>
    onSave({ id: group?.id ?? 0, name: name.trim(), color, itemCount: group?.itemCount ?? 0 });

  return (
    <ModalShell
      title={group ? "Edit Group" : "Add Group"}
      subtitle={group ? "Update this stock group." : "Create a new stock group."}
      size="sm"
      onClose={onClose}
      footer={<ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel={group ? "Save changes" : "Add Group"} disabled={!valid} />}
    >
      <Input
        label="Name" labelPlacement="outside" placeholder="e.g. Vegetable"
        size="sm" variant="bordered" value={name} onValueChange={setName}
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
      />
      <div className="flex flex-col gap-[7px]">
        <span className={labelCx}>Color</span>
        <div className="flex flex-wrap gap-[10px]">
          {GROUP_COLORS.map((c) => {
            const on = c === color;
            return (
              <button
                key={c} type="button" onClick={() => setColor(c)}
                className="w-8 h-8 rounded-[10px] flex items-center justify-center transition-transform active:scale-95"
                style={{ background: c, border: on ? "2px solid #fff" : "2px solid transparent", boxShadow: on ? `0 0 0 2px ${c}` : "none" }}
                aria-label={c}
              >
                {on && <Check size={16} color="#fff" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>
    </ModalShell>
  );
}

export default function StockGroupsPage() {
  const s = useListState<StockGroupRow>({
    initial: STOCK_GROUPS.map((g) => ({ ...g })),
    searchableText: (g) => g.name,
    sortAccessors: { name: (g) => g.name.toLowerCase(), items: (g) => g.itemCount },
  });

  const kpis: KpiData[] = [
    { key: "groups", icon: Layers, tint: "#F3ECFF", accent: "#9B51E0", label: "Total Groups", value: s.items.length, sub: "groups", delta: "+1", deltaUp: true, sparkData: [2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, s.items.length] },
  ];

  const renderCell = (g: StockGroupRow, key: string) => {
    switch (key) {
      case "sn": return <span className="font-mono text-[12.5px] text-warm-500">{String(g.id).padStart(2, "0")}</span>;
      case "name": return (
        <span className="inline-flex items-center gap-[8px] text-[13.5px] font-bold text-ink whitespace-nowrap">
          <span className="w-[9px] h-[9px] rounded-full flex-shrink-0" style={{ background: g.color }} />{g.name}
        </span>
      );
      case "color": return (
        <span className="inline-flex items-center gap-[7px]">
          <span className="w-[18px] h-[18px] rounded-[6px] flex-shrink-0" style={{ background: g.color, border: "1px solid rgba(0,0,0,0.06)" }} />
          <span className="font-mono text-[12.5px] text-warm-600 uppercase">{g.color}</span>
        </span>
      );
      case "items": return <span className="text-[13px] font-bold text-ink tnum">{g.itemCount}</span>;
      case "actions": return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(g)}>Edit</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color="#F15022" />} onPress={() => s.setDel({ item: g })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (g: StockGroupRow) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]">
      <div className="flex items-center gap-3">
        <div className="w-[42px] h-[42px] rounded-[12px] flex-shrink-0" style={{ background: `${g.color}14`, border: `1px solid ${g.color}2E` }}>
          <div className="w-full h-full flex items-center justify-center">
            <span className="w-[16px] h-[16px] rounded-[6px]" style={{ background: g.color }} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-ink">{g.name}</div>
          <div className="mt-[2px] flex items-center gap-[7px] text-[12px] text-warm-500">
            <span className="font-mono uppercase">{g.color}</span>
            <span>·</span>
            <span className="font-semibold tnum">{g.itemCount} items</span>
          </div>
        </div>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-8 h-8 min-w-8"><MoreHorizontal size={18} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(g)}>Edit</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color="#F15022" />} onPress={() => s.setDel({ item: g })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s}
        title="Stock Groups"
        kpis={kpis}
        totalCount={s.items.length}
        columns={COLUMNS}
        renderCell={renderCell}
        renderCard={renderCard}
        searchPlaceholder="Search groups…"
        addLabel="Add Group"
        onAdd={() => s.setEditing(null)}
      />

      {s.editing !== undefined && <GroupModal group={s.editing} onClose={() => s.setEditing(undefined)} onSave={s.save} />}
      {s.del && <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} groups`} onClose={() => s.setDel(null)} onConfirm={() => s.doDelete((g) => `"${g.name}"`)} />}
    </>
  );
}

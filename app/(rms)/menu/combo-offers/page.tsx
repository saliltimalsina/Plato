"use client";

import { useState } from "react";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input, Textarea,
} from "@heroui/react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { ModalShell, ModalFooterButtons, DeleteModal, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { useListState } from "@/components/rms/useListState";
import { Combo, COMBOS } from "@/components/rms/data/menu";

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;

const COLUMNS = [
  { key: "sn",          label: "SN" },
  { key: "name",        label: "Combo Name", sortable: true },
  { key: "items",       label: "Items",   align: "end" as const },
  { key: "price",       label: "Price",   align: "end" as const, sortable: true },
  { key: "description", label: "Description" },
  { key: "actions",     label: "", align: "center" as const },
];

function ComboModal({
  combo, onClose, onSave,
}: { combo: Combo | null; onClose: () => void; onSave: (c: Combo) => void }) {
  const [name, setName] = useState(combo?.name ?? "");
  const [price, setPrice] = useState(combo ? String(combo.price) : "");
  const [items, setItems] = useState(combo ? String(combo.items) : "");
  const [description, setDescription] = useState(combo?.description ?? "");
  const valid = name.trim().length > 0 && Number(price) >= 0 && Number(items) >= 0;
  const submit = () => onSave({ id: combo?.id ?? 0, name: name.trim(), price: Number(price), items: Number(items), description: description.trim() });
  const reset = () => {
    setName(combo?.name ?? ""); setPrice(combo ? String(combo.price) : "");
    setItems(combo ? String(combo.items) : ""); setDescription(combo?.description ?? "");
  };
  return (
    <ModalShell
      title={combo ? "Edit Combo Offer" : "Create Combo Offer"} size="lg" onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={reset}>Reset</Button>
          <ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel={combo ? "Save changes" : "Save Combo"} disabled={!valid} />
        </div>
      }
    >
      <Input autoFocus label={<>Combo Name<Req /></>} labelPlacement="outside" placeholder="e.g. Burger + Coke"
        size="sm" variant="bordered" value={name} onValueChange={setName}
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
      <div className="grid grid-cols-2 gap-4">
        <Input label={<>Items<Req /></>} labelPlacement="outside" placeholder="0" type="number"
          size="sm" variant="bordered" value={items} onValueChange={setItems}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }} />
        <Input label={<>Price<Req /></>} labelPlacement="outside" placeholder="0" type="number"
          size="sm" variant="bordered" value={price} onValueChange={setPrice}
          startContent={<span className="text-[13px] text-warm-500 font-semibold">Rs</span>}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }} />
      </div>
      <Textarea label="Description" labelPlacement="outside" placeholder="Enter description"
        minRows={3} maxLength={240} value={description} onValueChange={setDescription}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: `${wrapCx} h-auto min-h-[88px]`, input: inputCx }} />
    </ModalShell>
  );
}

export default function CombosPage() {
  const s = useListState<Combo>({
    initial: COMBOS.map((c) => ({ ...c })),
    searchableText: (c) => `${c.name} ${c.description ?? ""}`,
    sortAccessors: { name: (c) => c.name.toLowerCase(), price: (c) => c.price },
  });

  const renderCell = (c: Combo, key: string) => {
    switch (key) {
      case "sn":          return <span className="font-mono text-[12.5px] text-warm-500">{c.id}</span>;
      case "name":        return <span className="text-[13.5px] font-semibold text-ink whitespace-nowrap">{c.name}</span>;
      case "items":       return <span className="text-[13px] text-warm-700 tnum">{c.items}</span>;
      case "price":       return <span className="text-[13px] font-bold tnum" style={{ color: "#15803D" }}>Rs {c.price}</span>;
      case "description": return <span className="text-[12.5px] text-warm-600 line-clamp-1 max-w-[520px]">{c.description?.trim() || <span className="text-warm-400">—</span>}</span>;
      case "actions":     return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(c)}>Edit</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color="#F15022" />} onPress={() => s.setDel({ item: c })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (c: Combo) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[14.5px] font-bold text-ink">{c.name}</div>
          {c.description?.trim() && <div className="mt-1 text-[12px] text-warm-600 line-clamp-2">{c.description}</div>}
        </div>
        <div className="text-right">
          <div className="text-[13px] font-bold tnum" style={{ color: "#15803D" }}>Rs {c.price}</div>
          <div className="text-[11.5px] text-warm-500 tnum">{c.items} items</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s} title="Combo Offer" totalCount={s.items.length}
        columns={COLUMNS} renderCell={renderCell} renderCard={renderCard}
        searchPlaceholder="Search combos…" addLabel="Add New" onAdd={() => s.setEditing(null)}
      />
      {s.editing !== undefined && <ComboModal combo={s.editing} onClose={() => s.setEditing(undefined)} onSave={s.save} />}
      {s.del && <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} combos`} onClose={() => s.setDel(null)} onConfirm={() => s.doDelete((c) => `"${c.name}"`)} />}
    </>
  );
}

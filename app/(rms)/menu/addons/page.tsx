"use client";

import { useState } from "react";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input,
} from "@heroui/react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { ModalShell, ModalFooterButtons, DeleteModal, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { useListState } from "@/components/rms/useListState";
import { Addon, ADDONS } from "@/components/rms/data/menu";

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;

const COLUMNS = [
  { key: "sn",       label: "SN" },
  { key: "name",     label: "Add-On Name", sortable: true },
  { key: "category", label: "Category" },
  { key: "price",    label: "Price", align: "end" as const, sortable: true },
  { key: "actions",  label: "", align: "center" as const },
];

function AddonModal({
  addon, onClose, onSave,
}: { addon: Addon | null; onClose: () => void; onSave: (a: Addon) => void }) {
  const [name, setName] = useState(addon?.name ?? "");
  const [category, setCategory] = useState(addon?.category ?? "");
  const [price, setPrice] = useState(addon ? String(addon.price) : "");
  const valid = name.trim().length > 0 && Number(price) >= 0;
  const submit = () => onSave({ id: addon?.id ?? 0, name: name.trim(), category: category.trim(), price: Number(price) });
  const reset = () => { setName(addon?.name ?? ""); setCategory(addon?.category ?? ""); setPrice(addon ? String(addon.price) : ""); };
  return (
    <ModalShell
      title={addon ? "Edit Add-On" : "Create Add-On"} size="lg" onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={reset}>Reset</Button>
          <ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel={addon ? "Save changes" : "Save Add-On"} disabled={!valid} />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input autoFocus label={<>Add-On Name<Req /></>} labelPlacement="outside" placeholder="e.g. Extra Cheese"
          size="sm" variant="bordered" value={name} onValueChange={setName}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
        <Input label="Category" labelPlacement="outside" placeholder="e.g. Topping"
          size="sm" variant="bordered" value={category} onValueChange={setCategory}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
      </div>
      <Input label={<>Price<Req /></>} labelPlacement="outside" placeholder="0" type="number"
        size="sm" variant="bordered" value={price} onValueChange={setPrice}
        startContent={<span className="text-[13px] text-warm-500 font-semibold">Rs</span>}
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }} />
    </ModalShell>
  );
}

export default function AddonsPage() {
  const s = useListState<Addon>({
    initial: ADDONS.map((a) => ({ ...a })),
    searchableText: (a) => `${a.name} ${a.category ?? ""}`,
    sortAccessors: { name: (a) => a.name.toLowerCase(), price: (a) => a.price },
  });

  const renderCell = (a: Addon, key: string) => {
    switch (key) {
      case "sn":       return <span className="font-mono text-[12.5px] text-warm-500">{a.id}</span>;
      case "name":     return <span className="text-[13.5px] font-semibold text-ink whitespace-nowrap">{a.name}</span>;
      case "category": return <span className="text-[13px] text-warm-700">{a.category ?? <span className="text-warm-400">—</span>}</span>;
      case "price":    return <span className="text-[13px] font-bold tnum" style={{ color: "#15803D" }}>Rs {a.price}</span>;
      case "actions":  return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(a)}>Edit</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color="#F15022" />} onPress={() => s.setDel({ item: a })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (a: Addon) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[14.5px] font-bold text-ink">{a.name}</div>
          {a.category && <div className="mt-1 text-[12px] text-warm-500">{a.category}</div>}
        </div>
        <span className="text-[13px] font-bold tnum" style={{ color: "#15803D" }}>Rs {a.price}</span>
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s} title="Add-Ons & Extras" totalCount={s.items.length}
        columns={COLUMNS} renderCell={renderCell} renderCard={renderCard}
        searchPlaceholder="Search add-ons…" addLabel="Add New" onAdd={() => s.setEditing(null)}
      />
      {s.editing !== undefined && <AddonModal addon={s.editing} onClose={() => s.setEditing(undefined)} onSave={s.save} />}
      {s.del && <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} add-ons`} onClose={() => s.setDel(null)} onConfirm={() => s.doDelete((a) => `"${a.name}"`)} />}
    </>
  );
}

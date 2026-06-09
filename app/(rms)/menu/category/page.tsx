"use client";

import { useState } from "react";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input, Textarea,
} from "@heroui/react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { ModalShell, ModalFooterButtons, DeleteModal, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { useListState } from "@/components/rms/useListState";
import { Category, CATEGORIES } from "@/components/rms/data/menu";

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;

const COLUMNS = [
  { key: "sn",          label: "SN" },
  { key: "name",        label: "Category Name", sortable: true },
  { key: "dishCount",   label: "No of Dish", sortable: true },
  { key: "description", label: "Description" },
  { key: "actions",     label: "", align: "center" as const },
];

function CategoryModal({
  category, onClose, onSave,
}: { category: Category | null; onClose: () => void; onSave: (c: Category) => void }) {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const valid = name.trim().length > 0;
  const submit = () => onSave({ id: category?.id ?? 0, name: name.trim(), dishCount: category?.dishCount ?? 0, description: description.trim() });
  const reset = () => { setName(category?.name ?? ""); setDescription(category?.description ?? ""); };
  return (
    <ModalShell
      title={category ? "Edit Category" : "Create Category"} size="lg" onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={reset}>Reset</Button>
          <ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel={category ? "Save changes" : "Save Category"} disabled={!valid} />
        </div>
      }
    >
      <Input autoFocus label={<>Category Name<Req /></>} labelPlacement="outside" placeholder="Enter category name"
        size="sm" variant="bordered" value={name} onValueChange={setName}
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
      <Textarea label="Description" labelPlacement="outside" placeholder="Enter description"
        minRows={3} maxLength={240} value={description} onValueChange={setDescription}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: `${wrapCx} h-auto min-h-[88px]`, input: inputCx }} />
    </ModalShell>
  );
}

export default function CategoryPage() {
  const s = useListState<Category>({
    initial: CATEGORIES.map((c) => ({ ...c })),
    searchableText: (c) => `${c.name} ${c.description ?? ""}`,
    sortAccessors: { name: (c) => c.name.toLowerCase(), dishCount: (c) => c.dishCount },
  });

  const renderCell = (c: Category, key: string) => {
    switch (key) {
      case "sn":          return <span className="font-mono text-[12.5px] text-warm-500">{c.id}</span>;
      case "name":        return <span className="text-[13.5px] font-semibold text-ink whitespace-nowrap">{c.name}</span>;
      case "dishCount":   return <span className="text-[13px] font-bold text-ink tnum">{c.dishCount}</span>;
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

  const renderCard = (c: Category) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[14.5px] font-bold text-ink">{c.name}</div>
          {c.description?.trim() && <div className="mt-1 text-[12px] text-warm-600 line-clamp-2">{c.description}</div>}
        </div>
        <span className="text-[12px] font-semibold text-warm-500 tnum">{c.dishCount} dishes</span>
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s} title="Category" totalCount={s.items.length}
        columns={COLUMNS} renderCell={renderCell} renderCard={renderCard}
        searchPlaceholder="Search categories…" addLabel="Add New" onAdd={() => s.setEditing(null)}
      />
      {s.editing !== undefined && <CategoryModal category={s.editing} onClose={() => s.setEditing(undefined)} onSave={s.save} />}
      {s.del && <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} categories`} onClose={() => s.setDel(null)} onConfirm={() => s.doDelete((c) => `"${c.name}"`)} />}
    </>
  );
}

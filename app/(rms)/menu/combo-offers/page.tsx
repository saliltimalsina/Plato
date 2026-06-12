"use client";

import { useRouter } from "next/navigation";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Switch,
} from "@heroui/react";
import { MoreHorizontal, Pencil, Trash2, Plus, FileText } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { DeleteModal } from "@/components/rms/ModalShell";
import { ORANGE } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import { Combo, COMBOS } from "@/components/rms/data/menu";

const COLUMNS = [
  { key: "sn",        label: "SN" },
  { key: "name",      label: "Combo Name", sortable: true },
  { key: "prepTime",  label: "Preparation Time" },
  { key: "category",  label: "Category", sortable: true },
  { key: "type",      label: "Type" },
  { key: "subMenu",   label: "Sub Menu", sortable: true },
  { key: "kotType",   label: "KOT Type" },
  { key: "price",     label: "Price", align: "end" as const, sortable: true },
  { key: "available", label: "Available", align: "center" as const },
  { key: "actions",   label: "", align: "center" as const },
];

export default function CombosPage() {
  const router = useRouter();
  const s = useListState<Combo>({
    initial: COMBOS.map((c) => ({ ...c })),
    searchableText: (c) => `${c.name} ${c.description ?? ""} ${c.category ?? ""} ${c.subMenu ?? ""}`,
    sortAccessors: {
      name: (c) => c.name.toLowerCase(),
      price: (c) => c.price,
      category: (c) => (c.category ?? "").toLowerCase(),
      subMenu: (c) => (c.subMenu ?? "").toLowerCase(),
    },
  });

  const toggleAvailable = (c: Combo, v: boolean) => s.save({ ...c, available: v });

  const renderCell = (c: Combo, key: string) => {
    switch (key) {
      case "sn":          return <span className="font-mono text-[12.5px] text-warm-500">{c.id}</span>;
      case "name":        return (
        <button onClick={() => s.setEditing(c)}
          className="inline-flex items-center gap-2 text-left hover:text-[#F15022] transition-colors">
          <span className="w-7 h-7 rounded-[8px] bg-warm-100 flex items-center justify-center text-[14px] flex-shrink-0">{c.emoji ?? "🍱"}</span>
          <span className="text-[13.5px] font-semibold text-ink whitespace-nowrap">{c.name}</span>
        </button>
      );
      case "prepTime":    return <span className="text-[13px] text-warm-700">{c.prepTime ?? <span className="text-warm-400">—</span>}</span>;
      case "category":    return <span className="text-[13px] text-warm-700">{c.category ?? <span className="text-warm-400">—</span>}</span>;
      case "type":        return <span className="text-[13px] text-warm-700">{c.type ?? <span className="text-warm-400">—</span>}</span>;
      case "subMenu":     return <span className="text-[13px] text-warm-700">{c.subMenu ?? <span className="text-warm-400">—</span>}</span>;
      case "kotType":     return <span className="text-[13px] text-warm-700">{c.kotType ?? <span className="text-warm-400">—</span>}</span>;
      case "price":       return <span className="text-[13px] font-bold tnum" style={{ color: "#15803D" }}>Rs {c.price}</span>;
      case "available":   return (
        <Switch
          isSelected={c.available ?? true}
          onValueChange={(v) => toggleAvailable(c, v)}
          size="sm"
          classNames={{ wrapper: "group-data-[selected=true]:bg-[#F15022]" }}
          aria-label="Available"
        />
      );
      case "actions":     return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => router.push(`/menu/combo-offers/${c.id}`)}>Edit Combo</DropdownItem>
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

  const emptyIcon = (
    <div className="w-[88px] h-[88px] rounded-full bg-warm-100 inline-flex items-center justify-center mb-3">
      <FileText size={36} color="#7C6F62" />
    </div>
  );

  const emptyAction = (
    <Button size="sm" radius="md" className="h-9 text-white font-bold"
      style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
      startContent={<Plus size={16} color="#fff" strokeWidth={2.4} />}
      onPress={() => router.push("/menu/combo-offers/new")}>
      Add New
    </Button>
  );

  return (
    <>
      <ListScaffold
        state={s} title="Combo Offer" totalCount={s.items.length}
        columns={COLUMNS} renderCell={renderCell} renderCard={renderCard}
        searchPlaceholder="Search combos…"
        addLabel="Add New" onAdd={() => router.push("/menu/combo-offers/new")}
        emptyTitle="No Combo Offer found"
        emptyHint="Create a new Combo Offer."
        emptyIcon={emptyIcon}
        emptyAction={emptyAction}
      />
      {s.del && <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} combos`} onClose={() => s.setDel(null)} onConfirm={() => s.doDelete((c) => `"${c.name}"`)} />}
    </>
  );
}

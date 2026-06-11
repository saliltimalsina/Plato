"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input, Textarea,
} from "@heroui/react";
import { MoreHorizontal, Pencil, Trash2, Eye, Layers, Star, Calculator, EyeOff } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { ModalShell, ModalFooterButtons, DeleteModal, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { KpiData, ORANGE } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import { SubMenu, SUB_MENUS, DISHES, MENU_SETS } from "@/components/rms/data/menu";

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;

const COLUMNS = [
  { key: "sn",        label: "SN" },
  { key: "name",      label: "Sub Menu Name", sortable: true },
  { key: "active",    label: "Active Dishes", sortable: true },
  { key: "usedIn",    label: "Used In" },
  { key: "actions",   label: "", align: "center" as const },
];

function SubMenuModal({
  sub, onClose, onSave,
}: { sub: SubMenu | null; onClose: () => void; onSave: (m: SubMenu) => void }) {
  const [name, setName] = useState(sub?.name ?? "");
  const [description, setDescription] = useState(sub?.description ?? "");
  const valid = name.trim().length > 0;
  const submit = () => onSave({
    id: sub?.id ?? 0,
    name: name.trim(),
    emoji: sub?.emoji ?? "🍽️",
    dishCount: sub?.dishCount ?? 0,
    description: description.trim(),
  });
  const reset = () => { setName(sub?.name ?? ""); setDescription(sub?.description ?? ""); };
  return (
    <ModalShell
      title={sub ? "Edit Sub Menu" : "Create Sub Menu"} size="lg" onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={reset}>Reset</Button>
          <ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel={sub ? "Save changes" : "Save Sub Menu"} disabled={!valid} />
        </div>
      }
    >
      <Input autoFocus label={<>Sub Menu Name<Req /></>} labelPlacement="outside" placeholder="Enter sub menu name"
        size="sm" variant="bordered" value={name} onValueChange={setName}
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
      <Textarea label="Description" labelPlacement="outside" placeholder="Enter description"
        minRows={3} maxLength={240} value={description} onValueChange={setDescription}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: `${wrapCx} h-auto min-h-[88px]`, input: inputCx }} />
    </ModalShell>
  );
}

/* runtime helpers — counts derived from live data */
const activeDishCount = (m: SubMenu) =>
  DISHES.filter((d) => d.subMenu === m.name && d.available).length;
const usedInMenuSets = (_m: SubMenu) =>
  // every menu-set treats all sub-menus as eligible; mock value mirrors that
  MENU_SETS.length > 0 ? 1 : 0;

export default function SubMenusPage() {
  const router = useRouter();
  const s = useListState<SubMenu>({
    initial: SUB_MENUS.map((m) => ({ ...m })),
    searchableText: (m) => `${m.name} ${m.description ?? ""}`,
    sortAccessors: {
      name: (m) => m.name.toLowerCase(),
      active: (m) => activeDishCount(m),
    },
  });

  const openDetail = (m: SubMenu) => router.push(`/menu/sub-menus/${m.id}`);

  /* KPIs */
  const activeCount = s.items.filter((m) => activeDishCount(m) > 0).length;
  const topSold = useMemo(() => {
    let top: SubMenu | null = null;
    let topN = -1;
    for (const m of s.items) {
      const n = activeDishCount(m);
      if (n > topN) { top = m; topN = n; }
    }
    return { name: top?.name ?? "—", orders: topN > 0 ? topN : 0 };
  }, [s.items]);
  const avgDishes = s.items.length
    ? Math.round(s.items.reduce((a, m) => a + activeDishCount(m), 0) / s.items.length)
    : 0;
  const unused = s.items.filter((m) => activeDishCount(m) === 0).length;

  const kpis: KpiData[] = [
    { key: "total", icon: Layers, tint: "#E3F6F1", accent: "#1FA98B",
      label: "Total", value: `${activeCount}/${s.items.length}`,
      delta: `${activeCount} Active`, deltaUp: true,
      sparkData: [2, 3, 3, 4, 4, 4, 5, 5, 5, 6, 7, activeCount] },
    { key: "top", icon: Star, tint: "#FEF3E2", accent: "#F59E0B",
      label: "Top Sold", value: topSold.name,
      sub: `${topSold.orders} dishes`,
      sparkData: [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, Math.max(1, topSold.orders)] },
    { key: "avg", icon: Calculator, tint: "#F3ECFF", accent: "#9B51E0",
      label: "Avg. Dishes Per Sub Menu", value: avgDishes,
      sparkData: [1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, avgDishes] },
    { key: "unused", icon: EyeOff, tint: "#FDECE4", accent: ORANGE,
      label: "Unused Sub Menu", value: unused,
      sparkData: [0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, Math.max(0, unused)] },
  ];

  const renderCell = (m: SubMenu, key: string) => {
    switch (key) {
      case "sn":     return <span className="font-mono text-[12.5px] text-warm-500">{m.id}</span>;
      case "name":   return (
        <button onClick={() => openDetail(m)}
          className="inline-flex items-center gap-2 min-w-0 text-left hover:text-[#F15022] transition-colors">
          <span className="w-7 h-7 rounded-[8px] bg-warm-100 flex items-center justify-center text-[14px] flex-shrink-0">{m.emoji}</span>
          <span className="text-[13.5px] font-semibold text-ink whitespace-nowrap">{m.name}</span>
        </button>
      );
      case "active": return <span className="text-[13px] font-bold text-ink tnum">{activeDishCount(m)} Dishes</span>;
      case "usedIn": return <span className="text-[13px] font-semibold text-warm-700">{usedInMenuSets(m)} Menu Sets</span>;
      case "actions": return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="view" startContent={<Eye size={15} color="#8A7D72" />} onPress={() => openDetail(m)}>View</DropdownItem>
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(m)}>Edit</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color="#F15022" />} onPress={() => s.setDel({ item: m })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (m: SubMenu) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px] cursor-pointer active:bg-warm-50"
      onClick={() => openDetail(m)}>
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-[10px] bg-warm-100 flex items-center justify-center text-[18px] flex-shrink-0">{m.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[14.5px] font-bold text-ink">{m.name}</span>
            <span className="text-[12px] font-semibold text-warm-500 tnum">{activeDishCount(m)} dishes</span>
          </div>
          <div className="mt-1 text-[12px] text-warm-600">{usedInMenuSets(m)} Menu Sets</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s} title="Sub Menu" totalCount={s.items.length}
        kpis={kpis}
        columns={COLUMNS} renderCell={renderCell} renderCard={renderCard}
        onRowOpen={openDetail}
        searchPlaceholder="Search sub menus…" addLabel="Add New" onAdd={() => s.setEditing(null)}
      />
      {s.editing !== undefined && <SubMenuModal sub={s.editing} onClose={() => s.setEditing(undefined)} onSave={s.save} />}
      {s.del && <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} sub menus`} onClose={() => s.setDel(null)} onConfirm={() => s.doDelete((m) => `"${m.name}"`)} />}
    </>
  );
}

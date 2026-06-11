"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Switch,
  Select, SelectItem,
} from "@heroui/react";
import { Utensils, Star, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { DeleteModal, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { KpiData, Badge, ORANGE } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import { Dish, DISHES, DISH_TYPE_COLOR, priceLabel, DishType } from "@/components/rms/data/menu";
import { DishDetailDrawer } from "@/components/menu/DishDetailDrawer";

const DISH_TYPE_FILTERS: ("All" | DishType)[] = [
  "All", "Veg", "Non-Veg", "Egg", "Vegan", "Spicy", "Halal", "Sugar Free", "Gluten Free",
];

const COLUMNS = [
  { key: "sn",        label: "SN" },
  { key: "name",      label: "Dish Name", sortable: true },
  { key: "price",     label: "Price" },
  { key: "category",  label: "Category", sortable: true },
  { key: "type",      label: "Type" },
  { key: "subMenu",   label: "Sub Menu", sortable: true },
  { key: "prepTime",  label: "Preparation Time" },
  { key: "kotType",   label: "KOT Type" },
  { key: "available", label: "Available", align: "center" as const },
  { key: "actions",   label: "", align: "center" as const },
];

export default function DishesPage() {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState<"All" | DishType>("All");
  const [viewing, setViewing] = useState<Dish | null>(null);

  const filterPredicate = useMemo(
    () => (d: Dish) =>
      typeFilter === "All" || d.type === typeFilter || d.variants.some((v) => v.type === typeFilter),
    [typeFilter],
  );

  const s = useListState<Dish>({
    initial: DISHES.map((d) => ({ ...d })),
    searchableText: (d) => `${d.name} ${d.category} ${d.subMenu} ${d.type}`,
    sortAccessors: {
      name: (d) => d.name.toLowerCase(),
      category: (d) => d.category.toLowerCase(),
      subMenu: (d) => d.subMenu.toLowerCase(),
    },
    filterPredicate,
  });

  const active = s.items.filter((d) => d.available).length;
  const topType = useMemo(() => {
    const counts: Partial<Record<DishType, number>> = {};
    for (const d of s.items) {
      const k = d.type === "-" ? (d.variants[0]?.type ?? "-") : d.type;
      counts[k] = (counts[k] ?? 0) + 1;
    }
    const e = Object.entries(counts).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))[0];
    return { name: (e?.[0] as DishType) ?? "—", count: e?.[1] ?? 0 };
  }, [s.items]);

  const kpis: KpiData[] = [
    {
      key: "total", icon: Utensils, tint: "#E3F6F1", accent: "#1FA98B",
      label: "Total", value: `${s.items.length}/1000`,
      delta: `${active} Active`, deltaUp: true,
      sparkData: [2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6, s.items.length],
    },
    {
      key: "top", icon: Star, tint: "#FDECE4", accent: ORANGE,
      label: "Top Dish Type", value: topType.name,
      sub: `${topType.count} dish${topType.count === 1 ? "" : "es"}`,
      sparkData: [1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, topType.count || 1],
    },
  ];

  const toggleAvailable = (d: Dish, on: boolean) => {
    s.save({ ...d, available: on });
  };

  const renderCell = (d: Dish, key: string) => {
    switch (key) {
      case "sn":       return <span className="font-mono text-[12.5px] text-warm-500">{d.id}</span>;
      case "name":     return (
        <button onClick={() => setViewing(d)}
          className="inline-flex items-center gap-2 text-left hover:text-[#F15022] transition-colors">
          <span className="w-7 h-7 rounded-[8px] bg-warm-100 flex items-center justify-center text-[14px] flex-shrink-0">{d.emoji}</span>
          <span className="text-[13.5px] font-semibold text-ink whitespace-nowrap">{d.name}</span>
        </button>
      );
      case "price":    return <span className="text-[13px] font-bold tnum" style={{ color: "#15803D" }}>{priceLabel(d)}</span>;
      case "category": return <span className="text-[13px] text-warm-700">{d.category}</span>;
      case "type":     return d.type === "-"
        ? <span className="text-warm-400">—</span>
        : <Badge color={DISH_TYPE_COLOR[d.type]}>{d.type}</Badge>;
      case "subMenu":  return <span className="text-[13px] text-warm-700">{d.subMenu}</span>;
      case "prepTime": return <span className="text-[13px] text-warm-700">{d.prepTime ?? <span className="text-warm-400">—</span>}</span>;
      case "kotType":  return <span className="text-[13px] text-warm-700">{d.kotType ?? <span className="text-warm-400">—</span>}</span>;
      case "available": return (
        <Switch
          isSelected={d.available}
          onValueChange={(v) => toggleAvailable(d, v)}
          size="sm"
          classNames={{ wrapper: "group-data-[selected=true]:bg-[#F15022]" }}
          aria-label="Available"
        />
      );
      case "actions": return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7">
              <MoreHorizontal size={17} color="#9A8C80" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="view"  startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => setViewing(d)}>View</DropdownItem>
            <DropdownItem key="edit"  startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(d)}>Edit</DropdownItem>
            <DropdownItem key="del"   className="text-[#F15022]" color="danger"
              startContent={<Trash2 size={15} color="#F15022" />}
              onPress={() => s.setDel({ item: d })}>
              Move to trash
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (d: Dish) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]" onClick={() => setViewing(d)}>
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-[10px] bg-warm-100 flex items-center justify-center text-[18px] flex-shrink-0">{d.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[14.5px] font-bold text-ink">{d.name}</span>
            <span className="text-[13px] font-bold tnum" style={{ color: "#15803D" }}>{priceLabel(d)}</span>
          </div>
          <div className="mt-1 flex items-center gap-[7px] text-[12px] text-warm-500">
            <span>{d.category}</span>
            <span>·</span>
            <span>{d.subMenu}</span>
            {d.type !== "-" && (
              <>
                <span>·</span>
                <Badge color={DISH_TYPE_COLOR[d.type]}>{d.type}</Badge>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const filterContent = (
    <div className="w-full p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-ink">Filters</span>
        {typeFilter !== "All" && (
          <button onClick={() => setTypeFilter("All")} className="text-[11.5px] font-semibold" style={{ color: ORANGE }}>Clear</button>
        )}
      </div>
      <Select
        label="Type" labelPlacement="outside"
        selectedKeys={[typeFilter]}
        onSelectionChange={(k) => setTypeFilter(Array.from(k)[0] as "All" | DishType)}
        size="sm" variant="bordered" radius="md"
        classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
      >
        {DISH_TYPE_FILTERS.map((t) => <SelectItem key={t}>{t}</SelectItem>)}
      </Select>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s}
        title="Dishes"
        kpis={kpis}
        totalCount={s.items.length}
        columns={COLUMNS}
        renderCell={renderCell}
        renderCard={renderCard}
        onRowOpen={(d) => setViewing(d)}
        searchPlaceholder="Search dishes…"
        addLabel="Add New"
        onAdd={() => router.push("/menu/dishes/new")}
        filterContent={filterContent}
        filterCount={typeFilter === "All" ? 0 : 1}
      />

      {s.del && (
        <DeleteModal
          label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} dishes`}
          onClose={() => s.setDel(null)}
          onConfirm={() => s.doDelete((d) => `"${d.name}"`)}
        />
      )}

      {viewing && (
        <DishDetailDrawer
          dish={viewing}
          onClose={() => setViewing(null)}
          onDelete={() => { s.setDel({ item: viewing }); setViewing(null); }}
          onEdit={() => { s.setEditing(viewing); setViewing(null); }}
          onToggle={(v) => toggleAvailable(viewing, v)}
          onToggleRecommended={(v) => s.save({ ...viewing, recommended: v })}
        />
      )}
    </>
  );
}

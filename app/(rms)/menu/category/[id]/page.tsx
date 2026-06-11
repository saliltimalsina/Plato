"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Switch, Input,
} from "@heroui/react";
import {
  ArrowLeft, ChevronRight, Search, Settings2, MoreHorizontal, Pencil, Trash2, ChevronDown, Plus,
} from "lucide-react";
import { DataTable } from "@/components/rms/DataTable";
import { Badge, ORANGE } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import { CATEGORIES, DISHES, Dish, DISH_TYPE_COLOR, priceLabel } from "@/components/rms/data/menu";

const COLUMNS = [
  { key: "sn",        label: "SN" },
  { key: "name",      label: "Dish Name", sortable: true },
  { key: "price",     label: "Price" },
  { key: "category",  label: "Category", sortable: true },
  { key: "type",      label: "Type" },
  { key: "subMenu",   label: "Sub Menu", sortable: true },
  { key: "kotType",   label: "KOT Type" },
  { key: "available", label: "Available", align: "center" as const },
  { key: "actions",   label: "", align: "center" as const },
];

export default function CategoryDishesPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const category = CATEGORIES.find((c) => c.id === id);

  const dishesInCategory = useMemo(
    () => DISHES.filter((d) => d.category === category?.name),
    [category],
  );

  const s = useListState<Dish>({
    initial: dishesInCategory.map((d) => ({ ...d })),
    searchableText: (d) => `${d.name} ${d.type} ${d.subMenu}`,
    sortAccessors: {
      name: (d) => d.name.toLowerCase(),
      category: (d) => d.category.toLowerCase(),
      subMenu: (d) => d.subMenu.toLowerCase(),
    },
  });

  if (!category) {
    return (
      <div className="bg-white border border-[#EEEAE6] rounded-2xl p-6 text-center">
        <div className="text-[14px] font-bold text-ink">Category not found.</div>
        <Button size="sm" radius="md" variant="bordered" className="mt-3" onPress={() => router.push("/menu/category")}>
          Back to Category
        </Button>
      </div>
    );
  }

  const renderCell = (d: Dish, key: string) => {
    switch (key) {
      case "sn":       return <span className="font-mono text-[12.5px] text-warm-500">{d.id}</span>;
      case "name":     return (
        <div className="inline-flex items-center gap-2">
          <span className="w-7 h-7 rounded-[8px] bg-warm-100 flex items-center justify-center text-[14px] flex-shrink-0">{d.emoji}</span>
          <span className="text-[13.5px] font-semibold text-ink whitespace-nowrap">{d.name}</span>
        </div>
      );
      case "price":    return <span className="text-[13px] font-bold tnum" style={{ color: "#15803D" }}>{priceLabel(d)}</span>;
      case "category": return <span className="text-[13px] text-warm-700">{d.category}</span>;
      case "type":     return d.type === "-"
        ? <span className="text-warm-400">—</span>
        : <Badge color={DISH_TYPE_COLOR[d.type]}>{d.type}</Badge>;
      case "subMenu":  return <span className="text-[13px] text-warm-700">{d.subMenu}</span>;
      case "kotType":  return <span className="text-[13px] text-warm-700">{d.kotType ?? <span className="text-warm-400">—</span>}</span>;
      case "available": return (
        <Switch isSelected={d.available} size="sm"
          classNames={{ wrapper: "group-data-[selected=true]:bg-[#F15022]" }}
          aria-label="Available" />
      );
      case "actions": return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7">
              <MoreHorizontal size={17} color="#9A8C80" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />}>Edit</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger"
              startContent={<Trash2 size={15} color="#F15022" />}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (d: Dish) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-[10px] bg-warm-100 flex items-center justify-center text-[18px] flex-shrink-0">{d.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[14.5px] font-bold text-ink">{d.name}</span>
            <span className="text-[13px] font-bold tnum" style={{ color: "#15803D" }}>{priceLabel(d)}</span>
          </div>
          <div className="mt-1 text-[12px] text-warm-500">{d.subMenu}</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* breadcrumb + actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Button isIconOnly size="sm" variant="bordered" radius="md"
            className="w-9 h-9 min-w-9 border border-[#E6E1DC] bg-white"
            onPress={() => router.push("/menu/category")}>
            <ArrowLeft size={18} color={ORANGE} />
          </Button>
          <h1 className="inline-flex items-center gap-2 text-[20px] font-extrabold tracking-[-0.02em] text-ink m-0">
            <span>{category.name}</span>
            <ChevronRight size={18} color="#B0A69E" />
            <span>Dishes</span>
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-[9px]">
          <Input size="sm" radius="md" placeholder="Search"
            value={s.search} onValueChange={s.setSearch}
            startContent={<Search size={15} color="#B0A69E" />}
            classNames={{ base: "w-[210px]", inputWrapper: "bg-white border border-[#E6E1DC] h-9 shadow-none" }} />
          <Button size="sm" radius="md" variant="bordered"
            className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-600 text-[12.5px]"
            startContent={<Settings2 size={14} color="#6B5F55" />}>
            Arrange
          </Button>
          <Button size="sm" radius="md"
            className="h-9 text-white font-bold"
            style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
            startContent={<Plus size={16} color="#fff" strokeWidth={2.4} />}
            endContent={<ChevronDown size={14} color="#fff" />}
            onPress={() => router.push("/menu/dishes/new")}>
            Add New
          </Button>
        </div>
      </div>

      <DataTable
        state={s}
        totalCount={s.items.length}
        columns={COLUMNS}
        renderCell={renderCell}
        renderCard={renderCard}
        selectable
        emptyTitle="No dishes in this category"
        emptyHint="Add a new dish and assign it to this category."
      />
    </>
  );
}

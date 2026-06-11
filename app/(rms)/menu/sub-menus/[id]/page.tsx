"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Input, Switch, Tabs, Tab } from "@heroui/react";
import { ArrowLeft, Search } from "lucide-react";
import { ORANGE } from "@/components/rms/primitives";
import {
  SUB_MENUS, DISHES, CATEGORIES,
  Dish, Category, priceLabel,
} from "@/components/rms/data/menu";

type TabKey = "dishes" | "category";

export default function SubMenuDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const subMenu = SUB_MENUS.find((s) => s.id === id);
  const [tab, setTab] = useState<TabKey>("dishes");
  const [search, setSearch] = useState("");

  const dishesIn = useMemo(
    () => (subMenu ? DISHES.filter((d) => d.subMenu === subMenu.name) : []),
    [subMenu],
  );
  const categoriesIn = useMemo(() => {
    const names = new Set(dishesIn.map((d) => d.category));
    return CATEGORIES.filter((c) => names.has(c.name));
  }, [dishesIn]);

  const q = search.trim().toLowerCase();
  const dishes = useMemo(
    () => dishesIn.filter((d) => !q || d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)),
    [dishesIn, q],
  );
  const categories = useMemo(
    () => categoriesIn.filter((c) => !q || c.name.toLowerCase().includes(q)),
    [categoriesIn, q],
  );

  if (!subMenu) {
    return (
      <div className="bg-white border border-[#EEEAE6] rounded-2xl p-6 text-center">
        <div className="text-[14px] font-bold text-ink">Sub Menu not found.</div>
        <Button size="sm" radius="md" variant="bordered" className="mt-3" onPress={() => router.push("/menu/sub-menus")}>
          Back to Sub Menu
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Button isIconOnly size="sm" variant="bordered" radius="md"
            className="w-9 h-9 min-w-9 border border-[#E6E1DC] bg-white"
            onPress={() => router.push("/menu/sub-menus")}>
            <ArrowLeft size={18} color={ORANGE} />
          </Button>
          <h1 className="inline-flex items-center gap-2 text-[20px] font-extrabold tracking-[-0.02em] text-ink m-0">
            <span className="w-9 h-9 rounded-[10px] bg-warm-100 flex items-center justify-center text-[18px]">{subMenu.emoji}</span>
            {subMenu.name}
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-[9px]">
          <Input size="sm" radius="md" placeholder="Search"
            value={search} onValueChange={setSearch}
            startContent={<Search size={15} color="#B0A69E" />}
            classNames={{ base: "w-[220px]", inputWrapper: "bg-white border border-[#E6E1DC] h-9 shadow-none" }} />
        </div>
      </div>

      <div className="mt-1">
        <Tabs size="sm" radius="md"
          selectedKey={tab}
          onSelectionChange={(k) => setTab(k as TabKey)}
          classNames={{
            tabList: "bg-[#FBF6F1] p-1",
            cursor: "bg-[#F15022] shadow-sm",
            tab: "px-4 h-9",
            tabContent: "font-bold text-[13px] text-warm-600 group-data-[selected=true]:text-white",
          }}>
          <Tab key="dishes"   title="Dishes" />
          <Tab key="category" title="Category" />
        </Tabs>
      </div>

      {tab === "dishes"   && <DishesTab dishes={dishes} />}
      {tab === "category" && <CategoryTab categories={categories} />}
    </>
  );
}

function DishesTab({ dishes }: { dishes: Dish[] }) {
  return (
    <div className="border border-[#EEEAE6] rounded-[14px] overflow-hidden bg-white">
      <div className="grid bg-cream border-b border-warm-200 px-4 py-[10px] text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em]"
        style={{ gridTemplateColumns: "60px 1fr 160px 110px" }}>
        <span>SN</span>
        <span>Dish Name</span>
        <span>Price</span>
        <span className="text-center">Available</span>
      </div>
      {dishes.length === 0 ? (
        <div className="py-[36px] text-center text-[13px] text-warm-500 font-medium">No dishes match.</div>
      ) : (
        dishes.map((d, i) => (
          <div key={d.id} className="grid items-center px-4 py-[12px] hover:bg-warm-50"
            style={{ gridTemplateColumns: "60px 1fr 160px 110px", borderTop: i === 0 ? "none" : "1px solid #F4EFEB" }}>
            <span className="font-mono text-[12.5px] text-warm-500">{i + 1}</span>
            <span className="inline-flex items-center gap-2 min-w-0">
              <span className="w-7 h-7 rounded-[8px] bg-warm-100 flex items-center justify-center text-[14px] flex-shrink-0">{d.emoji}</span>
              <span className="text-[13.5px] font-semibold text-ink truncate">{d.name}</span>
            </span>
            <span className="text-[13px] font-bold tnum" style={{ color: "#15803D" }}>{priceLabel(d)}</span>
            <span className="flex justify-center">
              <Switch isSelected={d.available} size="sm"
                classNames={{ wrapper: "group-data-[selected=true]:bg-[#F15022]" }}
                aria-label={`Toggle ${d.name}`} />
            </span>
          </div>
        ))
      )}
    </div>
  );
}

function CategoryTab({ categories }: { categories: Category[] }) {
  return (
    <div className="border border-[#EEEAE6] rounded-[14px] overflow-hidden bg-white">
      <div className="grid bg-cream border-b border-warm-200 px-4 py-[10px] text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em]"
        style={{ gridTemplateColumns: "60px 1fr 160px" }}>
        <span>SN</span>
        <span>Name</span>
        <span>Dish Count</span>
      </div>
      {categories.length === 0 ? (
        <div className="py-[36px] text-center text-[13px] text-warm-500 font-medium">No categories match.</div>
      ) : (
        categories.map((c, i) => (
          <div key={c.id} className="grid items-center px-4 py-[12px] hover:bg-warm-50"
            style={{ gridTemplateColumns: "60px 1fr 160px", borderTop: i === 0 ? "none" : "1px solid #F4EFEB" }}>
            <span className="font-mono text-[12.5px] text-warm-500">{i + 1}</span>
            <span className="inline-flex items-center gap-2 min-w-0">
              <span className="w-7 h-7 rounded-[8px] bg-warm-100 flex items-center justify-center text-[14px] flex-shrink-0">{c.emoji}</span>
              <span className="text-[13.5px] font-semibold text-ink truncate">{c.name}</span>
            </span>
            <span className="text-[13px] font-bold text-ink tnum">{c.dishCount}</span>
          </div>
        ))
      )}
    </div>
  );
}

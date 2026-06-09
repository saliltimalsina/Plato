"use client";

import { useMemo, useState } from "react";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Switch,
  Drawer, DrawerContent, DrawerHeader, DrawerBody, Tabs, Tab, Select, SelectItem,
  Input,
} from "@heroui/react";
import {
  Utensils, Star, MoreHorizontal, Pencil, Trash2, ChevronDown, Calendar, X,
} from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { ModalShell, DeleteModal, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { KpiData, Badge, ORANGE } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import {
  Dish, DishVariant, DISHES, DISH_TYPE_COLOR, priceLabel, DishType,
} from "@/components/rms/data/menu";

const DISH_TYPES: ("All" | DishType)[] = ["All", "Veg", "Non-Veg", "Egg", "Vegan"];

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
        {DISH_TYPES.map((t) => <SelectItem key={t}>{t}</SelectItem>)}
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
        onAdd={() => s.setEditing(null)}
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

/* ── detail drawer with 3 tabs ─────────────────────────────────── */
function DishDetailDrawer({
  dish, onClose, onDelete, onEdit, onToggle, onToggleRecommended,
}: {
  dish: Dish;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onToggle: (v: boolean) => void;
  onToggleRecommended: (v: boolean) => void;
}) {
  const [tab, setTab] = useState<"details" | "inventory" | "txn">("details");
  const [range, setRange] = useState("Today");

  return (
    <Drawer isOpen onClose={onClose} placement="right" size="md"
      classNames={{
        base: "sm:max-w-[520px]",
        closeButton: "hidden",
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-3 border-b border-warm-200">
          <span className="w-12 h-12 rounded-[12px] bg-warm-100 flex items-center justify-center text-[22px] flex-shrink-0">{dish.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-extrabold text-ink tracking-[-0.02em] truncate">{dish.name}</div>
            <div className="text-[13px] font-bold tnum" style={{ color: "#F15022" }}>{priceLabel(dish)}</div>
          </div>
          <Button size="sm" variant="bordered" radius="md"
            className="h-[34px] border border-[#E6E1DC] bg-white font-semibold text-warm-600 text-[12.5px]"
            startContent={<Pencil size={14} color="#8A7D72" />} onPress={onEdit}>
            Edit
          </Button>
          <Button size="sm" variant="bordered" radius="md"
            className="h-[34px] border border-[#E6E1DC] bg-white font-semibold text-[#F15022] text-[12.5px]"
            startContent={<Trash2 size={14} color="#F15022" />} onPress={onDelete}>
            Move to Trash
          </Button>
          <Button isIconOnly size="sm" variant="bordered" radius="md"
            className="w-[34px] h-[34px] min-w-[34px] border border-[#E6E1DC] bg-white"
            onPress={onClose}>
            <X size={16} color="#8A7D72" />
          </Button>
        </DrawerHeader>

        <DrawerBody className="px-5 gap-[14px]">
          {/* tabs */}
          <Tabs
            size="sm" radius="md"
            selectedKey={tab}
            onSelectionChange={(k) => setTab(k as typeof tab)}
            classNames={{
              tabList: "bg-[#F6EFE8]",
              cursor: "bg-white shadow-sm",
              tabContent: "font-bold text-[12.5px]",
            }}
          >
            <Tab key="details"   title="Details" />
            <Tab key="inventory" title="Inventory Details" />
            <Tab key="txn"       title="Recent Transactions" />
          </Tabs>

          {tab === "details"   && <DetailsTab dish={dish} onToggle={onToggle} onToggleRecommended={onToggleRecommended} />}
          {tab === "inventory" && <InventoryTab dish={dish} />}
          {tab === "txn"       && <TxnTab dish={dish} range={range} setRange={setRange} />}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

/* ── details tab ───────────────────────────────────────────────── */
function DetailsTab({
  dish, onToggle, onToggleRecommended,
}: { dish: Dish; onToggle: (v: boolean) => void; onToggleRecommended: (v: boolean) => void }) {
  const [pricesOpen, setPricesOpen] = useState(false);
  return (
    <>
      <div className="border border-warm-200 rounded-[14px] p-4">
        <h3 className="text-[13px] font-extrabold text-ink mb-3">Basic Details</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
          <div><div className="text-warm-500 text-[12px] mb-[2px]">Sub-Menu:</div><div className="font-semibold text-ink">{dish.subMenu}</div></div>
          <div><div className="text-warm-500 text-[12px] mb-[2px]">Category:</div><div className="font-semibold text-ink">{dish.category}</div></div>
          <div><div className="text-warm-500 text-[12px] mb-[2px]">Preparation Time:</div><div className="font-semibold text-ink">{dish.prepTime ?? "—"}</div></div>
          <div><div className="text-warm-500 text-[12px] mb-[2px]">HS Code:</div><div className="font-semibold text-ink">{dish.hsCode ?? "—"}</div></div>
        </div>
        <div className="mt-4 pt-4 border-t border-warm-200 flex flex-col gap-3">
          <ToggleRow
            label="Available"
            hint="Show this dish on the active menu"
            value={dish.available} onChange={onToggle} />
          <ToggleRow
            label="Recommended"
            hint="Mark as a chef's recommendation"
            value={!!dish.recommended} onChange={onToggleRecommended} />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <span className={labelCx}>KOT Type</span>
          <Select
            aria-label="KOT Type" placeholder="Select an option"
            size="sm" variant="bordered" radius="md"
            selectedKeys={dish.kotType ? [dish.kotType] : []}
            classNames={{ trigger: wrapCx, value: inputCx }}
          >
            {["KOT", "BOT"].map((k) => <SelectItem key={k}>{k}</SelectItem>)}
          </Select>
        </div>
      </div>

      {/* variants */}
      <div className="border border-warm-200 rounded-[14px] p-4">
        <h3 className="text-[13px] font-extrabold text-ink mb-3">Variants</h3>
        <div className="flex flex-col gap-2">
          {dish.variants.map((v) => (
            <div key={v.id} className="flex items-center justify-between gap-3 rounded-[10px] bg-warm-50 border border-warm-200 px-3 py-[10px]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-[14px] h-[14px] rounded-[4px] flex-shrink-0" style={{ background: DISH_TYPE_COLOR[v.type], border: `1px solid ${DISH_TYPE_COLOR[v.type]}` }} />
                <span className="text-[13.5px] font-bold text-ink truncate">{v.name}</span>
              </div>
              <div className="text-right flex items-baseline gap-2">
                <span className="text-[13.5px] font-extrabold text-ink tnum">Rs {v.price}</span>
                {v.strikePrice && <span className="text-[12px] text-warm-400 line-through tnum">Rs {v.strikePrice}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* menu set prices teaser */}
      <div className="border border-warm-200 rounded-[14px] p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[13px] font-extrabold text-ink">Menu Set&apos;s Prices</h3>
          <button onClick={() => setPricesOpen(true)} className="text-[12px] font-bold" style={{ color: "#F15022" }}>Setup Price</button>
        </div>
        <div className="border-[1.5px] border-dashed rounded-[12px] p-3 flex items-start gap-2 bg-[#FFF6F2]"
          style={{ borderColor: "#F8C9B6" }}>
          <span className="text-[10.5px] font-extrabold uppercase tracking-[0.04em] px-[7px] py-[2px] rounded-md"
            style={{ background: "#F4EFEB", color: "#6B5F55" }}>
            New
          </span>
          <div className="flex-1">
            <div className="text-[13px] font-bold text-ink">Set Multiple Price of Dish</div>
            <div className="text-[12px] text-warm-600 mt-[2px]">You can set multiple price of this dish according to menu sets.</div>
          </div>
        </div>
      </div>

      {pricesOpen && <ManagePricesModal dish={dish} onClose={() => setPricesOpen(false)} />}
    </>
  );
}

/* ── manage menu-set prices modal ──────────────────────────────── */
interface PriceRow { variantId: number; actual: string; discount: string }

function ManagePricesModal({ dish, onClose }: { dish: Dish; onClose: () => void }) {
  const [rows, setRows] = useState<PriceRow[]>(() =>
    dish.variants.map((v) => ({
      variantId: v.id,
      actual: String(v.strikePrice ?? v.price),
      discount: String(Math.max(0, (v.strikePrice ?? v.price) - v.price)),
    })),
  );
  const patch = (id: number, p: Partial<PriceRow>) =>
    setRows((r) => r.map((x) => (x.variantId === id ? { ...x, ...p } : x)));

  return (
    <ModalShell
      title="Manage Dish's Prices"
      size="3xl"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={onClose}>Cancel</Button>
          <Button
            radius="md"
            className="font-bold text-white"
            style={{ background: "#F15022", boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
            onPress={onClose}
          >
            Save Change
          </Button>
        </div>
      }
    >
      {/* dish header */}
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 rounded-[12px] bg-warm-100 flex items-center justify-center text-[22px] flex-shrink-0">{dish.emoji}</span>
        <div className="min-w-0">
          <div className="text-[16px] font-extrabold text-ink">{dish.name}</div>
          <div className="text-[13px] font-bold tnum" style={{ color: "#F15022" }}>{priceLabel(dish)}</div>
        </div>
      </div>

      {/* chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center px-[10px] py-[5px] rounded-md text-[11.5px] font-semibold bg-warm-100 text-warm-700">
          Sub Menu: <span className="ml-1 font-bold text-ink">{dish.subMenu}</span>
        </span>
        <span className="inline-flex items-center px-[10px] py-[5px] rounded-md text-[11.5px] font-semibold bg-warm-100 text-warm-700">
          Category: <span className="ml-1 font-bold text-ink">{dish.category}</span>
        </span>
      </div>

      {/* variant cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {dish.variants.map((v) => (
          <div key={v.id} className="rounded-[12px] border border-warm-200 bg-warm-50 px-3 py-[10px]">
            <div className="text-[13.5px] font-bold text-ink">{v.name}</div>
            <div className="mt-[2px] flex items-baseline gap-2">
              <span className="text-[14px] font-extrabold tnum" style={{ color: "#F15022" }}>Rs {v.price}</span>
              {v.strikePrice && <span className="text-[12px] text-warm-400 line-through tnum">Rs {v.strikePrice}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* table */}
      <div>
        <h3 className="text-[13px] font-extrabold text-ink mb-2">Menu Set Price</h3>
        <div className="border border-warm-200 rounded-[12px] overflow-hidden">
          <div className="grid bg-cream border-b border-warm-200"
            style={{ gridTemplateColumns: "60px 1fr 1.6fr" }}>
            <div className="px-3 py-2 text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em]">SN</div>
            <div className="px-3 py-2 text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em]">Variants</div>
            <div className="py-2 text-[11px] font-bold text-warm-600 uppercase tracking-[0.04em] text-center border-l border-warm-200">
              <div>Default Menuset</div>
              <div className="grid mt-1" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <span className="text-[10.5px] font-bold text-warm-500">Actual Price</span>
                <span className="text-[10.5px] font-bold text-warm-500">Discount</span>
              </div>
            </div>
          </div>
          {dish.variants.map((v, i) => {
            const row = rows.find((r) => r.variantId === v.id)!;
            return (
              <div key={v.id} className="grid items-center"
                style={{ gridTemplateColumns: "60px 1fr 1.6fr", borderTop: i === 0 ? "none" : "1px solid #F4EFEB" }}>
                <div className="px-3 py-3 text-[12.5px] font-mono text-warm-600">{i + 1}.</div>
                <div className="px-3 py-3 text-[13.5px] font-semibold text-ink">{v.name}</div>
                <div className="grid gap-2 px-3 py-2 border-l border-warm-200" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <Input
                    size="sm" aria-label="Actual Price" type="number"
                    value={row.actual} onValueChange={(val) => patch(v.id, { actual: val })}
                    startContent={<span className="text-[12px] text-warm-500 font-semibold">Rs</span>}
                    variant="bordered"
                    classNames={{ inputWrapper: wrapCx, input: `${inputCx} tnum` }}
                  />
                  <Input
                    size="sm" aria-label="Discount" type="number" placeholder="0"
                    value={row.discount} onValueChange={(val) => patch(v.id, { discount: val })}
                    startContent={<span className="text-[12px] text-warm-500 font-semibold">Rs</span>}
                    variant="bordered"
                    classNames={{ inputWrapper: wrapCx, input: `${inputCx} tnum` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ModalShell>
  );
}

function ToggleRow({
  label, hint, value, onChange,
}: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[13.5px] font-bold text-ink">{label}</div>
        {hint && <div className="text-[12px] text-warm-500">{hint}</div>}
      </div>
      <Switch
        isSelected={value} onValueChange={onChange} size="sm"
        classNames={{ wrapper: "group-data-[selected=true]:bg-[#F15022]" }}
        aria-label={label}
      />
    </div>
  );
}

/* ── inventory tab ─────────────────────────────────────────────── */
function InventoryTab({ dish }: { dish: Dish }) {
  return (
    <div className="border border-warm-200 rounded-[14px] p-4">
      <h3 className="text-[13px] font-extrabold text-ink mb-3">Stock By Variant</h3>
      <div className="flex flex-col gap-3">
        {dish.variants.map((v) => {
          const sales = v.price;
          const cogs  = v.cogs ?? 0;
          const loss  = Math.max(0, cogs - sales);
          return (
            <div key={v.id} className="border border-warm-200 rounded-[12px] overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-3 py-[10px] bg-warm-50">
                <div className="flex items-center gap-2">
                  <span className="w-[14px] h-[14px] rounded-[4px] flex-shrink-0" style={{ background: DISH_TYPE_COLOR[v.type] }} />
                  <span className="text-[13.5px] font-bold text-ink">{v.name}</span>
                </div>
                <div className="flex items-center gap-4 text-[12px] text-warm-500 font-semibold">
                  <Stat label="Sales Price" value={`Rs ${sales}`} />
                  <Stat label="COGS"        value={`Rs ${cogs}`} />
                  <Stat label="Gross Loss"  value={`Rs ${loss}`} tone={loss > 0 ? "danger" : "neutral"} />
                </div>
              </div>
              {(v.ingredients ?? []).length === 0 ? (
                <div className="px-3 py-4 text-[12.5px] text-warm-500 font-medium">No stock entries.</div>
              ) : (
                <>
                  <div className="grid bg-cream border-t border-warm-200 px-3 py-2 text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em]"
                    style={{ gridTemplateColumns: "40px 1fr 90px 100px" }}>
                    <span>S.N</span><span>Stocks</span><span className="text-left">QTY</span><span className="text-right">Amount</span>
                  </div>
                  {(v.ingredients ?? []).map((ing, i) => (
                    <div key={ing.id} className="grid px-3 py-[10px] items-center"
                      style={{ gridTemplateColumns: "40px 1fr 90px 100px", borderTop: "1px solid #F4EFEB" }}>
                      <span className="font-mono text-[12px] text-warm-500">{i + 1}</span>
                      <span className="text-[13px] font-semibold text-ink">{ing.name}</span>
                      <span className="text-[13px] text-warm-700 tnum">{ing.qty}</span>
                      <span className="text-[13px] font-bold text-ink text-right tnum">{ing.amount}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "danger" | "neutral" }) {
  const color = tone === "danger" ? "#C2410C" : "#3F3933";
  return (
    <div className="flex flex-col">
      <span className="text-[10.5px] text-warm-500 uppercase tracking-[0.04em]">{label}</span>
      <span className="text-[13px] font-extrabold tnum" style={{ color }}>{value}</span>
    </div>
  );
}

/* ── recent txn tab ────────────────────────────────────────────── */
const RANGE_ORDER = ["Today", "This Week", "This Month", "All Time"] as const;
type Range = typeof RANGE_ORDER[number];
const rangeAtLeast = (target: Range, item: string) => {
  const a = RANGE_ORDER.indexOf(target as Range);
  const b = RANGE_ORDER.indexOf(item as Range);
  // Today ⊂ This Week ⊂ This Month ⊂ All Time (when picking a wider window, include narrower)
  return a >= b;
};

function TxnTab({ dish, range, setRange }: { dish: Dish; range: string; setRange: (v: string) => void }) {
  return (
    <>
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <Button size="sm" radius="md" variant="bordered"
            className="self-start h-9 border border-[#E6E1DC] bg-white text-warm-700 text-[12.5px] font-semibold"
            startContent={<Calendar size={14} color="#6B5F55" />}
            endContent={<ChevronDown size={13} color="#8A7D72" />}>
            {range}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Range" onAction={(k) => setRange(String(k))}>
          {RANGE_ORDER.map((r) => <DropdownItem key={r}>{r}</DropdownItem>)}
        </DropdownMenu>
      </Dropdown>

      <div className="flex flex-col gap-3">
        {dish.variants.map((v) => {
          const rows = (v.transactions ?? []).filter((t) => rangeAtLeast(range as Range, t.range));
          return (
            <div key={v.id} className="border border-warm-200 rounded-[12px] overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-3 py-[10px] bg-warm-50 border-b border-warm-200">
                <div className="flex items-center gap-2">
                  <span className="w-[14px] h-[14px] rounded-[4px] flex-shrink-0" style={{ background: DISH_TYPE_COLOR[v.type] }} />
                  <span className="text-[13.5px] font-bold text-ink">{v.name}</span>
                </div>
                <span className="text-[11.5px] font-semibold text-warm-500 tnum">
                  {rows.length} txn{rows.length === 1 ? "" : "s"}
                </span>
              </div>
              {rows.length === 0 ? (
                <div className="px-3 py-4 text-[12.5px] text-warm-500 font-medium">
                  No transactions for the selected date range.
                </div>
              ) : (
                <>
                  <div className="grid bg-cream px-3 py-2 text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em]"
                    style={{ gridTemplateColumns: "1.2fr 1.1fr 0.5fr 0.8fr 1.1fr" }}>
                    <span>Date</span><span>Order</span>
                    <span className="text-center">Qty</span>
                    <span className="text-right">Amount</span>
                    <span className="text-right">Staff</span>
                  </div>
                  {rows.map((t, i) => (
                    <div key={t.id} className="grid px-3 py-[10px] items-center"
                      style={{
                        gridTemplateColumns: "1.2fr 1.1fr 0.5fr 0.8fr 1.1fr",
                        borderTop: i === 0 ? "none" : "1px solid #F4EFEB",
                      }}>
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-mono text-ink tnum">{t.date}</div>
                        <div className="text-[11px] text-warm-500 tnum">{t.time}</div>
                      </div>
                      <span className="text-[12.5px] font-mono font-semibold text-[#0EA5E9] truncate">{t.orderNo}</span>
                      <span className="text-[13px] font-bold text-ink text-center tnum">{t.qty}</span>
                      <span className="text-[13px] font-bold text-right tnum" style={{ color: "#15803D" }}>Rs {t.amount}</span>
                      <span className="text-[12.5px] text-warm-700 text-right truncate">{t.staff}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

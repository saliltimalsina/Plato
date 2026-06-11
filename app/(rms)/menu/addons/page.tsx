"use client";

import { useMemo, useState } from "react";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input, Textarea,
  Switch, Select, SelectItem,
  Drawer, DrawerContent, DrawerHeader, DrawerBody,
} from "@heroui/react";
import {
  MoreHorizontal, Pencil, Trash2, Box, UploadCloud, X, Heart, Layers,
} from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import {
  ModalShell, ModalFooterButtons, DeleteModal, labelCx, wrapCx, inputCx,
} from "@/components/rms/ModalShell";
import { KpiData, ORANGE } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import { Addon, ADDONS } from "@/components/rms/data/menu";

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;

const ADDON_TYPES = ["Uncategorized", "Veg", "Non-Veg", "Vegan", "Halal", "Sugar Free", "Gluten Free"];

const COLUMNS = [
  { key: "sn",        label: "SN" },
  { key: "name",      label: "Add-On Name", sortable: true },
  { key: "price",     label: "Price", align: "end" as const, sortable: true },
  { key: "type",      label: "Type" },
  { key: "used",      label: "Used In" },
  { key: "available", label: "Available", align: "center" as const },
  { key: "actions",   label: "", align: "center" as const },
];

/* ── Create / Edit Add-On modal ────────────────────────────────── */
function AddonModal({
  addon, onClose, onSave,
}: { addon: Addon | null; onClose: () => void; onSave: (a: Addon) => void }) {
  const [name, setName]         = useState(addon?.name ?? "");
  const [type, setType]         = useState(addon?.type ?? "");
  const [price, setPrice]       = useState(addon ? String(addon.price) : "");
  const [discount, setDiscount] = useState(addon?.discount ? String(addon.discount) : "");
  const [description, setDescription] = useState(addon?.description ?? "");

  const listedPrice = Number(price) || 0;
  const cogs = addon?.cogs ?? 0;
  const finalPrice = Math.max(0, listedPrice - (Number(discount) || 0));
  const grossProfit = Math.max(0, finalPrice - cogs);

  const valid = name.trim().length > 0 && Number(price) >= 0;
  const submit = () =>
    onSave({
      id: addon?.id ?? 0,
      name: name.trim(),
      type: type.trim() || "Uncategorized",
      price: Number(price),
      discount: Number(discount) || undefined,
      cogs,
      description: description.trim(),
      emoji: addon?.emoji,
      available: addon?.available ?? true,
      used: addon?.used ?? 0,
    });
  const reset = () => {
    setName(addon?.name ?? ""); setType(addon?.type ?? "");
    setPrice(addon ? String(addon.price) : ""); setDiscount(addon?.discount ? String(addon.discount) : "");
    setDescription(addon?.description ?? "");
  };

  return (
    <ModalShell
      title={addon ? "Edit Add-On" : "Create Add-On"} size="2xl" onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={reset}>Reset</Button>
          <ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel={addon ? "Save changes" : "Save Add-On"} disabled={!valid} />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Type" labelPlacement="outside" placeholder="Select add-ons type"
          selectedKeys={type ? [type] : []}
          onSelectionChange={(k) => setType(Array.from(k)[0] as string ?? "")}
          variant="bordered" radius="md"
          classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
        >
          {ADDON_TYPES.map((t) => <SelectItem key={t}>{t}</SelectItem>)}
        </Select>
        <Input
          autoFocus
          label={<>Add-On Name<Req /></>}
          labelPlacement="outside" placeholder="Enter Add-On Name"
          size="sm" variant="bordered" value={name} onValueChange={setName}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className={labelCx}>Add-On Photo</span>
        <button className="w-full flex items-center gap-3 h-11 px-3 rounded-[10px] border border-warm-200 bg-warm-50 hover:bg-warm-100 transition-colors text-left">
          <UploadCloud size={16} color="#8A7D72" />
          <span className="text-[13px] text-warm-500 font-medium">Click here to upload your image</span>
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[13px] font-extrabold text-ink">Price:</h3>
          <button
            className="inline-flex items-center gap-2 h-8 px-3 rounded-[9px] border text-[12.5px] font-bold transition-colors"
            style={{ background: "#FFF1EB", borderColor: "#F8C9B6", color: ORANGE }}>
            Setup stock consumption
            <Pencil size={13} color={ORANGE} />
          </button>
        </div>
        <div className="border border-warm-200 rounded-[14px] p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={<>Actual Price<Req /></>} labelPlacement="outside"
              placeholder="0" type="number"
              value={price} onValueChange={setPrice}
              startContent={<span className="text-[13px] text-warm-500 font-semibold">Rs</span>}
              variant="bordered"
              classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }}
            />
            <Input
              label="Discount" labelPlacement="outside"
              placeholder="0" type="number"
              value={discount} onValueChange={setDiscount}
              startContent={<span className="text-[13px] text-warm-500 font-semibold">Rs</span>}
              variant="bordered"
              classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }}
            />
          </div>
          <div className="mt-3 flex items-center gap-4 text-[12.5px]">
            <span className="text-warm-600">Listed Price: <span className="font-bold text-ink tnum">Rs {listedPrice.toFixed(2)}</span></span>
            <span className="text-warm-600">COGS: <span className="font-bold text-ink tnum">Rs {cogs}</span></span>
            <span className="font-bold tnum" style={{ color: "#15803D" }}>Gross Profit: Rs {grossProfit.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[13px] font-extrabold text-ink">Remarks:</h3>
          <span className="text-[11.5px] text-warm-500 tnum">{description.length} / 240</span>
        </div>
        <Textarea
          aria-label="Description" placeholder="Enter description"
          minRows={3} maxLength={240}
          value={description} onValueChange={setDescription}
          variant="bordered"
          classNames={{ inputWrapper: `${wrapCx} h-auto min-h-[88px]`, input: inputCx }}
        />
      </div>
    </ModalShell>
  );
}

/* ── detail drawer ─────────────────────────────────────────────── */
function AddonDrawer({
  addon, onClose, onEdit, onDelete, onToggle,
}: {
  addon: Addon;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (v: boolean) => void;
}) {
  return (
    <Drawer isOpen onClose={onClose} placement="right" size="md"
      classNames={{ base: "sm:max-w-[480px]", closeButton: "hidden" }}>
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-3 border-b border-warm-200">
          <span className="w-11 h-11 rounded-[12px] bg-warm-100 flex items-center justify-center text-[20px] flex-shrink-0">
            {addon.emoji ?? "🍽️"}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-extrabold text-ink tracking-[-0.02em] truncate">{addon.name}</div>
            <div className="text-[13px] font-bold tnum" style={{ color: "#F15022" }}>Rs {addon.price}</div>
          </div>
          <Button size="sm" variant="bordered" radius="md"
            className="h-[34px] border border-[#E6E1DC] bg-white font-semibold text-warm-600 text-[12.5px]"
            startContent={<Pencil size={14} color="#8A7D72" />} onPress={onEdit}>
            Edit
          </Button>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="bordered" radius="md" className="w-[34px] h-[34px] min-w-[34px] border border-[#E6E1DC] bg-white">
                <MoreHorizontal size={16} color="#8A7D72" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Add-on actions">
              <DropdownItem key="del" className="text-[#F15022]" color="danger"
                startContent={<Trash2 size={15} color="#F15022" />} onPress={onDelete}>
                Move to trash
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button isIconOnly size="sm" variant="bordered" radius="md"
            className="w-[34px] h-[34px] min-w-[34px] border border-[#E6E1DC] bg-white" onPress={onClose}>
            <X size={16} color="#8A7D72" />
          </Button>
        </DrawerHeader>

        <DrawerBody className="px-5 gap-[14px]">
          <div>
            <span className="inline-flex items-center px-[10px] py-[5px] rounded-md text-[11.5px] font-semibold bg-warm-100 text-warm-700">
              Used In: <span className="ml-1 font-bold text-ink">{addon.used ?? 0} Dishes</span>
            </span>
          </div>

          <div className="border border-warm-200 rounded-[14px] p-4 flex flex-col gap-[14px]">
            <div className="flex items-center justify-between">
              <div className="text-[13.5px] font-extrabold text-ink">Available</div>
              <Switch
                isSelected={addon.available}
                onValueChange={onToggle}
                size="sm"
                classNames={{ wrapper: "group-data-[selected=true]:bg-[#F15022]" }}
                aria-label="Available"
              />
            </div>
            <div className="pt-3 border-t border-warm-200">
              <div className="text-[12px] text-warm-500 font-medium mb-1">Description</div>
              <div className="text-[13px] text-warm-700">
                {addon.description?.trim() || <span className="text-warm-400">No description added.</span>}
              </div>
            </div>
          </div>

          <div className="border border-warm-200 rounded-[14px] p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-extrabold text-ink">Dish Using This Add-Ons</h3>
              <Button size="sm" variant="bordered" radius="md"
                className="h-8 border border-[#E6E1DC] bg-white text-warm-700 text-[12px] font-semibold">
                Assign More
              </Button>
            </div>
            <div className="border border-warm-200 rounded-[12px] overflow-hidden">
              <div className="grid bg-cream border-b border-warm-200 px-3 py-2 text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em]"
                style={{ gridTemplateColumns: "60px 1fr 100px" }}>
                <span>SN</span><span>Dish Name</span><span className="text-right">Price</span>
              </div>
              <div className="py-[28px] flex flex-col items-center gap-2">
                <div className="w-[44px] h-[44px] rounded-[12px] bg-warm-100 flex items-center justify-center">
                  <Box size={20} color="#C9BCB0" />
                </div>
                <span className="text-[13px] font-bold text-ink">No Dishes Found!</span>
              </div>
            </div>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

/* ── page ──────────────────────────────────────────────────────── */
export default function AddonsPage() {
  const s = useListState<Addon>({
    initial: ADDONS.map((a) => ({ ...a })),
    searchableText: (a) => `${a.name} ${a.category ?? ""} ${a.type ?? ""}`,
    sortAccessors: { name: (a) => a.name.toLowerCase(), price: (a) => a.price },
  });
  const [viewing, setViewing] = useState<Addon | null>(null);

  const active = s.items.filter((a) => a.available).length;
  const mostUsed = useMemo(() => {
    const top = [...s.items].sort((a, b) => (b.used ?? 0) - (a.used ?? 0))[0];
    return { name: top?.name ?? "—", used: top?.used ?? 0 };
  }, [s.items]);
  const topType = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of s.items) counts[a.type ?? "Uncategorized"] = (counts[a.type ?? "Uncategorized"] ?? 0) + 1;
    const e = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return { name: e?.[0] ?? "—", count: e?.[1] ?? 0 };
  }, [s.items]);

  const kpis: KpiData[] = [
    {
      key: "total", icon: Layers, tint: "#E3F6F1", accent: "#1FA98B",
      label: "Total", value: `${s.items.length}/250`,
      delta: `${active} Active`, deltaUp: true,
      sparkData: [2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, s.items.length],
    },
    {
      key: "most", icon: Heart, tint: "#FDECE4", accent: ORANGE,
      label: "Most Used", value: mostUsed.name,
      sub: `${mostUsed.used} dishes`,
      sparkData: [1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 5, mostUsed.used || 1],
    },
    {
      key: "top", icon: Box, tint: "#F4EFEB", accent: "#6B5F55",
      label: "Top Add-Ons Type", value: topType.name,
      sub: String(topType.count),
      sparkData: [2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, topType.count || 1],
    },
  ];

  const toggleAvailable = (a: Addon, v: boolean) => s.save({ ...a, available: v });

  const renderCell = (a: Addon, key: string) => {
    switch (key) {
      case "sn":       return <span className="font-mono text-[12.5px] text-warm-500">{a.id}</span>;
      case "name":     return (
        <button onClick={() => setViewing(a)} className="inline-flex items-center gap-2 text-left hover:text-[#F15022] transition-colors">
          <span className="w-7 h-7 rounded-[8px] bg-warm-100 flex items-center justify-center text-[14px] flex-shrink-0">{a.emoji ?? "🍽️"}</span>
          <span className="text-[13.5px] font-semibold text-ink whitespace-nowrap">{a.name}</span>
        </button>
      );
      case "price":    return <span className="text-[13px] font-bold tnum" style={{ color: "#15803D" }}>Rs {a.price}</span>;
      case "type":     return a.type
        ? <span className="text-[13px] text-warm-700">{a.type}</span>
        : <span className="text-warm-400">—</span>;
      case "used":     return <span className="text-[13px] text-warm-700 tnum">{a.used ?? 0} Dishes</span>;
      case "available": return (
        <Switch
          isSelected={a.available}
          onValueChange={(v) => toggleAvailable(a, v)}
          size="sm"
          classNames={{ wrapper: "group-data-[selected=true]:bg-[#F15022]" }}
          aria-label="Available"
        />
      );
      case "actions":  return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="view" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => setViewing(a)}>View</DropdownItem>
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(a)}>Edit</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color="#F15022" />} onPress={() => s.setDel({ item: a })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (a: Addon) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]" onClick={() => setViewing(a)}>
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-[10px] bg-warm-100 flex items-center justify-center text-[18px] flex-shrink-0">{a.emoji ?? "🍽️"}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[14.5px] font-bold text-ink">{a.name}</span>
            <span className="text-[13px] font-bold tnum" style={{ color: "#15803D" }}>Rs {a.price}</span>
          </div>
          <div className="mt-1 text-[12px] text-warm-500">
            {a.type ?? "Uncategorized"} · {a.used ?? 0} dishes
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s}
        title="Add-Ons & Extras"
        kpis={kpis}
        totalCount={s.items.length}
        columns={COLUMNS}
        renderCell={renderCell}
        renderCard={renderCard}
        onRowOpen={(a) => setViewing(a)}
        searchPlaceholder="Search add-ons…"
        addLabel="Add New Add-On"
        onAdd={() => s.setEditing(null)}
      />

      {s.editing !== undefined && (
        <AddonModal addon={s.editing} onClose={() => s.setEditing(undefined)} onSave={(a) => { s.save(a); setViewing(null); }} />
      )}
      {s.del && (
        <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} add-ons`}
          onClose={() => s.setDel(null)}
          onConfirm={() => { s.doDelete((a) => `"${a.name}"`); setViewing(null); }} />
      )}
      {viewing && (
        <AddonDrawer
          addon={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => { s.setEditing(viewing); setViewing(null); }}
          onDelete={() => s.setDel({ item: viewing })}
          onToggle={(v) => { toggleAvailable(viewing, v); setViewing({ ...viewing, available: v }); }}
        />
      )}
    </>
  );
}

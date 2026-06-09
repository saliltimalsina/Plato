"use client";

import { useMemo, useState } from "react";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input, Textarea,
  Drawer, DrawerContent, DrawerHeader, DrawerBody,
} from "@heroui/react";
import {
  Layers, DollarSign, Star, MoreHorizontal, Pencil, Trash2, Box, Shuffle, Check, X,
} from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import {
  ModalShell, ModalFooterButtons, DeleteModal, labelCx, wrapCx, inputCx,
} from "@/components/rms/ModalShell";
import { KpiData, ORANGE } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import { StockGroupRow, STOCK_GROUPS, GROUP_COLORS } from "@/components/rms/data/inventory";

const PALETTE = Array.from(new Set([
  ...GROUP_COLORS,
  "#F15022", "#0EA5E9", "#16A34A", "#9B51E0", "#E5484D",
  "#A16207", "#1FA98B", "#F59E0B", "#EC4899", "#6366F1", "#14B8A6",
]));
const HEX_RE = /^#([0-9A-Fa-f]{6})$/;
const isHex = (s: string) => HEX_RE.test(s);
const randColor = () => PALETTE[Math.floor(Math.random() * PALETTE.length)];
import { ITEMS } from "@/components/stock/data";

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;

const COLUMNS = [
  { key: "sn", label: "SN" },
  { key: "name", label: "Group Name", sortable: true },
  { key: "items", label: "No of Item", sortable: true },
  { key: "description", label: "Description" },
  { key: "actions", label: "", align: "center" as const },
];

/* ── create / edit modal ──────────────────────────────────────── */
function GroupModal({
  group, onClose, onSave,
}: { group: StockGroupRow | null; onClose: () => void; onSave: (g: StockGroupRow) => void }) {
  const [name, setName] = useState(group?.name ?? "");
  const [description, setDescription] = useState(group?.description ?? "");
  const [color, setColor] = useState(group?.color ?? randColor());
  const [customHex, setCustomHex] = useState(
    group && !PALETTE.includes(group.color) ? group.color.replace("#", "") : "",
  );

  const valid = name.trim().length > 0 && isHex(color);
  const submit = () =>
    onSave({
      id: group?.id ?? 0,
      name: name.trim(),
      color,
      itemCount: group?.itemCount ?? 0,
      description: description.trim(),
    });
  const reset = () => {
    setName(group?.name ?? ""); setDescription(group?.description ?? "");
    setColor(group?.color ?? randColor()); setCustomHex("");
  };
  const applyCustom = (hex: string) => {
    setCustomHex(hex);
    const candidate = `#${hex}`;
    if (isHex(candidate)) setColor(candidate.toUpperCase());
  };

  return (
    <ModalShell
      title={group ? "Edit Stock Group" : "Create Stock Group"}
      size="lg"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={reset}>
            Reset
          </Button>
          <ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel={group ? "Save changes" : "Save Group"} disabled={!valid} />
        </div>
      }
    >
      <Input
        autoFocus
        label={<>Group Name<Req /></>}
        labelPlacement="outside"
        placeholder="Enter group name"
        size="sm" variant="bordered" value={name} onValueChange={setName}
        startContent={<span className="w-[10px] h-[10px] rounded-full flex-shrink-0" style={{ background: color }} />}
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
      />

      {/* Color picker */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={labelCx}>Color<Req /></span>
          <Button
            size="sm" variant="light" radius="md"
            className="h-7 text-[12px] font-semibold text-warm-600"
            startContent={<Shuffle size={13} color="#6B5F55" />}
            onPress={() => { const c = randColor(); setColor(c); setCustomHex(""); }}
          >
            Randomize
          </Button>
        </div>
        <div className="flex flex-wrap gap-[10px]">
          {PALETTE.map((c) => {
            const on = c.toUpperCase() === color.toUpperCase();
            return (
              <button
                key={c} type="button"
                onClick={() => { setColor(c); setCustomHex(""); }}
                className="w-8 h-8 rounded-[10px] flex items-center justify-center transition-transform active:scale-95"
                style={{
                  background: c,
                  border: on ? "2px solid #fff" : "2px solid transparent",
                  boxShadow: on ? `0 0 0 2px ${c}` : "none",
                }}
                aria-label={c}
              >
                {on && <Check size={16} color="#fff" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-9 h-9 rounded-[9px] flex-shrink-0 border border-warm-200"
            style={{ background: isHex(`#${customHex}`) ? `#${customHex}` : "#fff" }} />
          <Input
            size="sm" aria-label="Custom hex" placeholder="Custom hex e.g. F15022"
            value={customHex} onValueChange={applyCustom}
            startContent={<span className="text-[12px] text-warm-500 font-semibold">#</span>}
            variant="bordered"
            classNames={{ base: "flex-1", inputWrapper: wrapCx, input: `${inputCx} font-mono uppercase` }}
            maxLength={6}
          />
        </div>
      </div>

      <Textarea
        label="Description" labelPlacement="outside"
        placeholder="Enter description"
        minRows={3} maxLength={240}
        value={description} onValueChange={setDescription}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: `${wrapCx} h-auto min-h-[88px]`, input: inputCx }}
      />
    </ModalShell>
  );
}

/* ── detail drawer ─────────────────────────────────────────── */
function GroupDrawer({
  group, onClose, onEdit, onDelete,
}: { group: StockGroupRow; onClose: () => void; onEdit: () => void; onDelete: () => void }) {
  const itemsInGroup = useMemo(
    () => ITEMS.filter((i) => i.groups.includes(group.name as never)),
    [group.name],
  );

  return (
    <Drawer
      isOpen onClose={onClose} placement="right" size="sm"
      classNames={{
        base: "sm:max-w-[460px]",
        closeButton: "hidden",
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-2 border-b border-warm-200">
          <div className="flex-1 min-w-0 flex items-center gap-[9px]">
            <span className="w-[10px] h-[10px] rounded-full" style={{ background: group.color }} />
            <span className="text-[18px] font-extrabold text-ink tracking-[-0.02em] truncate">{group.name}</span>
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
            <DropdownMenu aria-label="Group actions">
              <DropdownItem key="del" className="text-[#F15022]" color="danger"
                startContent={<Trash2 size={15} color="#F15022" />} onPress={onDelete}>
                Move to trash
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button isIconOnly size="sm" variant="bordered" radius="md"
            className="w-[34px] h-[34px] min-w-[34px] border border-[#E6E1DC] bg-white"
            onPress={onClose}>
            <X size={16} color="#8A7D72" />
          </Button>
        </DrawerHeader>

        <DrawerBody className="px-5">
          <div className="pt-1 pb-[18px]">
            <div className="grid grid-cols-[110px_1fr] gap-y-3 gap-x-3 text-[13px]">
              <span className="text-warm-500 font-medium">No of Items</span>
              <span className="font-semibold text-ink">{group.itemCount}</span>
              <span className="text-warm-500 font-medium">Description</span>
              <span className="font-medium text-warm-700 leading-relaxed">
                {group.description?.trim() || <span className="text-warm-400">—</span>}
              </span>
            </div>
          </div>

          <div className="py-[18px] border-t border-warm-200">
            <h3 className="text-[13px] font-extrabold text-ink mb-3">Items Using This Group</h3>
            {itemsInGroup.length === 0 ? (
              <div className="border-[1.5px] border-dashed border-warm-200 rounded-[12px] py-[22px] text-center flex flex-col items-center gap-2">
                <div className="w-[34px] h-[34px] rounded-[10px] bg-warm-100 flex items-center justify-center">
                  <Box size={16} color="#C9BCB0" />
                </div>
                <span className="text-[12.5px] text-warm-500 font-medium">No items in this group yet.</span>
              </div>
            ) : (
              <div className="border border-[#EEEAE6] rounded-[12px] overflow-hidden">
                <div className="grid bg-cream border-b border-warm-200 px-3 py-2 text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em]"
                  style={{ gridTemplateColumns: "36px 1fr 96px 96px" }}>
                  <span>SN</span><span>Stock Item</span>
                  <span className="text-right">Default Price</span>
                  <span className="text-right">Stock Value</span>
                </div>
                {itemsInGroup.map((it, i) => (
                  <div key={it.id} className="grid px-3 py-[10px] items-center"
                    style={{
                      gridTemplateColumns: "36px 1fr 96px 96px",
                      borderBottom: i === itemsInGroup.length - 1 ? "none" : "1px solid #F4EFEB",
                    }}>
                    <span className="font-mono text-[12px] text-warm-500">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[13px] font-semibold text-ink truncate">{it.name}</span>
                    <span className="text-[13px] font-semibold text-warm-700 text-right tnum">{it.rate}</span>
                    <span className="text-[13px] font-bold text-ink text-right tnum">{it.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

/* ── page ──────────────────────────────────────────────────── */
export default function StockGroupsPage() {
  const s = useListState<StockGroupRow>({
    initial: STOCK_GROUPS.map((g) => ({ ...g })),
    searchableText: (g) => `${g.name} ${g.description ?? ""}`,
    sortAccessors: { name: (g) => g.name.toLowerCase(), items: (g) => g.itemCount },
  });
  const [viewing, setViewing] = useState<StockGroupRow | null>(null);

  // KPIs derived from items
  const highestValueGroup = useMemo(() => {
    const totals = new Map<string, number>();
    for (const it of ITEMS) {
      for (const g of it.groups) totals.set(g, (totals.get(g) ?? 0) + it.valueNum);
    }
    let topName = "—", topVal = -1;
    for (const [g, v] of totals) if (v > topVal) { topName = g; topVal = v; }
    return { name: topName, value: topVal };
  }, []);
  const mostItemsGroup = useMemo(() => {
    const top = [...s.items].sort((a, b) => b.itemCount - a.itemCount)[0];
    return top ?? { name: "—", itemCount: 0 };
  }, [s.items]);

  const kpis: KpiData[] = [
    {
      key: "groups", icon: Layers, tint: "#E3F6F1", accent: "#1FA98B",
      label: "Total Stock Groups", value: s.items.length, sub: "groups",
      sparkData: [2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, s.items.length],
    },
    {
      key: "highest", icon: DollarSign, tint: "#F3ECFF", accent: "#9B51E0",
      label: "Highest Stock Value", value: highestValueGroup.name,
      sparkData: [2, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8],
    },
    {
      key: "most", icon: Star, tint: "#FDECE4", accent: ORANGE,
      label: "Group with Most Items", value: mostItemsGroup.name,
      sub: `${mostItemsGroup.itemCount} items`,
      sparkData: [1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5],
    },
  ];

  const renderCell = (g: StockGroupRow, key: string) => {
    switch (key) {
      case "sn": return <span className="font-mono text-[12.5px] text-warm-500">{g.id}</span>;
      case "name": return (
        <button onClick={() => setViewing(g)}
          className="inline-flex items-center gap-[8px] text-[13.5px] font-semibold text-ink whitespace-nowrap hover:text-[#F15022] transition-colors">
          <span className="w-[9px] h-[9px] rounded-full flex-shrink-0" style={{ background: g.color }} />{g.name}
        </button>
      );
      case "items": return <span className="text-[13px] font-bold text-ink tnum">{g.itemCount}</span>;
      case "description": return (
        <span className="text-[12.5px] text-warm-600 line-clamp-1 max-w-[520px]">
          {g.description?.trim() || <span className="text-warm-400">—</span>}
        </span>
      );
      case "actions": return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(g)}>Edit</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color="#F15022" />} onPress={() => s.setDel({ item: g })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (g: StockGroupRow) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]" onClick={() => setViewing(g)}>
      <div className="flex items-start gap-3">
        <div className="w-[38px] h-[38px] rounded-[11px] flex-shrink-0 flex items-center justify-center"
          style={{ background: `${g.color}14`, border: `1px solid ${g.color}2E` }}>
          <span className="w-[14px] h-[14px] rounded-[5px]" style={{ background: g.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[15px] font-bold text-ink">{g.name}</span>
            <span className="text-[12px] font-semibold text-warm-500 tnum">{g.itemCount} items</span>
          </div>
          {g.description?.trim() && (
            <div className="mt-1 text-[12px] text-warm-600 line-clamp-2">{g.description}</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s}
        title="Stock Group"
        kpis={kpis}
        totalCount={s.items.length}
        columns={COLUMNS}
        renderCell={renderCell}
        renderCard={renderCard}
        onRowOpen={(g) => setViewing(g)}
        searchPlaceholder="Search groups…"
        addLabel="Add New"
        onAdd={() => s.setEditing(null)}
      />

      {s.editing !== undefined && (
        <GroupModal group={s.editing} onClose={() => s.setEditing(undefined)} onSave={(g) => { s.save(g); setViewing(null); }} />
      )}
      {s.del && (
        <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} groups`}
          onClose={() => s.setDel(null)}
          onConfirm={() => { s.doDelete((g) => `"${g.name}"`); setViewing(null); }} />
      )}
      {viewing && (
        <GroupDrawer
          group={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => { s.setEditing(viewing); setViewing(null); }}
          onDelete={() => { s.setDel({ item: viewing }); }}
        />
      )}
    </>
  );
}

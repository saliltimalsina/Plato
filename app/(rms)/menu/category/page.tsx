"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input, Textarea,
} from "@heroui/react";
import { MoreHorizontal, Pencil, Trash2, Layers, Star, Award, Sigma, UploadCloud } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { ModalShell, ModalFooterButtons, DeleteModal, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { KpiData, ORANGE } from "@/components/rms/primitives";
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

const EMOJI_CHOICES = ["🍱", "🥤", "🍳", "🍽️", "🍰", "🥨", "🍲", "🍔", "🍕", "🍣", "🍜", "🥗", "🍩", "🍪", "🥩", "🍤"];

function CategoryModal({
  category, onClose, onSave,
}: { category: Category | null; onClose: () => void; onSave: (c: Category) => void }) {
  const [name, setName] = useState(category?.name ?? "");
  const [emoji, setEmoji] = useState(category?.emoji ?? "🍽️");
  const [description, setDescription] = useState(category?.description ?? "");
  const valid = name.trim().length > 0;
  const submit = () =>
    onSave({
      id: category?.id ?? 0,
      name: name.trim(),
      emoji,
      dishCount: category?.dishCount ?? 0,
      description: description.trim(),
    });
  const reset = () => {
    setName(category?.name ?? ""); setEmoji(category?.emoji ?? "🍽️");
    setDescription(category?.description ?? "");
  };
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
        startContent={<span className="text-[16px] leading-none">{emoji}</span>}
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />

      <div className="flex flex-col gap-2">
        <span className={labelCx}>Category Image</span>
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-[10px] bg-warm-100 flex items-center justify-center text-[20px] flex-shrink-0">{emoji}</span>
          <button className="flex-1 flex items-center gap-3 h-11 px-3 rounded-[10px] border border-warm-200 bg-warm-50 hover:bg-warm-100 transition-colors text-left">
            <UploadCloud size={16} color="#8A7D72" />
            <span className="text-[13px] text-warm-500 font-medium">Click here to upload your image</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-[6px] mt-1">
          {EMOJI_CHOICES.map((e) => {
            const on = e === emoji;
            return (
              <button
                key={e} type="button" onClick={() => setEmoji(e)}
                className="w-9 h-9 rounded-[9px] flex items-center justify-center text-[16px] transition-colors"
                style={{
                  background: on ? "#FFF1EB" : "#fff",
                  border: `1px solid ${on ? "#F8C9B6" : "#E6E1DC"}`,
                }}
              >
                {e}
              </button>
            );
          })}
        </div>
      </div>

      <Textarea label="Description" labelPlacement="outside" placeholder="Enter description"
        minRows={3} maxLength={240} value={description} onValueChange={setDescription}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: `${wrapCx} h-auto min-h-[88px]`, input: inputCx }} />
    </ModalShell>
  );
}

export default function CategoryPage() {
  const router = useRouter();
  const s = useListState<Category>({
    initial: CATEGORIES.map((c) => ({ ...c })),
    searchableText: (c) => `${c.name} ${c.description ?? ""}`,
    sortAccessors: { name: (c) => c.name.toLowerCase(), dishCount: (c) => c.dishCount },
  });

  const active = s.items.filter((c) => c.dishCount > 0).length;
  const mostDishes = useMemo(() => {
    const top = [...s.items].sort((a, b) => b.dishCount - a.dishCount)[0];
    return { name: top?.name ?? "—", count: top?.dishCount ?? 0 };
  }, [s.items]);
  const totalDishes = s.items.reduce((sum, c) => sum + c.dishCount, 0);
  const avg = s.items.length ? Math.round(totalDishes / s.items.length) : 0;

  const kpis: KpiData[] = [
    {
      key: "total", icon: Layers, tint: "#E3F6F1", accent: "#1FA98B",
      label: "Total", value: `${s.items.length}/100`,
      delta: `${active} Active`, deltaUp: true,
      sparkData: [2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6, s.items.length],
    },
    {
      key: "top", icon: Star, tint: "#FDECE4", accent: ORANGE,
      label: "Top Sold", value: mostDishes.name,
      sub: `${mostDishes.count} orders`,
      sparkData: [1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, mostDishes.count || 1],
    },
    {
      key: "most", icon: Award, tint: "#FEE2E2", accent: "#E5484D",
      label: "Most Dishes", value: mostDishes.name,
      sub: `${mostDishes.count} dishes`,
      sparkData: [1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, mostDishes.count || 1],
    },
    {
      key: "avg", icon: Sigma, tint: "#F3ECFF", accent: "#9B51E0",
      label: "Avg. Dishes Per Category", value: String(avg),
      sparkData: [1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, avg || 1],
    },
  ];

  const renderCell = (c: Category, key: string) => {
    switch (key) {
      case "sn":          return <span className="font-mono text-[12.5px] text-warm-500">{c.id}</span>;
      case "name":        return (
        <button onClick={() => router.push(`/menu/category/${c.id}`)} className="inline-flex items-center gap-2 text-left hover:text-[#F15022] transition-colors">
          <span className="w-7 h-7 rounded-[8px] bg-warm-100 flex items-center justify-center text-[14px] flex-shrink-0">{c.emoji}</span>
          <span className="text-[13.5px] font-semibold text-ink whitespace-nowrap">{c.name}</span>
        </button>
      );
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
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]" onClick={() => router.push(`/menu/category/${c.id}`)}>
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-[10px] bg-warm-100 flex items-center justify-center text-[18px] flex-shrink-0">{c.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[14.5px] font-bold text-ink">{c.name}</span>
            <span className="text-[12px] font-semibold text-warm-500 tnum">{c.dishCount} dishes</span>
          </div>
          {c.description?.trim() && <div className="mt-1 text-[12px] text-warm-600 line-clamp-2">{c.description}</div>}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s} title="Category" kpis={kpis} totalCount={s.items.length}
        columns={COLUMNS} renderCell={renderCell} renderCard={renderCard}
        onRowOpen={(c) => router.push(`/menu/category/${c.id}`)}
        searchPlaceholder="Search categories…" addLabel="Add New" onAdd={() => s.setEditing(null)}
      />
      {s.editing !== undefined && <CategoryModal category={s.editing} onClose={() => s.setEditing(undefined)} onSave={s.save} />}
      {s.del && <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} categories`} onClose={() => s.setDel(null)} onConfirm={() => s.doDelete((c) => `"${c.name}"`)} />}
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import {
  ArrowDownLeft, ArrowUpRight, Wallet, MoreHorizontal, Eye, Pencil, Trash2,
  Check, Upload, Download,
} from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { DeleteModal } from "@/components/rms/ModalShell";
import { Avatar, Badge, ORANGE, KpiData } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import {
  SUPPLIERS, Supplier, DueDirection, DUE_DIRECTIONS, DIRECTION_TONE,
} from "@/components/rms/data/suppliers";
import { CreateSupplierModal } from "@/components/rms/suppliers/CreateSupplierModal";

const COLUMNS = [
  { key: "sn", label: "SN" },
  { key: "name", label: "Supplier", sortable: true },
  { key: "phone", label: "Phone" },
  { key: "dob", label: "DOB" },
  { key: "due", label: "Due Amount", sortable: true },
  { key: "email", label: "Email" },
  { key: "actions", label: "", align: "center" as const },
];

const AVATAR_COLOR = "#7C3AED";

function dueText(s: Supplier) {
  if (s.direction === "Settled" || s.dueAmount === 0) return "Settled";
  return `Rs ${s.dueAmount.toLocaleString()} · ${s.direction}`;
}

export default function SuppliersPage() {
  const router = useRouter();
  const [statusTab, setStatusTab] = useState("all");
  const [dirs, setDirs] = useState<DueDirection[]>([]);

  const filterPredicate = useMemo(() => (sup: Supplier) => {
    const md = dirs.length === 0 || dirs.includes(sup.direction);
    const mt = statusTab === "all" || sup.direction === statusTab;
    return md && mt;
  }, [dirs, statusTab]);

  const s = useListState<Supplier>({
    initial: SUPPLIERS.map((x) => ({ ...x })),
    searchableText: (x) => `${x.name} ${x.phone} ${x.email}`,
    sortAccessors: {
      name: (x) => x.name.toLowerCase(),
      due: (x) => x.dueAmount,
    },
    filterPredicate,
  });

  const toReceive = s.items.filter((x) => x.direction === "To Receive").reduce((a, x) => a + x.dueAmount, 0);
  const toPay = s.items.filter((x) => x.direction === "To Pay").reduce((a, x) => a + x.dueAmount, 0);
  const net = toReceive - toPay;

  const kpis: KpiData[] = [
    {
      key: "receive", icon: ArrowDownLeft, tint: "#E6F7F3", accent: "#1FA98B",
      label: "To Receive", value: `Rs ${toReceive.toLocaleString()}`, delta: "+8%", deltaUp: true,
      sparkData: [3, 4, 4, 5, 6, 6, 7, 7, 8, 8, 9, 10],
    },
    {
      key: "pay", icon: ArrowUpRight, tint: "#FFF1EE", accent: ORANGE,
      label: "To Pay", value: `Rs ${toPay.toLocaleString()}`, delta: "+4%", deltaUp: false,
      sparkData: [6, 6, 7, 7, 8, 8, 9, 9, 10, 11, 11, 12],
    },
    {
      key: "net", icon: Wallet, tint: "#F3ECFF", accent: "#7C3AED",
      label: "Net To Receive", value: `Rs ${net.toLocaleString()}`, delta: "+2%", deltaUp: net >= 0,
      sparkData: [2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8],
    },
  ];

  const statusTabs = [
    { key: "all", label: "All", count: s.filtered.length },
    { key: "To Receive", label: "To Receive", count: s.items.filter((x) => x.direction === "To Receive").length },
    { key: "To Pay", label: "To Pay", count: s.items.filter((x) => x.direction === "To Pay").length },
    { key: "Settled", label: "Settled", count: s.items.filter((x) => x.direction === "Settled").length },
  ];

  const dueBadge = (sup: Supplier) => (
    <Badge tone={DIRECTION_TONE[sup.direction]}>{dueText(sup)}</Badge>
  );

  const renderCell = (sup: Supplier, key: string) => {
    switch (key) {
      case "sn": return <span className="font-mono text-[12.5px] text-warm-500">{String(sup.id).padStart(2, "0")}</span>;
      case "name": return (
        <div className="flex items-center gap-[10px]">
          <Avatar initials={sup.initials} color={AVATAR_COLOR} size={34} />
          <span className="text-[13.5px] font-bold text-ink whitespace-nowrap">{sup.name}</span>
        </div>
      );
      case "phone": return <span className="text-[13px] text-warm-600 tnum whitespace-nowrap">{sup.phone}</span>;
      case "dob": return <span className="text-[13px] text-warm-600 tnum whitespace-nowrap">{sup.dob}</span>;
      case "due": return dueBadge(sup);
      case "email": return <span className="text-[12.5px] text-warm-500 max-w-[180px] inline-block truncate">{sup.email}</span>;
      case "actions": return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="view" startContent={<Eye size={15} color="#8A7D72" />} onPress={() => router.push(`/inventory/suppliers/${sup.id}`)}>View details</DropdownItem>
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.toast(`Edit ${sup.name} — coming soon`, "secondary")}>Edit</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color={ORANGE} />} onPress={() => s.setDel({ item: sup })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (sup: Supplier) => (
    <div onClick={() => router.push(`/inventory/suppliers/${sup.id}`)} className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px] cursor-pointer active:bg-warm-50">
      <div className="flex items-center gap-3">
        <Avatar initials={sup.initials} color={AVATAR_COLOR} size={46} />
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold text-ink">{sup.name}</div>
          <div className="text-[12.5px] text-warm-500 tnum mt-[2px]">{sup.phone}</div>
        </div>
        {dueBadge(sup)}
      </div>
      <div className="mt-[11px] pt-[11px] border-t border-warm-200 flex items-center justify-between">
        <span className="text-[12px] text-warm-500 truncate">{sup.email}</span>
      </div>
    </div>
  );

  const filterContent = (
    <div className="w-full">
      <div className="px-[14px] py-[10px] border-b border-warm-200 justify-between items-center lg:flex hidden">
        <span className="text-[12px] font-bold text-ink">Filter by due</span>
        {dirs.length > 0 && <button onClick={() => setDirs([])} className="text-[11.5px] font-semibold" style={{ color: ORANGE }}>Clear</button>}
      </div>
      <div className="p-[6px] flex flex-wrap lg:block gap-2">
        {DUE_DIRECTIONS.map((d) => {
          const on = dirs.includes(d);
          const tone = DIRECTION_TONE[d];
          const c = tone === "success" ? "#1FA98B" : tone === "danger" ? ORANGE : "#6B5F55";
          return (
            <button key={d} onClick={() => setDirs((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d])}
              className="lg:w-full flex items-center justify-between lg:px-[9px] px-[13px] py-[7px] rounded-lg lg:rounded-lg rounded-full hover:bg-warm-100 lg:border-0 border"
              style={{ borderColor: on ? c : "#E6E1DC", background: on ? `${c}14` : undefined }}>
              <span className="inline-flex items-center gap-2 text-[13px] font-medium" style={{ color: on ? c : "#3F3933" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{d}
              </span>
              {on && <Check size={15} color={ORANGE} className="hidden lg:block" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s}
        title="Suppliers"
        kpis={kpis}
        totalCount={s.items.length}
        columns={COLUMNS}
        renderCell={renderCell}
        renderCard={renderCard}
        onRowOpen={(sup) => router.push(`/inventory/suppliers/${sup.id}`)}
        searchPlaceholder="Search suppliers…"
        statusTabs={statusTabs}
        statusKey={statusTab}
        onStatus={setStatusTab}
        filterContent={filterContent}
        filterCount={dirs.length}
        addLabel="Add New"
        onAdd={() => s.setEditing(null)}
        moreActions={[
          { key: "export", label: "Export to Excel", icon: Upload },
          { key: "import", label: "Import suppliers", icon: Download },
        ]}
        onMore={(k) => s.toast(`${k} — coming soon`, "secondary")}
      />

      {s.editing !== undefined && (
        <CreateSupplierModal onClose={() => s.setEditing(undefined)} onSave={s.save} />
      )}
      {s.del && (
        <DeleteModal
          label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} suppliers`}
          onClose={() => s.setDel(null)}
          onConfirm={() => s.doDelete((it) => `"${it.name}"`)}
        />
      )}
    </>
  );
}

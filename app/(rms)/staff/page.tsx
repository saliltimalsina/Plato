"use client";

import { useMemo, useState } from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Users, UserCheck, Clock, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { DeleteModal } from "@/components/rms/ModalShell";
import { Avatar, Badge, ORANGE, KpiData } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import { STAFF, Staff, ROLE_CONFIG, StaffStatus } from "@/components/rms/data/staff";
import { StaffDetail } from "@/components/rms/staff/StaffDetail";
import { CreateStaffModal } from "@/components/rms/staff/CreateStaffModal";

const COLUMNS = [
  { key: "sn", label: "SN" },
  { key: "name", label: "Name", sortable: true },
  { key: "role", label: "Role" },
  { key: "position", label: "Position" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "actions", label: "", align: "center" as const },
];

export default function StaffPage() {
  const [statusTab, setStatusTab] = useState<StaffStatus>("active");

  const filterPredicate = useMemo(
    () => (st: Staff) => st.status === statusTab,
    [statusTab]
  );

  const s = useListState<Staff>({
    initial: STAFF.map((m) => ({ ...m })),
    searchableText: (m) => `${m.name} ${m.position} ${m.email}`,
    sortAccessors: { name: (m) => m.name.toLowerCase() },
    filterPredicate,
  });

  const activeCount = s.items.filter((m) => m.status === "active").length;
  const pendingCount = s.items.filter((m) => m.status === "pending").length;

  const kpis: KpiData[] = [
    { key: "total", icon: Users, tint: "#E7F6F4", accent: "#0D9488", label: "Total Staff", value: s.items.length, sparkData: [3, 4, 4, 5, 5, 5, 6, 6, 6, 6, 6, s.items.length] },
    { key: "active", icon: UserCheck, tint: "#E7F6EC", accent: "#22C55E", label: "Active", value: activeCount, sparkData: [2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, Math.max(1, activeCount)] },
    { key: "pending", icon: Clock, tint: "#FDECE4", accent: ORANGE, label: "Pending", value: pendingCount, sparkData: [1, 1, 1, 2, 1, 2, 2, 1, 2, 2, 2, Math.max(1, pendingCount)] },
  ];

  const statusTabs = [
    { key: "active", label: "Active", count: activeCount },
    { key: "pending", label: "Pending", count: pendingCount },
  ];

  const renderCell = (m: Staff, key: string) => {
    const rc = ROLE_CONFIG[m.role];
    switch (key) {
      case "sn":
        return <span className="font-mono text-[12.5px] text-warm-500">{String(m.id).padStart(2, "0")}</span>;
      case "name":
        return (
          <div className="flex items-center gap-[10px]">
            <Avatar initials={m.initials} color={rc.color} size={34} />
            <span className="text-[13.5px] font-bold text-ink whitespace-nowrap">{m.name}</span>
          </div>
        );
      case "role":
        return <Badge tone={rc.tone}>{rc.label}</Badge>;
      case "position":
        return <span className="text-[13px] text-warm-600 whitespace-nowrap">{m.position || "—"}</span>;
      case "phone":
        return <span className="text-[13px] text-warm-600 tnum whitespace-nowrap">{m.phone || "—"}</span>;
      case "email":
        return <span className="text-[12.5px] text-warm-500 whitespace-nowrap">{m.email || "—"}</span>;
      case "actions":
        return (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Row actions">
              <DropdownItem key="view" startContent={<Eye size={15} color="#8A7D72" />} onPress={() => s.setDetail(m)}>View details</DropdownItem>
              <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(m)}>Edit</DropdownItem>
              <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color={ORANGE} />} onPress={() => s.setDel({ item: m })}>Move to trash</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return null;
    }
  };

  const renderCard = (m: Staff) => {
    const rc = ROLE_CONFIG[m.role];
    return (
      <div onClick={() => s.setDetail(m)} className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px] cursor-pointer active:bg-warm-50">
        <div className="flex items-center gap-3">
          <Avatar initials={m.initials} color={rc.color} size={46} />
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-ink truncate">{m.name}</div>
            <div className="flex items-center gap-[7px] mt-[3px]">
              <Badge tone={rc.tone}>{rc.label}</Badge>
              {m.position && <><span className="text-[11.5px] text-warm-500">·</span><span className="text-[12px] font-semibold text-warm-500">{m.position}</span></>}
            </div>
          </div>
        </div>
        <div className="mt-[11px] pt-[11px] border-t border-warm-200 flex items-center justify-between">
          <span className="text-[12.5px] text-warm-500 tnum">{m.phone || "—"}</span>
          <Badge tone={m.status === "active" ? "success" : "warning"} dot>{m.status === "active" ? "Active" : "Pending"}</Badge>
        </div>
      </div>
    );
  };

  return (
    <>
      <ListScaffold
        state={s}
        title="Staff"
        kpis={kpis}
        totalCount={s.items.length}
        columns={COLUMNS}
        renderCell={renderCell}
        renderCard={renderCard}
        onRowOpen={(m) => s.setDetail(m)}
        searchPlaceholder="Search staff…"
        statusTabs={statusTabs}
        statusKey={statusTab}
        onStatus={(k) => setStatusTab(k as StaffStatus)}
        addLabel="Add Staff"
        onAdd={() => s.setEditing(null)}
      />

      {s.editing !== undefined && (
        <CreateStaffModal onClose={() => s.setEditing(undefined)} onSave={s.save} />
      )}
      {s.detail && (
        <StaffDetail
          staff={s.detail}
          onClose={() => s.setDetail(null)}
          onEdit={(m) => { s.setDetail(null); s.setEditing(m); }}
          onDelete={(m) => s.setDel({ item: m })}
        />
      )}
      {s.del && (
        <DeleteModal
          label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} staff`}
          onClose={() => s.setDel(null)}
          onConfirm={() => s.doDelete((m) => `"${m.name}"`)}
        />
      )}
    </>
  );
}

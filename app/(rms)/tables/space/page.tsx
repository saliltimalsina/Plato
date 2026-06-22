"use client";

import { useState } from "react";
import {
  Button, Input, Textarea, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from "@heroui/react";
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown, Eye, LayoutGrid } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { ModalShell, ModalFooterButtons, DeleteModal, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { KpiData } from "@/components/rms/primitives";
import { SpaceDetailDrawer } from "@/components/rms/SpaceDetailDrawer";
import { useListState } from "@/components/rms/useListState";
import { Space, SPACES, SPACE_LIMIT, TABLES, tablesInSpace, spaceCapacity } from "@/components/rms/data/tables";

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;

const COLUMNS = [
  { key: "sn",          label: "SN" },
  { key: "name",        label: "Name", sortable: true },
  { key: "totalTables", label: "Total Tables" },
  { key: "capacity",    label: "Capacity" },
  { key: "actions",     label: "", align: "center" as const },
];

function SpaceModal({
  space, onClose, onSave,
}: { space: Space | null; onClose: () => void; onSave: (s: Space) => void }) {
  const [name, setName] = useState(space?.name ?? "");
  const [description, setDescription] = useState(space?.description ?? "");
  const valid = name.trim().length > 0;
  const reset = () => { setName(space?.name ?? ""); setDescription(space?.description ?? ""); };
  return (
    <ModalShell
      title={space ? "Edit Space" : "Create Space"} size="lg" onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={reset}>Reset</Button>
          <ModalFooterButtons onCancel={onClose} onConfirm={() => onSave({ id: space?.id ?? 0, name: name.trim(), description: description.trim() })}
            confirmLabel={space ? "Save changes" : "Save Space"} disabled={!valid} />
        </div>
      }
    >
      <Input autoFocus label={<>Space Name<Req /></>} labelPlacement="outside" placeholder="e.g. Upstairs, Patio"
        size="sm" variant="bordered" value={name} onValueChange={setName}
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
      <Textarea label="Description" labelPlacement="outside" placeholder="Enter description"
        minRows={3} maxLength={240} value={description} onValueChange={setDescription}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: `${wrapCx} h-auto min-h-[88px]`, input: inputCx }} />
    </ModalShell>
  );
}

export default function SpacesPage() {
  const s = useListState<Space>({
    initial: SPACES.map((m) => ({ ...m })),
    searchableText: (m) => m.name,
    sortAccessors: { name: (m) => m.name.toLowerCase() },
  });

  const kpis: KpiData[] = [
    { key: "total", icon: LayoutGrid, tint: "#E3F6F1", accent: "#1FA98B",
      label: "Total Spaces", value: `${s.items.length}/${SPACE_LIMIT}`,
      sparkData: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, s.items.length] },
  ];

  const renderCell = (m: Space, key: string) => {
    switch (key) {
      case "sn":          return <span className="font-mono text-[12.5px] text-warm-500">{m.id}</span>;
      case "name":        return <span className="text-[13.5px] font-semibold text-ink">{m.name}</span>;
      case "totalTables": return <span className="text-[13px] font-bold text-ink tnum">{tablesInSpace(TABLES, m.name).length}</span>;
      case "capacity":    return <span className="text-[13px] font-bold text-ink tnum">{spaceCapacity(TABLES, m.name)}</span>;
      case "actions": return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="view" startContent={<Eye size={15} color="#8A7D72" />} onPress={() => s.setDetail(m)}>View Space</DropdownItem>
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(m)}>Edit Space</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color="#F15022" />} onPress={() => s.setDel({ item: m })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (m: Space) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]" onClick={() => s.setDetail(m)}>
      <div className="text-[14.5px] font-bold text-ink">{m.name}</div>
      <div className="mt-2 flex items-center gap-4 text-[12.5px] text-warm-600">
        <span>Tables <span className="font-bold text-ink tnum">{tablesInSpace(TABLES, m.name).length}</span></span>
        <span>Capacity <span className="font-bold text-ink tnum">{spaceCapacity(TABLES, m.name)}</span></span>
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s} title="Spaces" totalCount={s.items.length}
        kpis={kpis}
        columns={COLUMNS} renderCell={renderCell} renderCard={renderCard}
        selectable={false}
        onRowOpen={(m) => s.setDetail(m)}
        searchPlaceholder="Search spaces…" addLabel="Add New" onAdd={() => s.setEditing(null)}
        moreActions={[{ key: "arrange", label: "Arrange", icon: ArrowUpDown }]}
        onMore={() => s.toast("Drag rows to arrange (coming soon)", "primary")}
      />
      {s.detail && (
        <SpaceDetailDrawer
          space={s.detail}
          onClose={() => s.setDetail(null)}
          onEdit={() => { const m = s.detail!; s.setDetail(null); s.setEditing(m); }}
          onDelete={() => { const m = s.detail!; s.setDetail(null); s.setDel({ item: m }); }}
        />
      )}
      {s.editing !== undefined && <SpaceModal space={s.editing} onClose={() => s.setEditing(undefined)} onSave={s.save} />}
      {s.del && <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} spaces`} onClose={() => s.setDel(null)} onConfirm={() => s.doDelete((m) => `"${m.name}"`)} />}
    </>
  );
}

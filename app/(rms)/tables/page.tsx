"use client";

import { useState } from "react";
import {
  Button, Input, Select, SelectItem, Switch, Dropdown, DropdownTrigger,
  DropdownMenu, DropdownItem,
} from "@heroui/react";
import {
  MoreHorizontal, Pencil, Trash2, Eye, Plus, Minus, Armchair, CheckCircle2, Users,
} from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { ModalShell, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { DeleteModal } from "@/components/rms/ModalShell";
import { Badge, KpiData, Tone, ORANGE } from "@/components/rms/primitives";
import { TableDetailDrawer } from "@/components/rms/TableDetailDrawer";
import { useListState } from "@/components/rms/useListState";
import {
  RestoTable, TableStatus, TABLES, SPACES, TABLE_TYPES, TABLE_LIMIT, TableTypeName,
} from "@/components/rms/data/tables";

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;

const COLUMNS = [
  { key: "sn",        label: "SN" },
  { key: "name",      label: "Table Name", sortable: true },
  { key: "type",      label: "Types" },
  { key: "space",     label: "Space" },
  { key: "capacity",  label: "Capacity", sortable: true },
  { key: "charge",    label: "Charge" },
  { key: "status",    label: "Status" },
  { key: "available", label: "Available", align: "center" as const },
  { key: "actions",   label: "", align: "center" as const },
];

const STATUS_TONE: Record<TableStatus, Tone> = {
  Open: "primary", Occupied: "success", Reserved: "warning",
};

/* ── capacity stepper ─────────────────────────────────────────── */
function Stepper({ value, onChange, min = 1 }: { value: number; onChange: (n: number) => void; min?: number }) {
  return (
    <div className="inline-flex items-stretch h-10 rounded-[9px] border border-[#E6E1DC] bg-white overflow-hidden">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
        className="px-3 text-warm-600 hover:bg-warm-100 transition-colors">
        <Minus size={15} />
      </button>
      <span className="px-4 inline-flex items-center text-[14px] font-bold text-ink tnum border-x border-[#EFEAE6]">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)}
        className="px-3 text-warm-600 hover:bg-warm-100 transition-colors">
        <Plus size={15} />
      </button>
    </div>
  );
}

const selectCx = { label: labelCx, trigger: wrapCx, value: inputCx };

/* ── Create / Edit single table ───────────────────────────────── */
function TableModal({
  table, onClose, onSave, onBulk,
}: {
  table: RestoTable | null;
  onClose: () => void;
  onSave: (t: RestoTable) => void;
  onBulk: () => void;
}) {
  const [name, setName]         = useState(table?.name ?? "");
  const [type, setType]         = useState<TableTypeName | "">(table?.type ?? "");
  const [capacity, setCapacity] = useState(table?.capacity ?? 4);
  const [space, setSpace]       = useState(table?.space ?? "");
  const [enableCharge, setEnableCharge] = useState((table?.charge ?? 0) > 0);
  const [charge, setCharge]     = useState(table?.charge ? String(table.charge) : "");

  const valid = name.trim().length > 0;
  const submit = () => onSave({
    id: table?.id ?? 0,
    name: name.trim(),
    type: (type || "Table") as TableTypeName,
    space,
    capacity,
    charge: enableCharge ? Number(charge) || 0 : 0,
    status: table?.status ?? "Open",
    available: table?.available ?? true,
  });
  const reset = () => {
    setName(table?.name ?? ""); setType(table?.type ?? ""); setCapacity(table?.capacity ?? 4);
    setSpace(table?.space ?? ""); setEnableCharge((table?.charge ?? 0) > 0);
    setCharge(table?.charge ? String(table.charge) : "");
  };

  return (
    <ModalShell
      title={table ? "Edit Table" : "Create Table"} size="lg" onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="flat" radius="md"
            className="font-bold"
            style={{ background: "#FFF1EB", color: ORANGE, border: "1px solid #F8C9B6" }}
            startContent={<Plus size={15} color={ORANGE} strokeWidth={2.4} />}
            onPress={onBulk}>
            Add Bulk Table
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={reset}>Reset</Button>
            <Button radius="md" isDisabled={!valid} className="font-bold disabled:opacity-100"
              style={{
                background: valid ? ORANGE : "#EFE8E2",
                color: valid ? "#fff" : "#B7A99E",
                boxShadow: valid ? "0 2px 8px rgba(241,80,34,0.32)" : "none",
              }}
              onPress={submit}>
              {table ? "Save changes" : "Save Table"}
            </Button>
          </div>
        </div>
      }
    >
      <Input autoFocus label={<>Table Name<Req /></>} labelPlacement="outside" placeholder="Name or Number"
        size="sm" variant="bordered" value={name} onValueChange={setName}
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />

      <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
        <Select label="Table Type" labelPlacement="outside" placeholder="Select Table Type"
          selectedKeys={type ? [type] : []}
          onSelectionChange={(k) => setType((Array.from(k)[0] as TableTypeName) ?? "")}
          size="sm" variant="bordered" radius="md" classNames={selectCx}>
          {TABLE_TYPES.map((t) => <SelectItem key={t}>{t}</SelectItem>)}
        </Select>
        <div className="flex flex-col gap-2">
          <span className={labelCx}>Capacity</span>
          <Stepper value={capacity} onChange={setCapacity} />
        </div>
      </div>

      <Select label="Space" labelPlacement="outside" placeholder="Select Space"
        selectedKeys={space ? [space] : []}
        onSelectionChange={(k) => setSpace((Array.from(k)[0] as string) ?? "")}
        size="sm" variant="bordered" radius="md" classNames={selectCx}>
        {SPACES.map((sp) => <SelectItem key={sp.name}>{sp.name}</SelectItem>)}
      </Select>

      <div className="flex items-center justify-between">
        <span className="text-[13px] font-bold text-ink">Enable Charge</span>
        <Switch isSelected={enableCharge} onValueChange={setEnableCharge} size="sm"
          classNames={{ wrapper: enableCharge ? "bg-[#15803D]" : "" }} />
      </div>
      {enableCharge && (
        <Input label="Charge" labelPlacement="outside" placeholder="0" type="number"
          size="sm" variant="bordered" value={charge} onValueChange={setCharge}
          startContent={<span className="text-[13px] text-warm-500 font-semibold">Rs</span>}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }} />
      )}
    </ModalShell>
  );
}

/* ── Create tables in bulk ────────────────────────────────────── */
interface BulkRow { key: number; name: string; capacity: number; space: string; type: TableTypeName | ""; charge: string }
let bulkKeySeed = 1;
const newBulkRow = (): BulkRow => ({ key: bulkKeySeed++, name: "", capacity: 4, space: "", type: "", charge: "" });

function BulkTableModal({
  onClose, onSave, onSingle,
}: {
  onClose: () => void;
  onSave: (rows: RestoTable[]) => void;
  onSingle: () => void;
}) {
  const [rows, setRows] = useState<BulkRow[]>([newBulkRow()]);
  const [enableCharge, setEnableCharge] = useState(false);

  const patch = (key: number, p: Partial<BulkRow>) =>
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...p } : r)));
  const removeRow = (key: number) => setRows((prev) => prev.filter((r) => r.key !== key));
  const addRow = () => setRows((prev) => [...prev, newBulkRow()]);
  const generateRows = () => setRows((prev) => [...prev, ...Array.from({ length: 5 }, newBulkRow)]);

  const valid = rows.some((r) => r.name.trim().length > 0);
  const submit = () => onSave(
    rows.filter((r) => r.name.trim()).map((r) => ({
      id: 0,
      name: r.name.trim(),
      type: (r.type || "Table") as TableTypeName,
      space: r.space,
      capacity: r.capacity,
      charge: enableCharge ? Number(r.charge) || 0 : 0,
      status: "Open" as TableStatus,
      available: true,
    })),
  );

  return (
    <ModalShell
      title="Create Table in Bulk" size="5xl" onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="flat" radius="md" className="font-bold"
            style={{ background: "#FFF1EB", color: ORANGE, border: "1px solid #F8C9B6" }}
            startContent={<Plus size={15} color={ORANGE} strokeWidth={2.4} />}
            onPress={onSingle}>
            Add Single Table
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={() => setRows([newBulkRow()])}>Reset</Button>
            <Button radius="md" isDisabled={!valid} className="font-bold disabled:opacity-100"
              style={{
                background: valid ? ORANGE : "#EFE8E2",
                color: valid ? "#fff" : "#B7A99E",
                boxShadow: valid ? "0 2px 8px rgba(241,80,34,0.32)" : "none",
              }}
              onPress={submit}>
              Save Tables
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-ink">Enable Charge</span>
          <Switch isSelected={enableCharge} onValueChange={setEnableCharge} size="sm"
            classNames={{ wrapper: enableCharge ? "bg-[#15803D]" : "" }} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <div key={r.key}
            className="grid gap-3 items-end"
            style={{ gridTemplateColumns: enableCharge ? "1.4fr auto 1.2fr 1.2fr 1fr 36px" : "1.4fr auto 1.2fr 1.2fr 36px" }}>
            <Input label={i === 0 ? <>Table Name<Req /></> : undefined} labelPlacement="outside" placeholder="Enter Table Name"
              size="sm" variant="bordered" value={r.name} onValueChange={(v) => patch(r.key, { name: v })}
              classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
            <div className="flex flex-col gap-2">
              {i === 0 && <span className={labelCx}>Capacity</span>}
              <Stepper value={r.capacity} onChange={(n) => patch(r.key, { capacity: n })} />
            </div>
            <Select label={i === 0 ? "Space" : undefined} labelPlacement="outside" placeholder="Select Space"
              selectedKeys={r.space ? [r.space] : []}
              onSelectionChange={(k) => patch(r.key, { space: (Array.from(k)[0] as string) ?? "" })}
              size="sm" variant="bordered" radius="md" classNames={selectCx}>
              {SPACES.map((sp) => <SelectItem key={sp.name}>{sp.name}</SelectItem>)}
            </Select>
            <Select label={i === 0 ? "Table Type" : undefined} labelPlacement="outside" placeholder="Select Table Type"
              selectedKeys={r.type ? [r.type] : []}
              onSelectionChange={(k) => patch(r.key, { type: (Array.from(k)[0] as TableTypeName) ?? "" })}
              size="sm" variant="bordered" radius="md" classNames={selectCx}>
              {TABLE_TYPES.map((t) => <SelectItem key={t}>{t}</SelectItem>)}
            </Select>
            {enableCharge && (
              <Input label={i === 0 ? "Charge" : undefined} labelPlacement="outside" placeholder="0" type="number"
                size="sm" variant="bordered" value={r.charge} onValueChange={(v) => patch(r.key, { charge: v })}
                startContent={<span className="text-[12px] text-warm-500 font-semibold">Rs</span>}
                classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }} />
            )}
            <button type="button" onClick={() => removeRow(r.key)} disabled={rows.length === 1}
              className="w-9 h-10 inline-flex items-center justify-center rounded-[9px] hover:bg-[#FDECE4] disabled:opacity-30">
              <Trash2 size={15} color="#F15022" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button size="sm" variant="bordered" radius="md"
          className="h-9 border border-[#E6E1DC] bg-warm-50 font-semibold text-warm-700"
          startContent={<Plus size={14} color="#6B5F55" strokeWidth={2.4} />} onPress={addRow}>
          Add Row
        </Button>
        <Button size="sm" variant="bordered" radius="md"
          className="h-9 border border-[#E6E1DC] bg-warm-50 font-semibold text-warm-700"
          startContent={<Plus size={14} color="#6B5F55" strokeWidth={2.4} />} onPress={generateRows}>
          Generate Multiple Rows
        </Button>
      </div>
    </ModalShell>
  );
}

/* ── page ─────────────────────────────────────────────────────── */
export default function TablesPage() {
  const s = useListState<RestoTable>({
    initial: TABLES.map((t) => ({ ...t })),
    searchableText: (t) => `${t.name} ${t.type} ${t.space}`,
    sortAccessors: {
      name: (t) => t.name.toLowerCase(),
      capacity: (t) => t.capacity,
    },
  });

  const [bulkOpen, setBulkOpen] = useState(false);

  const total = s.items.length;
  const activeCount = s.items.filter((t) => t.available).length;
  const occupiedCount = s.items.filter((t) => t.status === "Occupied").length;

  const toggleAvailable = (t: RestoTable) =>
    s.setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, available: !x.available } : x)));

  const kpis: KpiData[] = [
    { key: "total", icon: Armchair, tint: "#EDE9FE", accent: "#6D28D9",
      label: "Total Tables", value: `${total}/${TABLE_LIMIT}`,
      sparkData: [1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, total] },
    { key: "active", icon: CheckCircle2, tint: "#E3F6F1", accent: "#1FA98B",
      label: "Active Tables", value: `${activeCount}/${total}`,
      delta: `${activeCount} Active`, deltaUp: true,
      sparkData: [1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 3, activeCount] },
    { key: "occupied", icon: Users, tint: "#FDECE4", accent: ORANGE,
      label: "Occupied Tables", value: `${occupiedCount}/${total}`,
      delta: `${occupiedCount} Occupied`, deltaTone: "red",
      sparkData: [0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, occupiedCount] },
  ];

  const renderCell = (t: RestoTable, key: string) => {
    switch (key) {
      case "sn":       return <span className="font-mono text-[12.5px] text-warm-500">{t.id}</span>;
      case "name":     return <span className="text-[13.5px] font-semibold text-ink whitespace-nowrap">{t.name}</span>;
      case "type":     return <span className="text-[13px] text-warm-700">{t.type}</span>;
      case "space":    return <span className="text-[13px] text-warm-600">{t.space || "—"}</span>;
      case "capacity": return <span className="text-[13px] font-bold text-ink tnum">{t.capacity}</span>;
      case "charge":   return <span className="text-[13px] text-warm-700 tnum">{t.charge ? `Rs ${t.charge}` : "—"}</span>;
      case "status":   return <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge>;
      case "available": return (
        <div className="flex justify-center">
          <Switch isSelected={t.available} onValueChange={() => toggleAvailable(t)} size="sm"
            classNames={{ wrapper: t.available ? "bg-[#15803D]" : "" }} aria-label={`Toggle ${t.name}`} />
        </div>
      );
      case "actions": return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="view" startContent={<Eye size={15} color="#8A7D72" />} onPress={() => s.setDetail(t)}>View Table</DropdownItem>
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(t)}>Edit Table</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color="#F15022" />} onPress={() => s.setDel({ item: t })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (t: RestoTable) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]" onClick={() => s.setDetail(t)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[14.5px] font-bold text-ink">{t.name}</span>
        <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge>
      </div>
      <div className="mt-2 flex items-center gap-4 text-[12.5px] text-warm-600">
        <span>{t.type}</span>
        <span>Cap. <span className="font-bold text-ink tnum">{t.capacity}</span></span>
        <span>{t.charge ? `Rs ${t.charge}` : "No charge"}</span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[12px] text-warm-500">{t.space || "Unassigned"}</span>
        <Switch isSelected={t.available} onValueChange={() => toggleAvailable(t)} size="sm"
          classNames={{ wrapper: t.available ? "bg-[#15803D]" : "" }} aria-label={`Toggle ${t.name}`} />
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s} title="Tables" totalCount={total}
        kpis={kpis}
        columns={COLUMNS} renderCell={renderCell} renderCard={renderCard}
        onRowOpen={(t) => s.setDetail(t)}
        searchPlaceholder="Search tables…" addLabel="Add New" onAdd={() => s.setEditing(null)}
      />
      {s.detail && (
        <TableDetailDrawer
          table={s.detail}
          onClose={() => s.setDetail(null)}
          onEdit={() => { const t = s.detail!; s.setDetail(null); s.setEditing(t); }}
          onDelete={() => { const t = s.detail!; s.setDetail(null); s.setDel({ item: t }); }}
          onToggle={(v) => { toggleAvailable(s.detail!); s.setDetail({ ...s.detail!, available: v }); }}
        />
      )}
      {s.editing !== undefined && (
        <TableModal
          table={s.editing}
          onClose={() => s.setEditing(undefined)}
          onSave={s.save}
          onBulk={() => { s.setEditing(undefined); setBulkOpen(true); }}
        />
      )}
      {bulkOpen && (
        <BulkTableModal
          onClose={() => setBulkOpen(false)}
          onSingle={() => { setBulkOpen(false); s.setEditing(null); }}
          onSave={(newRows) => {
            s.setItems((prev) => {
              let nid = Math.max(0, ...prev.map((x) => x.id));
              const added = newRows.map((r) => ({ ...r, id: ++nid }));
              return [...added, ...prev];
            });
            s.toast(`${newRows.length} tables added`);
            setBulkOpen(false);
          }}
        />
      )}
      {s.del && <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} tables`} onClose={() => s.setDel(null)} onConfirm={() => s.doDelete((t) => `"${t.name}"`)} />}
    </>
  );
}

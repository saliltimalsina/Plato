"use client";

import { useState } from "react";
import {
  Button, Input, Textarea, Switch, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from "@heroui/react";
import { MoreHorizontal, Pencil, Trash2, Award, Stamp, CheckCircle2, Trophy, Gift } from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { ModalShell, ModalFooterButtons, DeleteModal, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { KpiData } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import { StampProgram, STAMP_PROGRAMS } from "@/components/rms/data/services";

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;

const COLUMNS = [
  { key: "sn",          label: "SN" },
  { key: "name",        label: "Program Name", sortable: true },
  { key: "engaged",     label: "Engaged Users" },
  { key: "stamps",      label: "Stamps Required", sortable: true },
  { key: "reward",      label: "Reward" },
  { key: "expires",     label: "Expires In" },
  { key: "description", label: "Description" },
  { key: "available",   label: "Available", align: "center" as const },
  { key: "actions",     label: "", align: "center" as const },
];

function ProgramModal({ p, onClose, onSave }: { p: StampProgram | null; onClose: () => void; onSave: (x: StampProgram) => void }) {
  const [name, setName] = useState(p?.name ?? "");
  const [stamps, setStamps] = useState(p?.stampsRequired ? String(p.stampsRequired) : "");
  const [reward, setReward] = useState(p?.reward ?? "");
  const [expires, setExpires] = useState(p?.expiresIn ? p.expiresIn.replace(/\D/g, "") : "");
  const [description, setDescription] = useState(p?.description ?? "");
  const valid = name.trim() && Number(stamps) > 0 && reward.trim();
  const submit = () => onSave({
    id: p?.id ?? 0, name: name.trim(), engagedUsers: p?.engagedUsers ?? 0,
    stampsRequired: Number(stamps) || 0, reward: reward.trim(),
    expiresIn: expires ? `${expires} days` : "—", description: description.trim(),
    available: p?.available ?? true,
  });
  return (
    <ModalShell title={p ? "Edit Stamp Program" : "Create Stamp Program"} size="lg" onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel={p ? "Save changes" : "Save Program"} disabled={!valid} />
        </div>
      }>
      <Input autoFocus label={<>Program Name<Req /></>} labelPlacement="outside" placeholder="e.g. Loyalty Stamps"
        size="sm" variant="bordered" value={name} onValueChange={setName}
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label={<>Stamps Required<Req /></>} labelPlacement="outside" placeholder="10" type="number"
          size="sm" variant="bordered" value={stamps} onValueChange={setStamps}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }} />
        <Input label={<>Reward<Req /></>} labelPlacement="outside" placeholder="e.g. Free Coffee"
          size="sm" variant="bordered" value={reward} onValueChange={setReward}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
        <Input label="Expires In (days)" labelPlacement="outside" placeholder="20" type="number"
          size="sm" variant="bordered" value={expires} onValueChange={setExpires}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }} />
      </div>
      <Textarea label="Description" labelPlacement="outside" placeholder="Enter description"
        minRows={3} value={description} onValueChange={setDescription} variant="bordered"
        classNames={{ label: labelCx, inputWrapper: `${wrapCx} h-auto min-h-[80px]`, input: inputCx }} />
    </ModalShell>
  );
}

export default function StampProgramsPage() {
  const s = useListState<StampProgram>({
    initial: STAMP_PROGRAMS.map((m) => ({ ...m })),
    searchableText: (m) => `${m.name} ${m.reward}`,
    sortAccessors: { name: (m) => m.name.toLowerCase(), stamps: (m) => m.stampsRequired },
  });

  const toggle = (m: StampProgram) => s.setItems((p) => p.map((x) => x.id === m.id ? { ...x, available: !x.available } : x));

  const kpis: KpiData[] = [
    { key: "total", icon: Award, tint: "#FDECE4", accent: "#F15022", label: "Total Programs", value: s.items.length, sparkData: [0,0,1,1,1,1,1,1,1,1,1,s.items.length] },
    { key: "assigned", icon: Stamp, tint: "#EDE9FE", accent: "#6D28D9", label: "Assigned Stamps", value: 0, sparkData: [0,0,0,0,0,0,0,0,0,0,0,0] },
    { key: "rate", icon: CheckCircle2, tint: "#E3F6F1", accent: "#1FA98B", label: "Completion Rate", value: "0.00%", sparkData: [0,0,0,0,0,0,0,0,0,0,0,0] },
    { key: "top", icon: Trophy, tint: "#FEF3E2", accent: "#F59E0B", label: "Most Performing", value: "—", sparkData: [0,0,0,0,0,0,0,0,0,0,0,0] },
    { key: "redeemed", icon: Gift, tint: "#E0F2FE", accent: "#0369A1", label: "Total Rewards Redeemed", value: 0, sparkData: [0,0,0,0,0,0,0,0,0,0,0,0] },
  ];

  const renderCell = (m: StampProgram, key: string) => {
    switch (key) {
      case "sn":          return <span className="font-mono text-[12.5px] text-warm-500">{m.id}</span>;
      case "name":        return <span className="text-[13.5px] font-semibold text-ink">{m.name}</span>;
      case "engaged":     return <span className="text-[13px] tnum text-warm-700">{m.engagedUsers}</span>;
      case "stamps":      return <span className="text-[13px] font-bold tnum text-ink">{m.stampsRequired}</span>;
      case "reward":      return <span className="text-[13px] text-warm-700">{m.reward}</span>;
      case "expires":     return <span className="text-[13px] text-warm-600">{m.expiresIn}</span>;
      case "description": return <span className="text-[12.5px] text-warm-400 italic">{m.description || "No description"}</span>;
      case "available":   return <div className="flex justify-center"><Switch isSelected={m.available} onValueChange={() => toggle(m)} size="sm" classNames={{ wrapper: "group-data-[selected=true]:bg-[#15803D]" }} aria-label={m.name} /></div>;
      case "actions": return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger><Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button></DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(m)}>Edit</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color="#F15022" />} onPress={() => s.setDel({ item: m })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (m: StampProgram) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[14.5px] font-bold text-ink">{m.name}</span>
        <Switch isSelected={m.available} onValueChange={() => toggle(m)} size="sm" classNames={{ wrapper: "group-data-[selected=true]:bg-[#15803D]" }} aria-label={m.name} />
      </div>
      <div className="mt-2 flex items-center gap-4 text-[12.5px] text-warm-600">
        <span>{m.stampsRequired} stamps</span><span>Reward: <span className="font-bold text-ink">{m.reward}</span></span><span>{m.expiresIn}</span>
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s} title="Stamp Programs" totalCount={s.items.length}
        kpis={kpis} selectable={false}
        columns={COLUMNS} renderCell={renderCell} renderCard={renderCard}
        searchPlaceholder="Search programs…" addLabel="Add New" onAdd={() => s.setEditing(null)}
      />
      {s.editing !== undefined && <ProgramModal p={s.editing} onClose={() => s.setEditing(undefined)} onSave={s.save} />}
      {s.del && <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} programs`} onClose={() => s.setDel(null)} onConfirm={() => s.doDelete((m) => `"${m.name}"`)} />}
    </>
  );
}

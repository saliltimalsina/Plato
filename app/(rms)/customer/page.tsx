"use client";

import { useState } from "react";
import {
  Button, Input, Select, SelectItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from "@heroui/react";
import {
  MoreHorizontal, Pencil, Trash2, Eye, ArrowDownLeft, ArrowUpRight, Camera, ChevronDown, Calendar,
} from "lucide-react";
import { ListScaffold } from "@/components/rms/ListScaffold";
import { ModalShell, labelCx, wrapCx, inputCx, DeleteModal } from "@/components/rms/ModalShell";
import { KpiData, ORANGE, Avatar } from "@/components/rms/primitives";
import { useListState } from "@/components/rms/useListState";
import { Customer, CUSTOMERS_DATA, CUSTOMER_GROUPS, TODAY_MMDD } from "@/components/rms/data/customers";

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;
const initials = (n: string) => n.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();

const COLUMNS = [
  { key: "sn",      label: "SN" },
  { key: "name",    label: "Customer", sortable: true },
  { key: "email",   label: "Email" },
  { key: "phone",   label: "Phone Number" },
  { key: "dob",     label: "DOB" },
  { key: "loyalty", label: "Loyalty Dis", sortable: true },
  { key: "due",     label: "Due Amount" },
  { key: "actions", label: "", align: "center" as const },
];

function CustomerModal({ c, onClose, onSave }: { c: Customer | null; onClose: () => void; onSave: (x: Customer) => void }) {
  const [name, setName] = useState(c?.name ?? "");
  const [phone, setPhone] = useState(c?.phone ?? "+977 ");
  const [email, setEmail] = useState(c?.email ?? "");
  const [loyalty, setLoyalty] = useState(c?.loyaltyDisc ? String(c.loyaltyDisc) : "");
  const [balanceKind, setBalanceKind] = useState<"dr" | "cr">((c?.dueAmount ?? 0) < 0 ? "cr" : "dr");
  const [amount, setAmount] = useState(c?.dueAmount ? String(Math.abs(c.dueAmount)) : "");
  const [dob, setDob] = useState(c?.dob ?? "");
  const [group, setGroup] = useState(c?.group ?? "");
  const [showMore, setShowMore] = useState(false);

  const valid = name.trim().length > 0;
  const submit = () => onSave({
    id: c?.id ?? 0, name: name.trim(), email: email.trim(), phone: phone.trim(),
    dob, loyaltyDisc: Number(loyalty) || 0,
    dueAmount: (Number(amount) || 0) * (balanceKind === "cr" ? -1 : 1), group,
  });
  const reset = () => { setName(c?.name ?? ""); setPhone(c?.phone ?? "+977 "); setEmail(c?.email ?? ""); setLoyalty(""); setAmount(""); setDob(""); setGroup(""); };

  return (
    <ModalShell title={c ? "Edit Customer" : "Add Customer"} size="3xl" onClose={onClose}
      footer={
        <div className="flex items-center gap-3 w-full">
          <Button radius="md" className="flex-1 font-semibold bg-warm-100 text-warm-700" onPress={reset}>Reset</Button>
          <Button radius="md" isDisabled={!valid} className="flex-1 font-bold disabled:opacity-100"
            style={{ background: valid ? ORANGE : "#A9C9B4", color: "#fff", boxShadow: valid ? "0 2px 8px rgba(241,80,34,0.32)" : "none" }}
            onPress={submit}>Save Customer</Button>
        </div>
      }>
      <h3 className="text-[14px] font-extrabold text-ink">1. Basic Customer Details</h3>

      <div className="flex items-center gap-4">
        <div className="w-[64px] h-[64px] rounded-[12px] border border-dashed border-[#D8CFC6] flex items-center justify-center text-warm-400"><Camera size={22} /></div>
        <div>
          <div className="text-[13px] font-bold text-ink mb-2">Customer Profile Image</div>
          <div className="flex items-center gap-2">
            <Button size="sm" radius="md" className="h-8 font-bold text-white" style={{ background: "#15803D" }}>Upload</Button>
            <Button size="sm" radius="md" variant="bordered" className="h-8 border border-[#E6E1DC] bg-warm-50 font-semibold text-warm-500">Remove</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label={<>Customer Full Name<Req /></>} labelPlacement="outside" placeholder="Enter Customer Name"
          size="sm" variant="bordered" value={name} onValueChange={setName}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
        <Input label="Phone Number" labelPlacement="outside" placeholder="+977"
          size="sm" variant="bordered" value={phone} onValueChange={setPhone}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
        <Input label="Email" labelPlacement="outside" placeholder="Email" type="email"
          size="sm" variant="bordered" value={email} onValueChange={setEmail}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <Input label="Loyalty Discount (in %)" labelPlacement="outside" placeholder="0.00" type="number"
          size="sm" variant="bordered" value={loyalty} onValueChange={setLoyalty}
          endContent={<span className="text-[12px] text-warm-500">%</span>}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }} />
        <div className="flex flex-col gap-2">
          <span className={labelCx}>Opening Balance</span>
          <div className="flex items-center gap-2">
            <BalancePill active={balanceKind === "dr"} tone="green" icon={ArrowDownLeft} label="To Collect(Dr)" onClick={() => setBalanceKind("dr")} />
            <BalancePill active={balanceKind === "cr"} tone="red" icon={ArrowUpRight} label="To Pay(Cr)" onClick={() => setBalanceKind("cr")} />
          </div>
        </div>
        <Input label="Opening Amount" labelPlacement="outside" placeholder="0" type="number"
          size="sm" variant="bordered" value={amount} onValueChange={setAmount}
          startContent={<span className="text-[13px] text-warm-500 font-semibold">Rs</span>}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Date of Birth" labelPlacement="outside" placeholder="Pick Customer's Date of Birth" type="date"
          size="sm" variant="bordered" value={dob} onValueChange={setDob}
          startContent={<Calendar size={14} color="#9A8C80" />}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
        <Select label="Group" labelPlacement="outside" placeholder="Select Group for Customer"
          selectedKeys={group ? [group] : []} onSelectionChange={(k) => setGroup((Array.from(k)[0] as string) ?? "")}
          size="sm" variant="bordered" radius="md" classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}>
          {CUSTOMER_GROUPS.map((g) => <SelectItem key={g}>{g}</SelectItem>)}
        </Select>
      </div>

      <button onClick={() => setShowMore((v) => !v)} className="inline-flex items-center gap-1 text-[13px] font-bold self-start" style={{ color: "#2563EB" }}>
        <ChevronDown size={15} color="#2563EB" style={{ transform: showMore ? "rotate(180deg)" : "none" }} /> Additional Details
      </button>
      {showMore && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Address" labelPlacement="outside" placeholder="Enter address"
            size="sm" variant="bordered" classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
          <Input label="Tax / PAN No" labelPlacement="outside" placeholder="Enter PAN"
            size="sm" variant="bordered" classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
        </div>
      )}
    </ModalShell>
  );
}

function BalancePill({ active, tone, icon: Icon, label, onClick }: { active: boolean; tone: "green" | "red"; icon: typeof ArrowDownLeft; label: string; onClick: () => void }) {
  const c = tone === "green" ? "#15803D" : "#DC2626";
  return (
    <button onClick={onClick} className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-[9px] text-[13px] font-bold transition-colors"
      style={{ background: active ? (tone === "green" ? "#F0FDF4" : "#FEF2F2") : "#fff", border: `1px solid ${active ? c + "55" : "#E6E1DC"}`, color: c }}>
      <span className="w-[14px] h-[14px] rounded-full inline-flex items-center justify-center" style={{ border: `2px solid ${active ? c : "#C9BCB0"}` }}>{active && <span className="w-[6px] h-[6px] rounded-full" style={{ background: c }} />}</span>
      {label}<Icon size={13} color={c} />
    </button>
  );
}

export default function CustomerPage() {
  const s = useListState<Customer>({
    initial: CUSTOMERS_DATA.map((m) => ({ ...m })),
    searchableText: (m) => `${m.name} ${m.email} ${m.phone}`,
    sortAccessors: { name: (m) => m.name.toLowerCase(), loyalty: (m) => m.loyaltyDisc },
  });

  const toReceive = s.items.reduce((a, m) => a + Math.max(0, m.dueAmount), 0);
  const toPay = s.items.reduce((a, m) => a + Math.max(0, -m.dueAmount), 0);

  const kpis: KpiData[] = [
    { key: "rec", icon: ArrowDownLeft, tint: "#E7F6EC", accent: "#15803D", label: "To Receive", value: `Rs ${toReceive.toLocaleString()}`, sparkData: [0,200,400,600,800,1000,1200,1400,1500,1600,1650,toReceive] },
    { key: "pay", icon: ArrowUpRight, tint: "#FDECE4", accent: ORANGE, label: "To Pay", value: `Rs ${toPay.toLocaleString()}`, sparkData: [0,100,200,300,400,500,600,700,750,780,800,toPay] },
    { key: "net", icon: ArrowDownLeft, tint: "#E3F6F1", accent: "#1FA98B", label: "Net To Receive", value: `Rs ${(toReceive - toPay).toLocaleString()}`, sparkData: [0,100,200,300,400,500,600,700,750,800,850,toReceive - toPay] },
  ];

  const renderCell = (m: Customer, key: string) => {
    switch (key) {
      case "sn":    return <span className="font-mono text-[12.5px] text-warm-500">{m.id}</span>;
      case "name":  return (
        <span className="inline-flex items-center gap-2">
          <Avatar initials={initials(m.name)} color="#6D28D9" size={30} />
          <span className="text-[13.5px] font-semibold text-ink whitespace-nowrap">{m.name}</span>
        </span>
      );
      case "email": return <span className="text-[13px] text-warm-600">{m.email}</span>;
      case "phone": return <span className="text-[13px] text-warm-700 tnum">{m.phone}</span>;
      case "dob":   return (
        <span className="inline-flex items-center gap-2 text-[13px] text-warm-700 tnum">
          {m.dob || "—"}
          {m.dob.slice(5) === TODAY_MMDD && <span className="text-[11px] font-bold px-2 py-[1px] rounded-full" style={{ background: "#E0F2FE", color: "#0369A1" }}>Today</span>}
        </span>
      );
      case "loyalty": return <span className="text-[13px] font-bold tnum text-ink">{m.loyaltyDisc}%</span>;
      case "due":   return m.dueAmount === 0
        ? <span className="text-[13px] text-warm-400">—</span>
        : <span className="text-[13px] font-bold tnum" style={{ color: m.dueAmount > 0 ? "#15803D" : "#C2410C" }}>Rs {Math.abs(m.dueAmount).toLocaleString()}</span>;
      case "actions": return (
        <Dropdown placement="bottom-end">
          <DropdownTrigger><Button isIconOnly size="sm" variant="light" radius="sm" className="w-7 h-7 min-w-7"><MoreHorizontal size={17} color="#9A8C80" /></Button></DropdownTrigger>
          <DropdownMenu aria-label="Row actions">
            <DropdownItem key="view" startContent={<Eye size={15} color="#8A7D72" />} onPress={() => s.setEditing(m)}>View</DropdownItem>
            <DropdownItem key="edit" startContent={<Pencil size={15} color="#8A7D72" />} onPress={() => s.setEditing(m)}>Edit</DropdownItem>
            <DropdownItem key="del" className="text-[#F15022]" color="danger" startContent={<Trash2 size={15} color="#F15022" />} onPress={() => s.setDel({ item: m })}>Move to trash</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
      default: return null;
    }
  };

  const renderCard = (m: Customer) => (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[14px]" onClick={() => s.setEditing(m)}>
      <div className="flex items-center gap-3">
        <Avatar initials={initials(m.name)} color="#6D28D9" size={40} />
        <div className="flex-1 min-w-0">
          <div className="text-[14.5px] font-bold text-ink truncate">{m.name}</div>
          <div className="text-[12.5px] text-warm-500 truncate">{m.email}</div>
        </div>
        <span className="text-[12px] font-bold tnum text-ink">{m.loyaltyDisc}%</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[12.5px] text-warm-600">
        <span className="tnum">{m.phone}</span>
        {m.dueAmount !== 0 && <span className="font-bold tnum" style={{ color: m.dueAmount > 0 ? "#15803D" : "#C2410C" }}>Rs {Math.abs(m.dueAmount).toLocaleString()}</span>}
      </div>
    </div>
  );

  return (
    <>
      <ListScaffold
        state={s} title="Customers" totalCount={s.items.length}
        kpis={kpis}
        columns={COLUMNS} renderCell={renderCell} renderCard={renderCard}
        searchPlaceholder="Search customers…" addLabel="Add New" onAdd={() => s.setEditing(null)}
      />
      {s.editing !== undefined && <CustomerModal c={s.editing} onClose={() => s.setEditing(undefined)} onSave={s.save} />}
      {s.del && <DeleteModal label={"item" in s.del ? `"${s.del.item.name}"` : `${s.selected.length} customers`} onClose={() => s.setDel(null)} onConfirm={() => s.doDelete((m) => `"${m.name}"`)} />}
    </>
  );
}

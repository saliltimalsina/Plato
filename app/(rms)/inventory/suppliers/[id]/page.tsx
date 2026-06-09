"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tabs, Tab, addToast,
} from "@heroui/react";
import {
  ArrowLeft, Phone, Send, FileText, Plus, ChevronDown,
  DollarSign, RotateCcw, ArrowDown, ArrowUp, LucideIcon, CreditCard,
} from "lucide-react";
import { Avatar, Badge, ORANGE } from "@/components/rms/primitives";
import { DField } from "@/components/rms/DrawerShell";
import {
  SUPPLIERS, Supplier, DIRECTION_TONE, SUPPLIER_SUMMARY, SUPPLIER_TXNS, SUPPLIER_ACTIVITY,
} from "@/components/rms/data/suppliers";
import {
  PaymentInModal, PaymentOutModal, AddPurchaseBillModal, AddDebitNoteModal,
} from "@/components/rms/suppliers/FinanceModals";

const SUMMARY_ICONS: Record<string, LucideIcon> = { DollarSign, RotateCcw, ArrowDown, ArrowUp };

const TXN_TONE: Record<string, "success" | "danger" | "secondary" | "neutral"> = {
  "Purchase Bill": "secondary",
  "Payment In": "success",
  "Payment Out": "danger",
  "Debit Note": "neutral",
};

type FinanceModal = "in" | "out" | "bill" | "note" | null;

function dueText(s: Supplier) {
  if (s.direction === "Settled" || s.dueAmount === 0) return "Settled";
  return `Rs ${s.dueAmount.toLocaleString()} · ${s.direction}`;
}

export default function SupplierDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const supplier = SUPPLIERS.find((x) => x.id === id) ?? SUPPLIERS[0];

  const [modal, setModal] = useState<FinanceModal>(null);

  const toast = (msg: string) => addToast({ title: msg, color: "success", timeout: 2800 });

  return (
    <>
      {/* top row: back + identity + actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button isIconOnly size="sm" variant="bordered" radius="md"
          className="w-9 h-9 min-w-9 border border-[#E6E1DC] bg-white" onPress={() => router.back()}>
          <ArrowLeft size={18} color="#6B5F55" />
        </Button>
        <Avatar initials={supplier.initials} color="#7C3AED" size={44} />
        <div className="min-w-0">
          <div className="flex items-center gap-[9px]">
            <h1 className="text-[20px] font-extrabold text-ink tracking-[-0.02em] m-0">{supplier.name}</h1>
            <span className="text-[11px] font-semibold font-mono text-warm-500 bg-warm-200 px-[7px] py-[2px] rounded-md">
              #{String(supplier.id).padStart(4, "0")}
            </span>
          </div>
          <div className="mt-[5px]"><Badge tone={DIRECTION_TONE[supplier.direction]}>{dueText(supplier)}</Badge></div>
        </div>

        <div className="flex items-center gap-[9px] ml-auto flex-wrap">
          <Button size="sm" variant="bordered" radius="md" className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-600 text-[12.5px]"
            startContent={<Phone size={14} color="#8A7D72" />} onPress={() => toast(`Contacting ${supplier.name}`)}>Contact</Button>
          <Button size="sm" variant="bordered" radius="md" className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-600 text-[12.5px]"
            startContent={<Send size={14} color="#8A7D72" />} onPress={() => toast("Invoice sent")}>Send Invoice</Button>
          <Button size="sm" variant="bordered" radius="md" className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-600 text-[12.5px]"
            startContent={<FileText size={14} color="#8A7D72" />} onPress={() => toast("Statement generated")}>Statement</Button>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button size="sm" radius="md" className="h-9 text-white font-bold"
                style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
                startContent={<Plus size={16} color="#fff" strokeWidth={2.4} />}
                endContent={<ChevronDown size={14} color="#fff" />}>Add</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Add actions">
              <DropdownItem key="in" startContent={<ArrowDown size={15} color="#8A7D72" />} onPress={() => setModal("in")}>Payment In</DropdownItem>
              <DropdownItem key="out" startContent={<ArrowUp size={15} color="#8A7D72" />} onPress={() => setModal("out")}>Payment Out</DropdownItem>
              <DropdownItem key="bill" startContent={<FileText size={15} color="#8A7D72" />} onPress={() => setModal("bill")}>Add Purchase Bill</DropdownItem>
              <DropdownItem key="note" startContent={<RotateCcw size={15} color="#8A7D72" />} onPress={() => setModal("note")}>Add Debit Note</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[14px]">
        {SUPPLIER_SUMMARY.map((c) => {
          const Icon = SUMMARY_ICONS[c.icon] ?? DollarSign;
          return (
            <div key={c.label} className="bg-white border border-[#EEEAE6] rounded-2xl p-[16px] px-[18px]" style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
              <div className="flex items-center gap-[9px] mb-3">
                <div className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center" style={{ background: c.iconBg }}>
                  <Icon size={16} color={c.iconColor} strokeWidth={2} />
                </div>
                <span className="text-[12.5px] font-semibold text-[#8A8079]">{c.label}</span>
              </div>
              <div className="text-[24px] font-bold text-ink tracking-[-0.02em] tnum">{c.value}</div>
            </div>
          );
        })}
      </div>

      {/* detail grid */}
      <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[18px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-[18px]">
          <DField label="Email">{supplier.email}</DField>
          <DField label="Phone"><span className="tnum">{supplier.phone}</span></DField>
          <DField label="Address">{supplier.address ?? "Imadol Krishna Mandir Rd"}</DField>
          <DField label="DOB"><span className="tnum">{supplier.dob}</span></DField>
          <DField label="Legal Name">{supplier.legalName ?? "-"}</DField>
          <DField label="Tax Number">{supplier.taxNumber ?? "-"}</DField>
          <DField label="Joined">{supplier.joined ?? "2026, June 05 by Salil Timalsina"}</DField>
        </div>
      </div>

      {/* tabs */}
      <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[18px]">
        <Tabs size="sm" radius="md"
          classNames={{ tabList: "bg-[#F6EFE8]", cursor: "bg-white shadow-sm", tabContent: "font-bold text-[12.5px]" }}>
          <Tab key="txn" title="Transaction">
            <div className="mt-4 border border-[#EEEAE6] rounded-[12px] overflow-hidden">
              <div className="grid bg-cream border-b border-warm-200 px-3 py-2 text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em]"
                style={{ gridTemplateColumns: "88px 1fr 120px 90px 90px 96px" }}>
                <span>Txn No</span><span>Particular</span><span>Type</span>
                <span className="text-right">Amount</span><span className="text-right">Unpaid</span><span className="text-right">Date</span>
              </div>
              {SUPPLIER_TXNS.map((t, i) => (
                <div key={t.id} className="grid px-3 py-[11px] items-center"
                  style={{ gridTemplateColumns: "88px 1fr 120px 90px 90px 96px", borderBottom: i === SUPPLIER_TXNS.length - 1 ? "none" : "1px solid #F4EFEB" }}>
                  <span className="text-[12px] font-mono font-semibold text-warm-600">{t.txnNo}</span>
                  <span className="text-[13px] font-semibold text-ink truncate pr-2">{t.particular}</span>
                  <span><Badge tone={TXN_TONE[t.txnType] ?? "neutral"}>{t.txnType}</Badge></span>
                  <span className="text-[13px] font-bold text-ink text-right tnum">{t.amount}</span>
                  <span className="text-[13px] font-semibold text-warm-600 text-right tnum">{t.unpaid}</span>
                  <span className="text-[12.5px] text-warm-500 text-right tnum">{t.date}</span>
                </div>
              ))}
            </div>
          </Tab>

          <Tab key="activity" title="Activity">
            <div className="mt-4 flex flex-col">
              {SUPPLIER_ACTIVITY.map((a, i) => (
                <div key={a.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="w-[10px] h-[10px] rounded-full mt-[5px]" style={{ background: ORANGE }} />
                    {i < SUPPLIER_ACTIVITY.length - 1 && <span className="w-[1.5px] flex-1 bg-warm-200 my-1" />}
                  </div>
                  <div className="pb-[18px]">
                    <div className="text-[13.5px] font-bold text-ink">{a.title}</div>
                    <div className="text-[12px] text-warm-500 mt-[2px]">{a.at}</div>
                  </div>
                </div>
              ))}
            </div>
          </Tab>

          <Tab key="credit" title="Credit List">
            <div className="mt-4 border-[1.5px] border-dashed border-warm-200 rounded-[12px] py-[34px] text-center flex flex-col items-center gap-2">
              <div className="w-[40px] h-[40px] rounded-[12px] bg-warm-100 flex items-center justify-center"><CreditCard size={18} color="#C9BCB0" /></div>
              <span className="text-[13px] text-warm-500 font-medium">No credits</span>
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* finance modals */}
      {modal === "in" && <PaymentInModal supplierName={supplier.name} onClose={() => setModal(null)} onDone={toast} />}
      {modal === "out" && <PaymentOutModal supplierName={supplier.name} onClose={() => setModal(null)} onDone={toast} />}
      {modal === "bill" && <AddPurchaseBillModal supplierName={supplier.name} onClose={() => setModal(null)} onDone={toast} />}
      {modal === "note" && <AddDebitNoteModal supplierName={supplier.name} onClose={() => setModal(null)} onDone={toast} />}
    </>
  );
}

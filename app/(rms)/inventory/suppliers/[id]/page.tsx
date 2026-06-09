"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tabs, Tab, addToast,
  Drawer, DrawerContent, DrawerHeader, DrawerBody,
} from "@heroui/react";
import {
  ArrowLeft, Phone, Send, FileText, Plus, MoreHorizontal, Link as LinkIcon,
  DollarSign, RotateCcw, ArrowDown, ArrowUp, LucideIcon, CreditCard, SlidersHorizontal,
  Pencil, Percent, Trash2, Paperclip, Inbox, X,
} from "lucide-react";
import { Avatar, ORANGE } from "@/components/rms/primitives";
import {
  SUPPLIERS, Supplier, SupplierTxn, SUPPLIER_SUMMARY, SUPPLIER_TXNS, SUPPLIER_ACTIVITY,
} from "@/components/rms/data/suppliers";
import {
  PaymentInModal, PaymentOutModal, AddPurchaseBillModal, AddDebitNoteModal,
} from "@/components/rms/suppliers/FinanceModals";

const SUMMARY_ICONS: Record<string, LucideIcon> = { DollarSign, RotateCcw, ArrowDown, ArrowUp };

type FinanceModal = "in" | "out" | "bill" | "note" | null;

function balanceLabel(s: Supplier) {
  if (s.direction === "Settled" || s.dueAmount === 0) return { label: "Settled", color: "#6B5F55", arrow: null as null | "up" | "down" };
  if (s.direction === "To Receive") return { label: "To Collect | Debit Balance", color: "#15803D", arrow: "down" as const };
  return { label: "To Pay | Credit Balance", color: "#C2410C", arrow: "up" as const };
}

export default function SupplierDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const supplier = SUPPLIERS.find((x) => x.id === id) ?? SUPPLIERS[0];

  const [modal, setModal] = useState<FinanceModal>(null);
  const [tab, setTab] = useState<"txn" | "activity" | "credit">("txn");
  const [viewTxn, setViewTxn] = useState<SupplierTxn | null>(null);

  const toast = (msg: string) => addToast({ title: msg, color: "success", timeout: 2800 });
  const bal = balanceLabel(supplier);

  return (
    <div className="flex flex-col gap-4 lg:gap-[18px]">
      {/* ── top action bar ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          isIconOnly size="sm" variant="bordered" radius="md"
          className="w-9 h-9 min-w-9 border border-[#E6E1DC] bg-white"
          onPress={() => router.back()}
        >
          <ArrowLeft size={18} color={ORANGE} />
        </Button>
        <h1 className="text-[20px] font-extrabold text-ink tracking-[-0.02em] m-0 flex items-center gap-2">
          <span className="text-warm-600">Supplier :</span>
          <span>{supplier.name}</span>
        </h1>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <Button size="sm" radius="md" variant="bordered"
            className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-700 text-[12.5px]"
            startContent={<Plus size={14} color="#6B5F55" strokeWidth={2.4} />}
            onPress={() => setModal("bill")}>
            Add Purchase Bill
          </Button>
          <Button size="sm" radius="md" variant="bordered"
            className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-700 text-[12.5px]"
            startContent={<Plus size={14} color="#6B5F55" strokeWidth={2.4} />}
            onPress={() => setModal("note")}>
            Add Debit Note
          </Button>
          <Button size="sm" radius="md"
            className="h-9 font-bold text-white text-[12.5px]"
            style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
            startContent={<ArrowUp size={14} color="#fff" strokeWidth={2.6} />}
            onPress={() => setModal("out")}>
            Payment Out
          </Button>
          <Button size="sm" radius="md" variant="bordered"
            className="h-9 border border-[#A7F3D0] bg-[#E7F6EC] font-bold text-[#15803D] text-[12.5px]"
            startContent={<ArrowDown size={14} color="#15803D" strokeWidth={2.6} />}
            onPress={() => setModal("in")}>
            Payment In
          </Button>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="bordered" radius="md"
                className="w-9 h-9 min-w-9 border border-[#E6E1DC] bg-white">
                <MoreHorizontal size={16} color="#8A7D72" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Supplier actions">
              <DropdownItem key="edit" startContent={<Pencil size={14} color="#8A7D72" />}>Edit Supplier</DropdownItem>
              <DropdownItem key="adjust" startContent={<Percent size={14} color="#8A7D72" />}>Adjust Balance</DropdownItem>
              <DropdownItem key="trash" className="text-[#F15022]" color="danger"
                startContent={<Trash2 size={14} color="#F15022" />}>
                Move to Trash
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* ── body: identity sidebar + main column ──────────────────── */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-[18px] items-start">
        {/* LEFT — identity card */}
        <aside className="w-full lg:w-[360px] flex-shrink-0 bg-white border border-[#EEEAE6] rounded-2xl p-[18px]"
          style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
          {/* header: avatar + name + collapse */}
          <div className="flex items-start gap-3">
            <Avatar initials={supplier.initials} color="#7C3AED" size={60} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-[16px] font-extrabold text-ink tracking-[-0.02em] m-0 truncate">{supplier.name}</h2>
              </div>
              <div className="mt-1 text-[11.5px] font-semibold text-warm-500">{bal.label}</div>
              <div className="mt-[2px] flex items-center gap-1">
                <span className="text-[15px] font-extrabold tnum" style={{ color: bal.color }}>
                  Rs {supplier.dueAmount.toLocaleString()}
                </span>
                {bal.arrow === "down" && <ArrowDown size={14} color={bal.color} strokeWidth={2.6} />}
                {bal.arrow === "up" && <ArrowUp size={14} color={bal.color} strokeWidth={2.6} />}
              </div>
            </div>
          </div>

          {/* link with customer */}
          <button
            className="mt-4 w-full flex items-center justify-center gap-2 h-10 rounded-[12px] bg-warm-100 hover:bg-warm-200 transition-colors text-[13px] font-semibold text-warm-700"
            onClick={() => toast("Link customer flow")}
          >
            <LinkIcon size={14} color="#6B5F55" />
            Link with customer
          </button>

          {/* quick actions row */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <QuickAction icon={Phone}    label="Contact"      onClick={() => toast(`Contacting ${supplier.name}`)} />
            <QuickAction icon={Send}     label="Send Invoice" onClick={() => toast("Invoice sent")} />
            <QuickAction icon={FileText} label="Statement"    onClick={() => toast("Statement generated")} dotted />
          </div>

          {/* details list */}
          <div className="mt-5 pt-5 border-t border-warm-200">
            <h3 className="text-[13px] font-extrabold text-ink mb-3">Details:</h3>
            <dl className="space-y-[14px] text-[12.5px]">
              <DetailRow label="Email"        value={<span className="text-ink">{supplier.email}</span>} />
              <DetailRow label="Phone Number" value={<span className="text-ink tnum">{supplier.phone.replace("+", "")}</span>} />
              <DetailRow label="Address"      value={supplier.address ?? "Imadol Krishna Mandir Rd"} />
              <DetailRow label="Date Of Birth" value={supplier.dob !== "-" ? supplier.dob : "-"} />
              <DetailRow label="Legal Name"   value={supplier.legalName ?? "-"} />
              <DetailRow label="Tax Number"   value={supplier.taxNumber ?? "-"} />
              <DetailRow label="Joined"       value={supplier.joined ?? "2026, June 05 by Salil Timalsina"} />
            </dl>
          </div>
        </aside>

        {/* RIGHT — summary + tabs */}
        <section className="flex-1 min-w-0 w-full flex flex-col gap-4 lg:gap-[18px]">
          {/* summary */}
          <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[18px]"
            style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
            <h3 className="text-[15px] font-extrabold text-ink mb-3">Summary</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {SUPPLIER_SUMMARY.map((c) => {
                const Icon = SUMMARY_ICONS[c.icon] ?? DollarSign;
                return (
                  <div key={c.label} className="rounded-[14px] bg-warm-50 p-[14px]">
                    <div className="flex items-center gap-[8px] mb-2">
                      <div className="w-[26px] h-[26px] rounded-[8px] flex items-center justify-center"
                        style={{ background: c.iconBg }}>
                        <Icon size={14} color={c.iconColor} strokeWidth={2} />
                      </div>
                      <span className="text-[12px] font-semibold text-[#8A8079]">{c.label}</span>
                    </div>
                    <div className="text-[22px] font-extrabold text-ink tracking-[-0.02em] tnum">{c.value}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* tabs + table */}
          <div className="bg-white border border-[#EEEAE6] rounded-2xl p-[18px]"
            style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Tabs size="sm" radius="md"
                selectedKey={tab}
                onSelectionChange={(k) => setTab(k as "txn" | "activity" | "credit")}
                classNames={{
                  tabList: "bg-[#F6EFE8]",
                  cursor: "bg-white shadow-sm",
                  tabContent: "font-bold text-[12.5px]",
                }}
              >
                <Tab key="txn" title="Transaction" />
                <Tab key="activity" title="Activity" />
                <Tab key="credit" title="Credit List" />
              </Tabs>
              <Button size="sm" variant="bordered" radius="md"
                className="h-8 border border-[#E6E1DC] bg-white text-warm-600 text-[12px] font-semibold"
                startContent={<SlidersHorizontal size={13} color="#6B5F55" />}>
                Filter
              </Button>
            </div>
            <div className="mt-2">
              {tab === "txn" && <TxnTable onSelect={setViewTxn} />}
              {tab === "activity" && <ActivityList />}
              {tab === "credit" && <EmptyCredit />}
            </div>
          </div>
        </section>
      </div>

      {/* finance modals */}
      {modal === "in" && <PaymentInModal supplierName={supplier.name} onClose={() => setModal(null)} onDone={toast} />}
      {modal === "out" && <PaymentOutModal supplierName={supplier.name} onClose={() => setModal(null)} onDone={toast} />}
      {modal === "bill" && <AddPurchaseBillModal supplierName={supplier.name} onClose={() => setModal(null)} onDone={toast} />}
      {modal === "note" && <AddDebitNoteModal supplierName={supplier.name} onClose={() => setModal(null)} onDone={toast} />}

      {viewTxn && <TxnDetailDrawer txn={viewTxn} supplierName={supplier.name} onClose={() => setViewTxn(null)} />}
    </div>
  );
}

/* ── quick action tile (Contact / Send Invoice / Statement) ────── */
function QuickAction({
  icon: Icon, label, onClick, dotted,
}: { icon: LucideIcon; label: string; onClick: () => void; dotted?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 py-2 rounded-[10px] hover:bg-warm-100 transition-colors relative"
    >
      <div className="relative">
        <Icon size={18} color="#6B5F55" />
        {dotted && <span className="absolute -top-1 -right-1 w-[6px] h-[6px] rounded-full" style={{ background: "#F59E0B" }} />}
      </div>
      <span className="text-[11.5px] font-semibold text-warm-600">{label}</span>
    </button>
  );
}

/* ── detail row ────────────────────────────────────────────────── */
function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-2 items-baseline">
      <dt className="text-[12px] text-warm-500 font-medium">{label}</dt>
      <dd className="text-[12.5px] font-semibold text-warm-700 m-0 break-words">{value}</dd>
    </div>
  );
}

/* ── tabs content ──────────────────────────────────────────────── */
function TxnTable({ onSelect }: { onSelect: (t: SupplierTxn) => void }) {
  const COLS = "44px 100px 1fr 120px 110px 130px 110px";
  return (
    <div className="mt-2">
      <div className="border border-[#EEEAE6] rounded-[12px] overflow-x-auto">
        <div className="grid bg-cream border-b border-warm-200 px-3 py-2 text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em] min-w-[760px]"
          style={{ gridTemplateColumns: COLS }}>
          <span>SN</span><span>TXN No</span><span>Particular</span><span>TXN Type</span>
          <span className="text-right">Amount</span><span className="text-right">Closing Balance</span><span className="text-right">TXN Date</span>
        </div>
        {SUPPLIER_TXNS.map((t, i) => (
          <div key={t.id}
            onClick={() => onSelect(t)}
            role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(t); }}
            className="grid px-3 py-[11px] items-center min-w-[760px] cursor-pointer hover:bg-warm-50 transition-colors"
            style={{ gridTemplateColumns: COLS, borderBottom: i === SUPPLIER_TXNS.length - 1 ? "none" : "1px solid #F4EFEB" }}>
            <span className="text-[12px] font-mono text-warm-500">{i + 1}</span>
            <span className="text-[12px] font-mono font-semibold text-[#0EA5E9]">{t.txnNo}</span>
            <span className="text-[13px] font-semibold text-ink truncate pr-2">{t.particular}</span>
            <span>
              <span className="inline-flex items-center px-[9px] py-[3px] rounded-md text-[11.5px] font-bold bg-warm-100 text-warm-700">
                {t.txnType}
              </span>
            </span>
            <span className="text-[13px] font-bold text-[#15803D] text-right tnum">{t.amount} Cr</span>
            <span className="text-[13px] font-bold text-ink text-right tnum">{t.unpaid} Dr</span>
            <span className="text-[12.5px] text-warm-500 text-right tnum">{t.date}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[12px] text-warm-500">0 of {SUPPLIER_TXNS.length} row(s) selected.</div>
    </div>
  );
}

function ActivityList() {
  return (
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
  );
}

function EmptyCredit() {
  return (
    <div className="mt-4 border-[1.5px] border-dashed border-warm-200 rounded-[12px] py-[34px] text-center flex flex-col items-center gap-2">
      <div className="w-[40px] h-[40px] rounded-[12px] bg-warm-100 flex items-center justify-center"><CreditCard size={18} color="#C9BCB0" /></div>
      <span className="text-[13px] text-warm-500 font-medium">No credits</span>
    </div>
  );
}

/* ── transaction detail drawer ─────────────────────────────────── */
interface Attachment { id: number; name: string; url: string }
const MAX_ATTACH = 5;

function TxnDetailDrawer({
  txn, supplierName, onClose,
}: { txn: SupplierTxn; supplierName: string; onClose: () => void }) {
  const isCredit = txn.txnType === "Payment In" || txn.txnType === "Debit Note";
  const amountColor = isCredit ? "#15803D" : "#C2410C";
  const settled = txn.unpaid === "Rs 0";

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputId = `txn-attach-${txn.id}`;

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const room = MAX_ATTACH - attachments.length;
    const next = Array.from(files).slice(0, room).map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    setAttachments((a) => [...a, ...next]);
  };
  const remove = (id: number) =>
    setAttachments((a) => {
      const dropped = a.find((x) => x.id === id);
      if (dropped) URL.revokeObjectURL(dropped.url);
      return a.filter((x) => x.id !== id);
    });

  return (
    <Drawer
      isOpen onClose={onClose} placement="right" size="md"
      classNames={{
        base: "sm:max-w-[440px]",
        closeButton: "hidden",
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-2 border-b border-warm-200">
          <span className="flex-1 text-[18px] font-extrabold text-ink tracking-[-0.02em]">Transaction Details</span>
          <Button isIconOnly size="sm" variant="bordered" radius="md"
            className="w-[34px] h-[34px] min-w-[34px] border border-[#E6E1DC] bg-white"
            onPress={onClose}>
            <X size={16} color="#8A7D72" />
          </Button>
        </DrawerHeader>

        <DrawerBody className="px-5 gap-[18px]">
          {/* top card */}
          <div className="border border-warm-200 rounded-[14px] p-4 bg-warm-50">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[14px] font-extrabold text-ink truncate">{txn.particular}</div>
                <div className="mt-2 flex items-center gap-[6px] flex-wrap">
                  <span className="inline-flex items-center px-[9px] py-[3px] rounded-md text-[11px] font-bold bg-warm-100 text-warm-700">
                    {txn.txnType}
                  </span>
                  <span className="inline-flex items-center px-[9px] py-[3px] rounded-md text-[11px] font-bold"
                    style={{ background: settled ? "#E7F6EC" : "#FDECE4", color: settled ? "#15803D" : "#C2410C" }}>
                    {settled ? "Paid" : "Due"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-baseline gap-1">
                  <span className="text-[16px] font-extrabold tnum" style={{ color: amountColor }}>{txn.amount}</span>
                  {isCredit
                    ? <ArrowUp size={13} color={amountColor} strokeWidth={2.6} />
                    : <ArrowDown size={13} color={amountColor} strokeWidth={2.6} />}
                </div>
                <div className="mt-1 text-[12px] text-warm-500 tnum">{txn.date}</div>
              </div>
            </div>
          </div>

          {/* attachments */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[13px] font-extrabold text-ink">Attachments</h3>
              {attachments.length > 0 && (
                <span className="text-[12px] text-warm-500 font-semibold tnum">
                  {attachments.length}/{MAX_ATTACH}
                </span>
              )}
            </div>
            <input
              id={fileInputId} type="file" accept="image/*" multiple hidden
              onChange={(e) => { onFiles(e.target.files); e.currentTarget.value = ""; }}
            />
            {attachments.length === 0 ? (
              <label htmlFor={fileInputId}
                className="inline-flex items-center gap-2 h-9 px-3 rounded-[10px] border border-[#E6E1DC] bg-white hover:bg-warm-100 text-warm-700 text-[12.5px] font-semibold cursor-pointer">
                <Paperclip size={14} color="#6B5F55" />
                Add Attachments
              </label>
            ) : (
              <div className="flex flex-wrap gap-2">
                {attachments.map((a) => (
                  <div key={a.id} className="relative w-[72px] h-[72px] rounded-[10px] border border-warm-200 bg-warm-50 overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => remove(a.id)}
                      title="Remove"
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink/70 text-white flex items-center justify-center text-[10px] font-bold hover:bg-ink"
                      style={{ background: "rgba(34,28,22,0.72)" }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {attachments.length < MAX_ATTACH && (
                  <label htmlFor={fileInputId}
                    className="w-[72px] h-[72px] rounded-[10px] border-[1.5px] border-dashed border-warm-200 hover:border-[#F15022] hover:bg-warm-50 flex flex-col items-center justify-center gap-[2px] cursor-pointer transition-colors">
                    <Plus size={16} color="#8A7D72" strokeWidth={2.4} />
                    <span className="text-[11px] font-semibold text-warm-600">Add</span>
                  </label>
                )}
              </div>
            )}
          </div>

          {/* account summary */}
          <div>
            <h3 className="text-[13px] font-extrabold text-ink mb-2">Account Summary</h3>
            <div className="border border-warm-200 rounded-[12px] overflow-hidden">
              <div className="grid bg-cream border-b border-warm-200 px-3 py-2 text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em]"
                style={{ gridTemplateColumns: "1.4fr 0.9fr 0.9fr" }}>
                <span>Accounts Heads</span>
                <span className="text-right">Debit</span>
                <span className="text-right">Credit</span>
              </div>
              <div className="grid px-3 py-[10px] items-center"
                style={{ gridTemplateColumns: "1.4fr 0.9fr 0.9fr", borderBottom: "1px solid #F4EFEB" }}>
                <span className="text-[12.5px] font-semibold text-[#0EA5E9] truncate">
                  {supplierName.toLowerCase().replace(/\s+/g, " ")} <span className="text-warm-500 font-medium">(Supplier)</span>
                </span>
                <span className="text-[13px] font-semibold text-ink text-right tnum">
                  {isCredit ? "—" : txn.amount}
                </span>
                <span className="text-[13px] font-semibold text-ink text-right tnum">
                  {isCredit ? txn.amount : "—"}
                </span>
              </div>
              <div className="grid px-3 py-[10px] items-center bg-warm-50"
                style={{ gridTemplateColumns: "1.4fr 0.9fr 0.9fr" }}>
                <span className="text-[12.5px] font-extrabold text-ink">Total</span>
                <span className="text-[13px] font-extrabold text-ink text-right tnum">
                  {isCredit ? "0" : txn.amount}
                </span>
                <span className="text-[13px] font-extrabold text-ink text-right tnum">
                  {isCredit ? txn.amount : "0"}
                </span>
              </div>
            </div>
          </div>

          {/* activities */}
          <div>
            <h3 className="text-[13px] font-extrabold text-ink mb-2">Activities</h3>
            <div className="border-[1.5px] border-dashed border-warm-200 rounded-[12px] py-[34px] flex flex-col items-center gap-2">
              <div className="w-[44px] h-[44px] rounded-[12px] bg-warm-100 flex items-center justify-center">
                <Inbox size={20} color="#C9BCB0" />
              </div>
              <span className="text-[13px] font-bold text-ink">No Activities found</span>
              <span className="text-[12px] text-warm-500 font-medium">No activities found.</span>
            </div>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

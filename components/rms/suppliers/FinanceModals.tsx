"use client";

import { useMemo, useState } from "react";
import {
  Input, Textarea, Select, SelectItem, Switch, Tabs, Tab, Button,
  Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter,
} from "@heroui/react";
import {
  Calendar, Plus, Trash2, UploadCloud, Inbox,
} from "lucide-react";
import { ModalShell, ModalFooterButtons, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { ITEMS as STOCK_ITEMS, UNITS } from "@/components/stock/data";
import { SUPPLIERS } from "@/components/rms/data/suppliers";

const PURCHASE_STAFF = ["Salil Timalsina", "Priya Yadav", "Bikash Gurung"];
const ACCOUNT_HEADS  = ["Purchase", "Inventory", "Raw Materials", "Cost of Goods Sold"];

/* method chips used by Paid tab in Purchase Bill */
const BILL_METHODS = [
  { code: "CO", label: "Counter" },
  { code: "BA", label: "Bank Account" },
  { code: "OA", label: "Owner's Account" },
];

/* Payment In / Debit Note Paid methods (customer-facing) */
const IN_METHODS = [
  { code: "CA", label: "Cash" },
  { code: "CA", label: "Card" },
  { code: "FO", label: "Fonepay" },
  { code: "NP", label: "Nepal Pay" },
  { code: "BT", label: "Bank Transfer" },
];

/* Payment Out methods (paying supplier) */
const OUT_METHODS = [
  { code: "CO", label: "Counter" },
  { code: "BA", label: "Bank Account" },
  { code: "OA", label: "Owner's Account" },
];

/* tiny required-marker — uses warm orange, not browser red */
const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;

/* ── reusable method-chip row ────────────────────────────────── */
function MethodChips({
  methods, value, onChange,
}: { methods: { code: string; label: string }[]; value: string; onChange: (label: string) => void }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {methods.map((m) => {
        const active = value === m.label;
        return (
          <button
            key={m.label}
            type="button"
            onClick={() => onChange(m.label)}
            className="h-9 px-3 inline-flex items-center gap-2 rounded-[10px] border text-[12.5px] font-semibold transition-colors"
            style={{
              borderColor: active ? "#F15022" : "#E6E1DC",
              background: active ? "#FFF1EB" : "#fff",
              color: active ? "#F15022" : "#3F3933",
            }}
          >
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-[7px] text-[10px] font-extrabold"
              style={{
                background: active ? "#FBDBC9" : "#F4EFEB",
                color: active ? "#F15022" : "#6B5F55",
              }}
            >
              {m.code}
            </span>
            {m.label}
          </button>
        );
      })}
    </div>
  );
}

interface BaseProps {
  supplierName: string;
  onClose: () => void;
  onDone: (msg: string) => void;
}

const today = "2026-06-08";

function AmountInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Input
      size="sm"
      type="number"
      label="Amount"
      labelPlacement="outside"
      placeholder="0"
      value={value}
      onValueChange={onChange}
      startContent={<span className="text-[13.5px] text-warm-500 font-semibold">Rs</span>}
      variant="bordered"
      classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
    />
  );
}

function DateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Input
      size="sm"
      type="date"
      label="Date"
      labelPlacement="outside"
      value={value}
      onValueChange={onChange}
      variant="bordered"
      classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
    />
  );
}

function NoteInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Textarea
      size="sm"
      label="Note"
      labelPlacement="outside"
      placeholder="Optional reference or memo"
      minRows={2}
      value={value}
      onValueChange={onChange}
      variant="bordered"
      classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
    />
  );
}

/* ── Payment drawer (shared by In + Out) ─────────────────────── */
interface AllocRow { id: number; date: string; amount: number; balance: number }

function PaymentDrawer({
  kind, supplierName, onClose, onDone,
  methods, allocations,
}: {
  kind: "in" | "out";
  supplierName: string;
  onClose: () => void;
  onDone: (msg: string) => void;
  methods: { code: string; label: string }[];
  allocations: AllocRow[];
}) {
  const title = kind === "in" ? "Payment In" : "Payment Out";
  const saveLabel = kind === "in" ? "Save Payment In" : "Save Payment Out";

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(methods[0]?.label ?? "");
  const [remarks, setRemarks] = useState("");
  const [reference, setReference] = useState("");
  const [date, setDate] = useState(today);
  const [advance, setAdvance] = useState("");
  const [payments, setPayments] = useState<Record<number, string>>({});

  const valid = Number(amount) > 0 && method;

  const reset = () => {
    setAmount(""); setMethod(methods[0]?.label ?? "");
    setRemarks(""); setReference(""); setDate(today);
    setAdvance(""); setPayments({});
  };
  const submit = () => {
    if (!valid) return;
    onDone(`${title} of Rs ${Number(amount).toLocaleString()} recorded for ${supplierName}`);
    onClose();
  };

  return (
    <Drawer isOpen onClose={onClose} placement="right" size="md"
      classNames={{
        base: "sm:max-w-[520px]",
        closeButton: "top-[14px] right-[14px] w-8 h-8 rounded-[9px] border border-[#EFEAE6] bg-white text-warm-500 hover:bg-warm-100 z-10",
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-2 border-b border-warm-200 pr-[52px]">
          <span className="text-[18px] font-extrabold text-ink tracking-[-0.02em]">{title}</span>
        </DrawerHeader>

        <DrawerBody className="px-5 gap-[14px]">
          {/* Amount */}
          <Input
            label={<>Amount<Req /></>} labelPlacement="outside"
            type="number" placeholder="0"
            value={amount} onValueChange={setAmount}
            startContent={<span className="text-[13px] text-warm-500 font-semibold">Rs</span>}
            variant="bordered"
            classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }}
          />

          {/* Payment Mode */}
          <div className="flex flex-col gap-2">
            <span className={labelCx}>Payment Mode & Account<Req /></span>
            <MethodChips methods={methods} value={method} onChange={setMethod} />
          </div>

          {/* Remarks */}
          <Textarea
            label="Remarks" labelPlacement="outside"
            placeholder="Enter Remarks"
            minRows={2} maxLength={200}
            value={remarks} onValueChange={setRemarks}
            variant="bordered"
            classNames={{ label: labelCx, inputWrapper: `${wrapCx} h-auto min-h-[64px]`, input: inputCx }}
          />

          {/* Reference + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Reference" labelPlacement="outside" placeholder="Enter Reference"
              value={reference} onValueChange={setReference}
              variant="bordered"
              classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
            />
            <Input
              label="Date" labelPlacement="outside"
              type="date" value={date} onValueChange={setDate}
              startContent={<Calendar size={14} color="#8A7D72" />}
              variant="bordered"
              classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
            />
          </div>

          {/* Photo */}
          <div className="flex flex-col gap-2">
            <span className={labelCx}>Photo</span>
            <button className="w-full flex items-center gap-3 h-11 px-3 rounded-[10px] border border-warm-200 bg-warm-50 hover:bg-warm-100 transition-colors text-left">
              <UploadCloud size={16} color="#8A7D72" />
              <span className="text-[13px] text-warm-500 font-medium">Click here to upload your image</span>
            </button>
          </div>

          {/* Allocations */}
          <div className="flex flex-col gap-2 mt-1">
            <span className={labelCx}>Allocations</span>
            <div className="flex items-center justify-between gap-3 border border-warm-200 rounded-[10px] px-3 py-[10px] bg-warm-50">
              <span className="text-[13px] font-semibold text-ink">Book as Advance</span>
              <Input
                size="sm" aria-label="Advance" type="number" placeholder="0.00"
                value={advance} onValueChange={setAdvance}
                startContent={<span className="text-[12px] text-warm-500 font-semibold">Rs</span>}
                variant="bordered"
                classNames={{ base: "w-[130px]", inputWrapper: wrapCx, input: `${inputCx} text-right tnum` }}
              />
            </div>

            <div className="border border-warm-200 rounded-[12px] overflow-hidden">
              <div className="grid bg-cream border-b border-warm-200 px-3 py-2 text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em]"
                style={{ gridTemplateColumns: "1.1fr 1fr 1fr 1.1fr" }}>
                <span>Date</span><span>Amount</span><span>Balance</span><span>Payment</span>
              </div>
              {allocations.length === 0 ? (
                <div className="py-[28px] flex flex-col items-center gap-2">
                  <div className="w-[44px] h-[44px] rounded-[12px] bg-warm-100 flex items-center justify-center">
                    <Inbox size={20} color="#C9BCB0" />
                  </div>
                  <span className="text-[12.5px] text-warm-500 font-medium">No invoices to allocate against.</span>
                </div>
              ) : (
                allocations.map((a, i) => (
                  <div key={a.id} className="grid px-3 py-[10px] items-center"
                    style={{
                      gridTemplateColumns: "1.1fr 1fr 1fr 1.1fr",
                      borderBottom: i === allocations.length - 1 ? "none" : "1px solid #F4EFEB",
                    }}>
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-mono font-semibold text-ink">{a.date}</div>
                      <div className="text-[11px] font-semibold" style={{ color: "#0EA5E9" }}>by: {supplierName}</div>
                    </div>
                    <span className="text-[13px] font-bold text-ink tnum">Rs {a.amount.toLocaleString()}</span>
                    <span className="text-[13px] font-bold text-ink tnum">Rs {a.balance.toLocaleString()}</span>
                    <Input
                      size="sm" aria-label={`Payment ${a.id}`} type="number" placeholder="0"
                      value={payments[a.id] ?? ""}
                      onValueChange={(v) => setPayments((p) => ({ ...p, [a.id]: v }))}
                      startContent={<span className="text-[12px] text-warm-500 font-semibold">Rs</span>}
                      variant="bordered"
                      classNames={{ base: "w-full", inputWrapper: wrapCx, input: `${inputCx} text-right tnum` }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </DrawerBody>

        <DrawerFooter className="border-t border-warm-200 bg-warm-50">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={reset}>
            Reset
          </Button>
          <Button
            radius="md"
            isDisabled={!valid}
            className="font-bold disabled:opacity-100"
            style={{
              background: valid ? "#F15022" : "#EFE8E2",
              color: valid ? "#fff" : "#B7A99E",
              boxShadow: valid ? "0 2px 8px rgba(241,80,34,0.32)" : "none",
            }}
            onPress={submit}
          >
            {saveLabel}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const SAMPLE_OPEN_ALLOC: AllocRow[] = [
  { id: 1, date: "2026.06.05", amount: 1000, balance: 1000 },
];

export function PaymentInModal({ supplierName, onClose, onDone }: BaseProps) {
  return (
    <PaymentDrawer
      kind="in"
      supplierName={supplierName}
      onClose={onClose} onDone={onDone}
      methods={IN_METHODS}
      allocations={SAMPLE_OPEN_ALLOC}
    />
  );
}

export function PaymentOutModal({ supplierName, onClose, onDone }: BaseProps) {
  return (
    <PaymentDrawer
      kind="out"
      supplierName={supplierName}
      onClose={onClose} onDone={onDone}
      methods={OUT_METHODS}
      allocations={[]}
    />
  );
}

/* ── Add Purchase Bill (full data entry) ───────────────────── */
interface BillRow {
  id: number;
  stockItem: string;
  description: string;
  uom: string;
  qty: string;
  rate: string;
  accountHead: string;
}

const blankRow = (id: number): BillRow => ({
  id, stockItem: "", description: "", uom: "", qty: "", rate: "", accountHead: "",
});

const fmtRs = (n: number) =>
  n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function AddPurchaseBillModal({ supplierName, onClose, onDone }: BaseProps) {
  const [supplier, setSupplier]   = useState(supplierName);
  const [billDate, setBillDate]   = useState(today);
  const [billRef, setBillRef]     = useState("");
  const [staff, setStaff]         = useState("");
  const [rows, setRows]           = useState<BillRow[]>([blankRow(1)]);
  const [remarks, setRemarks]     = useState("");
  const [paid, setPaid]           = useState<"paid" | "credit">("paid");
  const [method, setMethod]       = useState<string>("CO");
  const [multi, setMulti]         = useState(false);
  const [discount, setDiscount]   = useState("");

  const subTotal = useMemo(
    () => rows.reduce((s, r) => s + (Number(r.qty) || 0) * (Number(r.rate) || 0), 0),
    [rows],
  );
  const taxable  = Math.max(0, subTotal - (Number(discount) || 0));
  const total    = taxable;

  const allRowsFilled = rows.every(
    (r) => r.uom && r.qty && r.rate && r.accountHead,
  );
  const valid = supplier && billDate && allRowsFilled && rows.length > 0 && subTotal > 0;

  const addRow    = () => setRows((r) => [...r, blankRow((r.at(-1)?.id ?? 0) + 1)]);
  const removeRow = (id: number) => setRows((r) => (r.length > 1 ? r.filter((x) => x.id !== id) : r));
  const patchRow  = (id: number, p: Partial<BillRow>) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const reset = () => {
    setBillRef(""); setStaff(""); setRows([blankRow(1)]);
    setRemarks(""); setDiscount(""); setPaid("paid"); setMethod("CO"); setMulti(false);
  };
  const submit = () => {
    if (!valid) return;
    onDone(`Purchase bill (Rs ${fmtRs(total)}) added for ${supplier}`);
    onClose();
  };

  return (
    <ModalShell
      title="Add Purchase Bill"
      subtitle={`Log a purchase from ${supplier}.`}
      size="full"
      baseClassName="!max-w-[96vw] lg:!max-w-[1180px] xl:!max-w-[1340px] !h-auto !max-h-[92vh] !my-4 !rounded-[22px]"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={reset}>
            Reset
          </Button>
          <Button
            radius="md"
            isDisabled={!valid}
            className="font-bold disabled:opacity-100"
            style={{
              background: valid ? "#F15022" : "#EFE8E2",
              color: valid ? "#fff" : "#B7A99E",
              boxShadow: valid ? "0 2px 8px rgba(241,80,34,0.32)" : "none",
            }}
            onPress={submit}
          >
            Save Purchase Bill
          </Button>
        </div>
      }
    >
      {/* — top fields — */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Select
          label="Supplier" labelPlacement="outside"
          selectedKeys={[supplier]} onSelectionChange={(k) => setSupplier(Array.from(k)[0] as string)}
          variant="bordered" radius="md"
          classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
        >
          {SUPPLIERS.map((s) => <SelectItem key={s.name}>{s.name}</SelectItem>)}
        </Select>
        <Input
          label={<>Bill Date<Req /></>}
          labelPlacement="outside"
          type="date" value={billDate} onValueChange={setBillDate}
          startContent={<Calendar size={14} color="#8A7D72" />}
          variant="bordered"
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
        <Input
          label="Bill Reference Number" labelPlacement="outside"
          placeholder="Enter Bill Reference Number"
          value={billRef} onValueChange={setBillRef}
          variant="bordered"
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
        <Select
          label="Purchase Staff" labelPlacement="outside"
          placeholder="Select Purchase Staff"
          selectedKeys={staff ? [staff] : []}
          onSelectionChange={(k) => setStaff(Array.from(k)[0] as string ?? "")}
          variant="bordered" radius="md"
          classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
        >
          {PURCHASE_STAFF.map((s) => <SelectItem key={s}>{s}</SelectItem>)}
        </Select>
      </div>

      {/* — item details — */}
      <div className="mt-2">
        <h3 className="text-[13px] font-extrabold text-ink mb-2">Item Details</h3>
        <div className="border border-warm-200 rounded-[12px] overflow-x-auto">
          <div
            className="grid gap-x-3 bg-cream border-b border-warm-200 px-4 py-[10px] text-[11px] font-bold text-warm-600 uppercase tracking-[0.04em] min-w-[920px]"
            style={{ gridTemplateColumns: "40px 1.4fr 1.3fr 0.95fr 0.85fr 0.95fr 1fr 1.3fr 40px" }}
          >
            <span>SN</span><span>Stock Item</span><span>Description</span>
            <span>UOM<Req /></span>
            <span>QTY<Req /></span>
            <span>Rate<Req /></span>
            <span>Amount</span>
            <span>Account Head<Req /></span>
            <span />
          </div>

          {rows.map((row, i) => {
            const amount = (Number(row.qty) || 0) * (Number(row.rate) || 0);
            return (
              <div
                key={row.id}
                className="grid gap-x-3 px-4 py-3 items-center min-w-[920px]"
                style={{
                  gridTemplateColumns: "40px 1.4fr 1.3fr 0.95fr 0.85fr 0.95fr 1fr 1.3fr 40px",
                  borderBottom: i === rows.length - 1 ? "none" : "1px solid #F4EFEB",
                }}
              >
                <span className="text-[12.5px] font-mono text-warm-600">{i + 1}.</span>
                <Select
                  size="sm" aria-label="Stock Item"
                  placeholder="Select Stock Item"
                  selectedKeys={row.stockItem ? [row.stockItem] : []}
                  onSelectionChange={(k) => {
                    const v = Array.from(k)[0] as string;
                    const item = STOCK_ITEMS.find((x) => x.name === v);
                    patchRow(row.id, {
                      stockItem: v,
                      uom: item?.unit ?? row.uom,
                      rate: item ? String(item.rateNum) : row.rate,
                    });
                  }}
                  variant="bordered" radius="md"
                  classNames={{ trigger: wrapCx, value: inputCx }}
                >
                  {STOCK_ITEMS.map((s) => <SelectItem key={s.name}>{s.name}</SelectItem>)}
                </Select>
                <Input size="sm" aria-label="Description" placeholder="Enter Description"
                  value={row.description} onValueChange={(v) => patchRow(row.id, { description: v })}
                  variant="bordered" classNames={{ inputWrapper: wrapCx, input: inputCx }} />
                <Select size="sm" aria-label="UOM" placeholder="Select UOM"
                  selectedKeys={row.uom ? [row.uom] : []}
                  onSelectionChange={(k) => patchRow(row.id, { uom: Array.from(k)[0] as string })}
                  variant="bordered" radius="md"
                  classNames={{ trigger: wrapCx, value: inputCx }}>
                  {UNITS.map((u) => <SelectItem key={u}>{u}</SelectItem>)}
                </Select>
                <Input size="sm" aria-label="QTY" type="number" placeholder="0.00"
                  value={row.qty} onValueChange={(v) => patchRow(row.id, { qty: v })}
                  variant="bordered" classNames={{ inputWrapper: wrapCx, input: `${inputCx} text-right tnum` }} />
                <Input size="sm" aria-label="Rate" type="number" placeholder="0.00"
                  value={row.rate} onValueChange={(v) => patchRow(row.id, { rate: v })}
                  variant="bordered" classNames={{ inputWrapper: wrapCx, input: `${inputCx} text-right tnum` }} />
                <div className="h-10 flex items-center px-3 rounded-[9px] bg-warm-50 border border-warm-200 text-[13px] font-semibold text-ink tnum">
                  <span className="text-warm-500 text-[12px] mr-1">Rs</span>{fmtRs(amount)}
                </div>
                <Select size="sm" aria-label="Account Head" placeholder="Select Account Head"
                  selectedKeys={row.accountHead ? [row.accountHead] : []}
                  onSelectionChange={(k) => patchRow(row.id, { accountHead: Array.from(k)[0] as string })}
                  variant="bordered" radius="md"
                  classNames={{ trigger: wrapCx, value: inputCx }}>
                  {ACCOUNT_HEADS.map((h) => <SelectItem key={h}>{h}</SelectItem>)}
                </Select>
                <button
                  onClick={() => removeRow(row.id)}
                  className="w-9 h-9 rounded-[9px] flex items-center justify-center border border-warm-200 bg-white hover:bg-warm-100 transition-colors"
                  title="Remove row"
                >
                  <Trash2 size={14} color="#8A7D72" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <Button size="sm" variant="bordered" radius="md"
            className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-700 text-[12.5px]"
            startContent={<Plus size={14} color="#6B5F55" strokeWidth={2.4} />}
            onPress={addRow}>
            Add Row
          </Button>
          <span className="text-[11.5px] text-warm-500 font-medium">
            Fields marked <Req /> are required; every row must be filled to save.
          </span>
        </div>
      </div>

      {/* — attachments — */}
      <div className="mt-2">
        <h3 className="text-[13px] font-extrabold text-ink mb-2">Attachments</h3>
        <button className="w-full flex items-center gap-3 h-12 px-3 rounded-[10px] border border-warm-200 bg-warm-50 hover:bg-warm-100 transition-colors text-left">
          <UploadCloud size={18} color="#8A7D72" />
          <span className="text-[13px] text-warm-500 font-medium">Click here to upload your image</span>
        </button>
      </div>

      {/* — remarks — */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[13px] font-extrabold text-ink">Remarks</h3>
          <span className="text-[11.5px] text-warm-500 tnum">{remarks.length} / 200</span>
        </div>
        <Textarea
          aria-label="Remarks" placeholder="Enter Remarks"
          minRows={3} maxLength={200}
          value={remarks} onValueChange={setRemarks}
          variant="bordered"
          classNames={{ inputWrapper: `${wrapCx} h-auto min-h-[88px]`, input: inputCx }}
        />
      </div>

      {/* — payment + totals — */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 mt-2">
        {/* payment account */}
        <div className="border border-warm-200 rounded-[14px] p-4">
          <h3 className="text-[13px] font-extrabold text-ink mb-3">
            Payment Account<Req />
          </h3>
          <Tabs
            selectedKey={paid}
            onSelectionChange={(k) => setPaid(k as "paid" | "credit")}
            radius="md" size="sm" fullWidth
            classNames={{
              tabList: "bg-[#F6EFE8]",
              cursor: "bg-white shadow-sm",
              tabContent: "font-bold text-[12.5px]",
            }}
          >
            <Tab key="paid" title="Paid" />
            <Tab key="credit" title="Unpaid / Credit" />
          </Tabs>

          {paid === "paid" && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <MethodChips methods={BILL_METHODS} value={method} onChange={setMethod} />
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-ink">Multiple Payment</span>
            <Switch isSelected={multi} onValueChange={setMulti} size="sm"
              classNames={{ wrapper: "group-data-[selected=true]:bg-[#F15022]" }} />
          </div>
          <p className="mt-1 text-[11.5px] text-warm-500 font-medium">
            Turn on to split payment across multiple accounts.
          </p>
        </div>

        {/* totals */}
        <div className="border border-warm-200 rounded-[14px] p-4 flex flex-col gap-[14px] self-start bg-warm-50">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold text-ink">Sub Total</span>
            <span className="text-[15px] font-extrabold text-ink tnum">Rs {fmtRs(subTotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] font-semibold text-warm-700">− Discount</span>
            <Input
              size="sm" aria-label="Discount" type="number" placeholder="0"
              value={discount} onValueChange={setDiscount}
              startContent={<span className="text-[12px] text-warm-500 font-semibold">Rs</span>}
              variant="bordered"
              classNames={{ base: "w-[130px]", inputWrapper: wrapCx, input: `${inputCx} text-right tnum` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold text-ink">Taxable Amount</span>
            <span className="text-[15px] font-extrabold text-ink tnum">Rs {fmtRs(taxable)}</span>
          </div>
          <div className="flex items-center justify-between text-[12.5px] text-warm-600">
            <span className="font-semibold">+ No Tax (Rs 0)</span>
            <span className="tnum">Rs 0</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-warm-200">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-extrabold text-ink">Total Amount</span>
              <button className="text-[11px] font-semibold text-warm-600 bg-warm-100 hover:bg-warm-200 px-2 py-[3px] rounded-md">
                Add Round Off?
              </button>
            </div>
            <span className="text-[16px] font-extrabold text-ink tnum">Rs {fmtRs(total)}</span>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

/* ── Purchase Return (Debit Note) ──────────────────────────── */
export function AddDebitNoteModal({ supplierName, onClose, onDone }: BaseProps) {
  const [supplier, setSupplier]   = useState(supplierName);
  const [billDate, setBillDate]   = useState(today);
  const [billRef, setBillRef]     = useState("");
  const [staff, setStaff]         = useState("");
  const [rows, setRows]           = useState<BillRow[]>([blankRow(1)]);
  const [remarks, setRemarks]     = useState("");
  const [paid, setPaid]           = useState<"paid" | "credit">("paid");
  const [method, setMethod]       = useState<string>(IN_METHODS[0].label);
  const [discount, setDiscount]   = useState("");
  const [dueDate, setDueDate]     = useState("");

  const subTotal = useMemo(
    () => rows.reduce((s, r) => s + (Number(r.qty) || 0) * (Number(r.rate) || 0), 0),
    [rows],
  );
  const taxable  = Math.max(0, subTotal - (Number(discount) || 0));
  const total    = taxable;

  const allRowsFilled = rows.every((r) => r.uom && r.qty && r.rate && r.accountHead);
  const valid = supplier && billDate && billRef.trim().length > 0 && allRowsFilled && rows.length > 0 && subTotal > 0;

  const addRow    = () => setRows((r) => [...r, blankRow((r.at(-1)?.id ?? 0) + 1)]);
  const removeRow = (id: number) => setRows((r) => (r.length > 1 ? r.filter((x) => x.id !== id) : r));
  const patchRow  = (id: number, p: Partial<BillRow>) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const reset = () => {
    setBillRef(""); setStaff(""); setRows([blankRow(1)]);
    setRemarks(""); setDiscount(""); setPaid("paid");
    setMethod(IN_METHODS[0].label); setDueDate("");
  };
  const submit = () => {
    if (!valid) return;
    onDone(`Purchase return ${billRef.trim()} (Rs ${fmtRs(total)}) recorded for ${supplier}`);
    onClose();
  };

  return (
    <ModalShell
      title="Purchase Return (Debit Note)"
      size="full"
      baseClassName="!max-w-[96vw] lg:!max-w-[1180px] xl:!max-w-[1340px] !h-auto !max-h-[92vh] !my-4 !rounded-[22px]"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={reset}>
            Reset
          </Button>
          <Button
            radius="md"
            isDisabled={!valid}
            className="font-bold disabled:opacity-100"
            style={{
              background: valid ? "#F15022" : "#EFE8E2",
              color: valid ? "#fff" : "#B7A99E",
              boxShadow: valid ? "0 2px 8px rgba(241,80,34,0.32)" : "none",
            }}
            onPress={submit}
          >
            Save Purchase Return
          </Button>
        </div>
      }
    >
      {/* top fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Select
          label="Supplier" labelPlacement="outside"
          selectedKeys={[supplier]} onSelectionChange={(k) => setSupplier(Array.from(k)[0] as string)}
          variant="bordered" radius="md"
          classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
        >
          {SUPPLIERS.map((s) => <SelectItem key={s.name}>{s.name}</SelectItem>)}
        </Select>
        <Input
          label={<>Bill Date<Req /></>} labelPlacement="outside"
          type="date" value={billDate} onValueChange={setBillDate}
          startContent={<Calendar size={14} color="#8A7D72" />}
          variant="bordered"
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
        <Input
          label={<>Bill Reference Number<Req /></>} labelPlacement="outside"
          placeholder="Enter Bill Reference Number"
          value={billRef} onValueChange={setBillRef}
          variant="bordered"
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
        <Select
          label="Purchase" labelPlacement="outside"
          placeholder="Select Purchase Staff"
          selectedKeys={staff ? [staff] : []}
          onSelectionChange={(k) => setStaff(Array.from(k)[0] as string ?? "")}
          variant="bordered" radius="md"
          classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
        >
          {PURCHASE_STAFF.map((s) => <SelectItem key={s}>{s}</SelectItem>)}
        </Select>
      </div>

      {/* item details */}
      <div className="mt-2">
        <h3 className="text-[13px] font-extrabold text-ink mb-2">Item Details</h3>
        <div className="border border-warm-200 rounded-[12px] overflow-x-auto">
          <div
            className="grid gap-x-3 bg-cream border-b border-warm-200 px-4 py-[10px] text-[11px] font-bold text-warm-600 uppercase tracking-[0.04em] min-w-[920px]"
            style={{ gridTemplateColumns: "40px 1.4fr 1.3fr 0.95fr 0.85fr 0.95fr 1fr 1.3fr 40px" }}
          >
            <span>SN</span><span>Stock Item</span><span>Description</span>
            <span>UOM<Req /></span><span>QTY<Req /></span><span>Rate<Req /></span>
            <span>Amount</span><span>Account Head<Req /></span><span />
          </div>
          {rows.map((row, i) => {
            const amount = (Number(row.qty) || 0) * (Number(row.rate) || 0);
            return (
              <div key={row.id} className="grid gap-x-3 px-4 py-3 items-center min-w-[920px]"
                style={{
                  gridTemplateColumns: "40px 1.4fr 1.3fr 0.95fr 0.85fr 0.95fr 1fr 1.3fr 40px",
                  borderBottom: i === rows.length - 1 ? "none" : "1px solid #F4EFEB",
                }}>
                <span className="text-[12.5px] font-mono text-warm-600">{i + 1}.</span>
                <Select size="sm" aria-label="Stock Item" placeholder="Select Stock Item"
                  selectedKeys={row.stockItem ? [row.stockItem] : []}
                  onSelectionChange={(k) => {
                    const v = Array.from(k)[0] as string;
                    const item = STOCK_ITEMS.find((x) => x.name === v);
                    patchRow(row.id, { stockItem: v, uom: item?.unit ?? row.uom, rate: item ? String(item.rateNum) : row.rate });
                  }}
                  variant="bordered" radius="md"
                  classNames={{ trigger: wrapCx, value: inputCx }}>
                  {STOCK_ITEMS.map((s) => <SelectItem key={s.name}>{s.name}</SelectItem>)}
                </Select>
                <Input size="sm" aria-label="Description" placeholder="Enter Description"
                  value={row.description} onValueChange={(v) => patchRow(row.id, { description: v })}
                  variant="bordered" classNames={{ inputWrapper: wrapCx, input: inputCx }} />
                <Select size="sm" aria-label="UOM" placeholder="Select UOM"
                  selectedKeys={row.uom ? [row.uom] : []}
                  onSelectionChange={(k) => patchRow(row.id, { uom: Array.from(k)[0] as string })}
                  variant="bordered" radius="md"
                  classNames={{ trigger: wrapCx, value: inputCx }}>
                  {UNITS.map((u) => <SelectItem key={u}>{u}</SelectItem>)}
                </Select>
                <Input size="sm" aria-label="QTY" type="number" placeholder="0.00"
                  value={row.qty} onValueChange={(v) => patchRow(row.id, { qty: v })}
                  variant="bordered" classNames={{ inputWrapper: wrapCx, input: `${inputCx} text-right tnum` }} />
                <Input size="sm" aria-label="Rate" type="number" placeholder="0.00"
                  value={row.rate} onValueChange={(v) => patchRow(row.id, { rate: v })}
                  variant="bordered" classNames={{ inputWrapper: wrapCx, input: `${inputCx} text-right tnum` }} />
                <div className="h-10 flex items-center px-3 rounded-[9px] bg-warm-50 border border-warm-200 text-[13px] font-semibold text-ink tnum">
                  <span className="text-warm-500 text-[12px] mr-1">Rs</span>{fmtRs(amount)}
                </div>
                <Select size="sm" aria-label="Account Head" placeholder="Select Account Head"
                  selectedKeys={row.accountHead ? [row.accountHead] : []}
                  onSelectionChange={(k) => patchRow(row.id, { accountHead: Array.from(k)[0] as string })}
                  variant="bordered" radius="md"
                  classNames={{ trigger: wrapCx, value: inputCx }}>
                  {ACCOUNT_HEADS.map((h) => <SelectItem key={h}>{h}</SelectItem>)}
                </Select>
                <button onClick={() => removeRow(row.id)}
                  className="w-9 h-9 rounded-[9px] flex items-center justify-center border border-warm-200 bg-white hover:bg-warm-100 transition-colors"
                  title="Remove row">
                  <Trash2 size={14} color="#8A7D72" />
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <Button size="sm" variant="bordered" radius="md"
            className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-700 text-[12.5px]"
            startContent={<Plus size={14} color="#6B5F55" strokeWidth={2.4} />}
            onPress={addRow}>Add Row</Button>
          <span className="text-[11.5px] text-warm-500 font-medium">
            Fields marked <Req /> are required; every row must be filled to save.
          </span>
        </div>
      </div>

      {/* attachments */}
      <div className="mt-2">
        <h3 className="text-[13px] font-extrabold text-ink mb-2">Attachments</h3>
        <button className="w-full flex items-center gap-3 h-12 px-3 rounded-[10px] border border-warm-200 bg-warm-50 hover:bg-warm-100 transition-colors text-left">
          <UploadCloud size={18} color="#8A7D72" />
          <span className="text-[13px] text-warm-500 font-medium">Click here to upload your image</span>
        </button>
      </div>

      {/* remarks */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[13px] font-extrabold text-ink">Remarks</h3>
          <span className="text-[11.5px] text-warm-500 tnum">{remarks.length} / 200</span>
        </div>
        <Textarea aria-label="Remarks" placeholder="Enter Remarks"
          minRows={3} maxLength={200}
          value={remarks} onValueChange={setRemarks}
          variant="bordered"
          classNames={{ inputWrapper: `${wrapCx} h-auto min-h-[88px]`, input: inputCx }}
        />
      </div>

      {/* payment + totals */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 mt-2">
        <div className="border border-warm-200 rounded-[14px] p-4">
          <h3 className="text-[13px] font-extrabold text-ink mb-3">Payment Mode<Req /></h3>
          <Tabs
            selectedKey={paid}
            onSelectionChange={(k) => setPaid(k as "paid" | "credit")}
            radius="md" size="sm" fullWidth
            classNames={{
              tabList: "bg-[#F6EFE8]",
              cursor: "bg-white shadow-sm",
              tabContent: "font-bold text-[12.5px]",
            }}
          >
            <Tab key="paid" title="Paid" />
            <Tab key="credit" title="Unpaid / Credit" />
          </Tabs>

          {paid === "paid" ? (
            <div className="mt-3">
              <MethodChips methods={IN_METHODS} value={method} onChange={setMethod} />
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-extrabold text-ink">Due</span>
                <span className="text-[15px] font-extrabold text-ink tnum">Rs {fmtRs(total)}</span>
              </div>
              <Input
                label="Due Date" labelPlacement="outside"
                type="date" placeholder="|| Pick a date"
                value={dueDate} onValueChange={setDueDate}
                startContent={<Calendar size={14} color="#8A7D72" />}
                variant="bordered"
                classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
              />
            </div>
          )}
        </div>

        <div className="border border-warm-200 rounded-[14px] p-4 flex flex-col gap-[14px] self-start bg-warm-50">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold text-ink">Sub Total</span>
            <span className="text-[15px] font-extrabold text-ink tnum">Rs {fmtRs(subTotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[13px] font-semibold text-warm-700">− Discount</span>
            <Input
              size="sm" aria-label="Discount" type="number" placeholder="0"
              value={discount} onValueChange={setDiscount}
              startContent={<span className="text-[12px] text-warm-500 font-semibold">Rs</span>}
              variant="bordered"
              classNames={{ base: "w-[130px]", inputWrapper: wrapCx, input: `${inputCx} text-right tnum` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold text-ink">Taxable Amount</span>
            <span className="text-[15px] font-extrabold text-ink tnum">Rs {fmtRs(taxable)}</span>
          </div>
          <div className="flex items-center justify-between text-[12.5px] text-warm-600">
            <span className="font-semibold">+ No Tax (Rs 0)</span>
            <span className="tnum">Rs 0</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-warm-200">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-extrabold text-ink">Total Amount</span>
              <button className="text-[11px] font-semibold text-warm-600 bg-warm-100 hover:bg-warm-200 px-2 py-[3px] rounded-md">
                Add Round Off?
              </button>
            </div>
            <span className="text-[16px] font-extrabold text-ink tnum">Rs {fmtRs(total)}</span>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

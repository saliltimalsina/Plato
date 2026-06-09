"use client";

import { useState } from "react";
import { Input, Textarea } from "@heroui/react";
import { ModalShell, ModalFooterButtons, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";

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

/* ── Payment In ────────────────────────────────────────────── */
export function PaymentInModal({ supplierName, onClose, onDone }: BaseProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");
  const valid = Number(amount) > 0;
  const submit = () => {
    if (!valid) return;
    onDone(`Payment in of Rs ${Number(amount).toLocaleString()} recorded for ${supplierName}`);
    onClose();
  };
  return (
    <ModalShell
      title="Payment In"
      subtitle={`Record money received from ${supplierName}.`}
      size="md"
      onClose={onClose}
      footer={<ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel="Record payment" disabled={!valid} />}
    >
      <AmountInput value={amount} onChange={setAmount} />
      <DateInput value={date} onChange={setDate} />
      <NoteInput value={note} onChange={setNote} />
    </ModalShell>
  );
}

/* ── Payment Out ───────────────────────────────────────────── */
export function PaymentOutModal({ supplierName, onClose, onDone }: BaseProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");
  const valid = Number(amount) > 0;
  const submit = () => {
    if (!valid) return;
    onDone(`Payment out of Rs ${Number(amount).toLocaleString()} recorded for ${supplierName}`);
    onClose();
  };
  return (
    <ModalShell
      title="Payment Out"
      subtitle={`Record money paid to ${supplierName}.`}
      size="md"
      onClose={onClose}
      footer={<ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel="Record payment" disabled={!valid} />}
    >
      <AmountInput value={amount} onChange={setAmount} />
      <DateInput value={date} onChange={setDate} />
      <NoteInput value={note} onChange={setNote} />
    </ModalShell>
  );
}

/* ── Add Purchase Bill ─────────────────────────────────────── */
export function AddPurchaseBillModal({ supplierName, onClose, onDone }: BaseProps) {
  const [billNo, setBillNo] = useState("");
  const [items, setItems] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const valid = billNo.trim().length > 0 && Number(amount) > 0;
  const submit = () => {
    if (!valid) return;
    onDone(`Purchase bill ${billNo.trim()} (Rs ${Number(amount).toLocaleString()}) added for ${supplierName}`);
    onClose();
  };
  return (
    <ModalShell
      title="Add Purchase Bill"
      subtitle={`Log a purchase from ${supplierName}.`}
      size="md"
      onClose={onClose}
      footer={<ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel="Add bill" disabled={!valid} />}
    >
      <div className="grid grid-cols-2 gap-3">
        <Input
          autoFocus
          size="sm"
          label="Bill no."
          labelPlacement="outside"
          placeholder="e.g. PB-0003"
          value={billNo}
          onValueChange={setBillNo}
          variant="bordered"
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
        <DateInput value={date} onChange={setDate} />
      </div>
      <Textarea
        size="sm"
        label="Items"
        labelPlacement="outside"
        placeholder="e.g. Cooking Oil (20L), Spices restock"
        minRows={2}
        value={items}
        onValueChange={setItems}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
      />
      <AmountInput value={amount} onChange={setAmount} />
    </ModalShell>
  );
}

/* ── Add Debit Note ────────────────────────────────────────── */
export function AddDebitNoteModal({ supplierName, onClose, onDone }: BaseProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");
  const valid = Number(amount) > 0;
  const submit = () => {
    if (!valid) return;
    onDone(`Debit note of Rs ${Number(amount).toLocaleString()} added for ${supplierName}`);
    onClose();
  };
  return (
    <ModalShell
      title="Add Debit Note"
      subtitle={`Record a return or adjustment for ${supplierName}.`}
      size="md"
      onClose={onClose}
      footer={<ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel="Add debit note" disabled={!valid} />}
    >
      <AmountInput value={amount} onChange={setAmount} />
      <DateInput value={date} onChange={setDate} />
      <NoteInput value={note} onChange={setNote} />
    </ModalShell>
  );
}

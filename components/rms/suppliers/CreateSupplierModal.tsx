"use client";

import { useState } from "react";
import { Input } from "@heroui/react";
import { ModalShell, ModalFooterButtons, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import type { Supplier } from "@/components/rms/data/suppliers";

interface Props {
  onClose: () => void;
  onSave: (s: Supplier) => void;
}

interface FormState {
  name: string;
  phone: string;
  dob: string;
  email: string;
  address: string;
  legalName: string;
  taxNumber: string;
}

const EMPTY: FormState = { name: "", phone: "", dob: "", email: "", address: "", legalName: "", taxNumber: "" };

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";
}

export function CreateSupplierModal({ onClose, onSave }: Props) {
  const [f, setF] = useState<FormState>(EMPTY);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }));
  const valid = f.name.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    onSave({
      id: 0,
      name: f.name.trim(),
      initials: initials(f.name),
      phone: f.phone.trim() || "-",
      dob: f.dob.trim() || "-",
      dueAmount: 0,
      direction: "Settled",
      email: f.email.trim() || "-",
      address: f.address.trim() || undefined,
      legalName: f.legalName.trim() || undefined,
      taxNumber: f.taxNumber.trim() || undefined,
    });
  };

  return (
    <ModalShell
      title="Add New Supplier"
      subtitle="Add a supplier to track purchases and payments."
      size="lg"
      onClose={onClose}
      footer={<ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel="Add supplier" disabled={!valid} />}
    >
      <Input
        autoFocus
        size="sm"
        label="Name"
        labelPlacement="outside"
        placeholder="e.g. Ramesh Thapa"
        value={f.name}
        onValueChange={(v) => set("name", v)}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          size="sm"
          label="Phone"
          labelPlacement="outside"
          placeholder="+977 98XXXXXXXX"
          value={f.phone}
          onValueChange={(v) => set("phone", v)}
          variant="bordered"
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
        <Input
          size="sm"
          type="date"
          label="Date of birth"
          labelPlacement="outside"
          value={f.dob}
          onValueChange={(v) => set("dob", v)}
          variant="bordered"
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
      </div>

      <Input
        size="sm"
        type="email"
        label="Email"
        labelPlacement="outside"
        placeholder="name@example.com"
        value={f.email}
        onValueChange={(v) => set("email", v)}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
      />

      <Input
        size="sm"
        label="Address"
        labelPlacement="outside"
        placeholder="e.g. Imadol Krishna Mandir Rd"
        value={f.address}
        onValueChange={(v) => set("address", v)}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          size="sm"
          label="Legal name"
          labelPlacement="outside"
          placeholder="Optional"
          value={f.legalName}
          onValueChange={(v) => set("legalName", v)}
          variant="bordered"
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
        <Input
          size="sm"
          label="Tax number"
          labelPlacement="outside"
          placeholder="Optional"
          value={f.taxNumber}
          onValueChange={(v) => set("taxNumber", v)}
          variant="bordered"
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
      </div>
    </ModalShell>
  );
}

"use client";

import { useState } from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import { ModalShell, ModalFooterButtons, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { Staff, Role, ROLES, ROLE_CONFIG, StaffStatus } from "@/components/rms/data/staff";

interface Props {
  onClose: () => void;
  onSave: (s: Staff) => void;
}

interface FormState {
  name: string;
  role: Role;
  position: string;
  phone: string;
  email: string;
  status: StaffStatus;
}

const STATUS_OPTIONS: { key: StaffStatus; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
];

function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

export function CreateStaffModal({ onClose, onSave }: Props) {
  const [f, setF] = useState<FormState>({
    name: "", role: "kitchen", position: "", phone: "", email: "", status: "active",
  });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }));
  const valid = f.name.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    onSave({
      id: 0,
      name: f.name.trim(),
      initials: initialsOf(f.name) || "?",
      role: f.role,
      position: f.position.trim(),
      phone: f.phone.trim(),
      email: f.email.trim(),
      status: f.status,
    });
  };

  return (
    <ModalShell
      title="Add Staff"
      subtitle="Add a new team member to your restaurant."
      onClose={onClose}
      footer={<ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel="Add staff" disabled={!valid} />}
    >
      <Input
        autoFocus
        size="sm"
        label="Name"
        labelPlacement="outside"
        placeholder="e.g. Jaspreet Singh"
        value={f.name}
        onValueChange={(v) => set("name", v)}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          size="sm"
          label="Role"
          labelPlacement="outside"
          selectedKeys={new Set([f.role])}
          onSelectionChange={(k) => { const v = [...k][0]; if (v) set("role", v as Role); }}
          variant="bordered"
          classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
        >
          {ROLES.map((r) => <SelectItem key={r}>{ROLE_CONFIG[r].label}</SelectItem>)}
        </Select>
        <Select
          size="sm"
          label="Status"
          labelPlacement="outside"
          selectedKeys={new Set([f.status])}
          onSelectionChange={(k) => { const v = [...k][0]; if (v) set("status", v as StaffStatus); }}
          variant="bordered"
          classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
        >
          {STATUS_OPTIONS.map((o) => <SelectItem key={o.key}>{o.label}</SelectItem>)}
        </Select>
      </div>

      <Input
        size="sm"
        label="Position"
        labelPlacement="outside"
        placeholder="e.g. Head Chef"
        value={f.position}
        onValueChange={(v) => set("position", v)}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          size="sm"
          label="Phone"
          labelPlacement="outside"
          placeholder="+977 …"
          value={f.phone}
          onValueChange={(v) => set("phone", v)}
          variant="bordered"
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
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
      </div>
    </ModalShell>
  );
}

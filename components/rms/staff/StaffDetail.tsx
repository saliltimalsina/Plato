"use client";

import { Button } from "@heroui/react";
import { Pencil, Trash2 } from "lucide-react";
import { DrawerShell, Section, DField } from "@/components/rms/DrawerShell";
import { Avatar, Badge, ORANGE } from "@/components/rms/primitives";
import { Staff, ROLE_CONFIG } from "@/components/rms/data/staff";

interface Props {
  staff: Staff;
  onClose: () => void;
  onEdit: (s: Staff) => void;
  onDelete: (s: Staff) => void;
}

export function StaffDetail({ staff, onClose, onEdit, onDelete }: Props) {
  const rc = ROLE_CONFIG[staff.role];

  return (
    <DrawerShell
      onClose={onClose}
      header={
        <div className="flex items-center gap-3 min-w-0">
          <Avatar initials={staff.initials} color={rc.color} size={44} />
          <div className="min-w-0">
            <div className="text-[16px] font-extrabold text-ink tracking-[-0.02em] truncate">{staff.name}</div>
            <div className="mt-[3px]"><Badge tone={rc.tone}>{rc.label}</Badge></div>
          </div>
        </div>
      }
      footer={
        <>
          <Button variant="bordered" radius="md" className="border border-[#E6E1DC] bg-white font-semibold text-warm-600"
            startContent={<Trash2 size={15} color={ORANGE} />} onPress={() => onDelete(staff)}>
            Delete
          </Button>
          <Button radius="md" className="font-bold text-white" style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
            startContent={<Pencil size={15} color="#fff" />} onPress={() => onEdit(staff)}>
            Edit
          </Button>
        </>
      }
    >
      <Section title="Details" first>
        <div className="grid grid-cols-2 gap-x-4 gap-y-[18px]">
          <DField label="Role"><Badge tone={rc.tone}>{rc.label}</Badge></DField>
          <DField label="Position">{staff.position}</DField>
          <DField label="Phone"><span className="tnum">{staff.phone}</span></DField>
          <DField label="Email"><span className="break-all">{staff.email}</span></DField>
          <DField label="Status">
            <Badge tone={staff.status === "active" ? "success" : "warning"} dot>
              {staff.status === "active" ? "Active" : "Pending"}
            </Badge>
          </DField>
        </div>
      </Section>
    </DrawerShell>
  );
}

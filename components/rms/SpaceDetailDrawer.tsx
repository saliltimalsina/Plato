"use client";

import {
  Drawer, DrawerContent, DrawerHeader, DrawerBody,
  Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from "@heroui/react";
import { Pencil, Trash2, X, MoreHorizontal } from "lucide-react";
import { Space, TABLES, tablesInSpace, spaceCapacity } from "@/components/rms/data/tables";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-[13px] border-b border-warm-200 last:border-b-0">
      <span className="text-[13px] font-semibold text-warm-600">{label}</span>
      <span className="text-[13.5px] font-bold text-ink text-right">{children}</span>
    </div>
  );
}

export function SpaceDetailDrawer({
  space, onClose, onEdit, onDelete,
}: {
  space: Space;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Drawer isOpen onClose={onClose} placement="right" size="md"
      classNames={{ base: "sm:max-w-[480px]", closeButton: "hidden" }}>
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-3 border-b border-warm-200">
          <span className="flex-1 text-[18px] font-extrabold text-ink tracking-[-0.02em] truncate">{space.name}</span>
          <Button size="sm" variant="bordered" radius="md"
            className="h-[34px] border border-[#E6E1DC] bg-white font-semibold text-warm-600 text-[12.5px]"
            startContent={<Pencil size={14} color="#8A7D72" />} onPress={onEdit}>
            Edit
          </Button>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="bordered" radius="md"
                className="w-[34px] h-[34px] min-w-[34px] border border-[#E6E1DC] bg-white">
                <MoreHorizontal size={16} color="#8A7D72" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Space actions">
              <DropdownItem key="del" className="text-[#F15022]" color="danger"
                startContent={<Trash2 size={15} color="#F15022" />} onPress={onDelete}>Move to trash</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button isIconOnly size="sm" variant="bordered" radius="md"
            className="w-[34px] h-[34px] min-w-[34px] border border-[#E6E1DC] bg-white" onPress={onClose}>
            <X size={16} color="#8A7D72" />
          </Button>
        </DrawerHeader>

        <DrawerBody className="px-5 py-5">
          <div className="border border-warm-200 rounded-[14px] px-4">
            <Row label="Space Name">{space.name}</Row>
            <Row label="Total Tables"><span className="tnum">{tablesInSpace(TABLES, space.name).length}</span></Row>
            <Row label="Table Capacity"><span className="tnum">{spaceCapacity(TABLES, space.name)}</span></Row>
            <Row label="Description"><span className="font-medium text-warm-600">{space.description || "—"}</span></Row>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

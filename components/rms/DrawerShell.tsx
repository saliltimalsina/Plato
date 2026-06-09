"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button } from "@heroui/react";
import { X } from "lucide-react";

interface Props {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
}

export function DrawerShell({ header, children, footer, onClose, size = "sm" }: Props) {
  return (
    <Drawer
      isOpen
      onClose={onClose}
      placement="right"
      size={size}
      classNames={{
        base: size === "sm" ? "sm:max-w-[460px]" : undefined,
        closeButton: "hidden",
      }}
    >
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-2 border-b border-warm-200">
          <div className="flex-1 min-w-0 flex items-center gap-2">{header}</div>
          <Button isIconOnly size="sm" variant="bordered" radius="md"
            className="w-[34px] h-[34px] min-w-[34px] border border-[#E6E1DC] bg-white"
            onPress={onClose}>
            <X size={16} color="#8A7D72" />
          </Button>
        </DrawerHeader>
        <DrawerBody className="px-5">{children}</DrawerBody>
        {footer && <DrawerFooter className="border-t border-warm-200 bg-warm-50">{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
}

/* section + definition-list helpers reused by detail views */
export function Section({ title, action, children, first }: { title: string; action?: React.ReactNode; children: React.ReactNode; first?: boolean }) {
  return (
    <div className={first ? "pt-1 pb-[18px]" : "py-[18px] border-t border-warm-200"}>
      <div className="flex items-center justify-between mb-[14px]">
        <span className="text-[11.5px] font-extrabold text-warm-600 uppercase tracking-[0.06em]">{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}

export function DField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.05em] mb-[6px]">{label}</div>
      <div className="text-[14px] font-semibold text-warm-700">{children}</div>
    </div>
  );
}

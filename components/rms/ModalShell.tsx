"use client";

import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,
} from "@heroui/react";
import { Trash2 } from "lucide-react";
import { ORANGE } from "./primitives";

/* compact field styling shared by every create/edit form */
export const labelCx = "text-[12px] font-bold text-warm-600";
export const wrapCx =
  "h-10 min-h-10 border-1 border-[#E6E1DC] bg-white shadow-none rounded-[9px] " +
  "data-[hover=true]:border-[#D8CFC6] group-data-[focus=true]:!border-[#F15022] data-[focus=true]:!border-[#F15022]";
export const inputCx = "text-[13.5px] text-ink placeholder:text-warm-500";

interface ModalShellProps {
  title: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function ModalShell({ title, subtitle, size = "lg", onClose, children, footer }: ModalShellProps) {
  return (
    <Modal
      isOpen
      onClose={onClose}
      size={size}
      scrollBehavior="inside"
      placement="center"
      classNames={{
        base: "rounded-[22px] overflow-hidden max-sm:m-0 max-sm:rounded-b-none max-sm:absolute max-sm:bottom-0 max-sm:max-h-[94%]",
        closeButton: "top-[16px] right-[18px] w-8 h-8 rounded-[9px] border border-[#EFEAE6] bg-white text-warm-500 hover:bg-warm-100",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex-col items-start gap-0 border-b border-warm-200">
          <h2 className="text-[18px] font-extrabold tracking-[-0.02em]">{title}</h2>
          {subtitle && <p className="text-[12.5px] text-warm-500 font-normal mt-[3px]">{subtitle}</p>}
        </ModalHeader>
        <ModalBody className="py-5 gap-[14px]">{children}</ModalBody>
        {footer && <ModalFooter className="border-t border-warm-200 bg-warm-50">{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
}

/* standard cancel + primary footer */
export function ModalFooterButtons({
  onCancel, onConfirm, confirmLabel, disabled,
}: { onCancel: () => void; onConfirm: () => void; confirmLabel: string; disabled?: boolean }) {
  return (
    <>
      <Button variant="bordered" radius="md" className="border border-[#E6E1DC] bg-white font-semibold text-warm-600" onPress={onCancel}>
        Cancel
      </Button>
      <Button
        radius="md"
        isDisabled={disabled}
        className="font-bold disabled:opacity-100"
        style={{
          background: disabled ? "#EFE8E2" : ORANGE,
          color: disabled ? "#B7A99E" : "#fff",
          boxShadow: disabled ? "none" : "0 2px 8px rgba(241,80,34,0.32)",
        }}
        onPress={onConfirm}
      >
        {confirmLabel}
      </Button>
    </>
  );
}

/* delete confirm */
export function DeleteModal({
  label, onClose, onConfirm,
}: { label: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <Modal isOpen onClose={onClose} size="sm" placement="center" classNames={{ base: "rounded-[22px] overflow-hidden" }}>
      <ModalContent>
        <ModalBody className="pt-6">
          <div className="w-[46px] h-[46px] rounded-[12px] bg-[#FDECE4] flex items-center justify-center mb-[14px]">
            <Trash2 size={21} color={ORANGE} />
          </div>
          <h2 className="text-[17px] font-extrabold text-ink tracking-[-0.02em]">Move {label} to trash?</h2>
          <p className="text-[13px] text-warm-500 leading-relaxed mt-[7px]">
            This will be removed from your active list. You can restore it from trash within 30 days.
          </p>
        </ModalBody>
        <ModalFooter>
          <ModalFooterButtons onCancel={onClose} onConfirm={onConfirm} confirmLabel="Move to trash" />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

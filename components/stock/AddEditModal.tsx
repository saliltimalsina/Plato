"use client";

import { useState } from "react";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Input, NumberInput, Select, SelectItem, Button,
} from "@heroui/react";
import { Plus } from "lucide-react";
import {
  ALL_GROUPS, UNITS, GROUP_COLOR, ORANGE, StockItem, Unit,
} from "./data";
import { GroupModal } from "./GroupModal";
import { STOCK_GROUPS, StockGroupRow } from "@/components/rms/data/inventory";

interface Props {
  item: StockItem | null; // null = new
  onClose: () => void;
  onSave: (it: StockItem) => void;
}

interface FormState {
  name: string;
  emoji: string;
  groups: string[];
  unit: Unit;
  opening: number | "";
  closing: number | "";
  rateNum: number | "";
  supplier: string;
}

export function AddEditModal({ item, onClose, onSave }: Props) {
  const editing = !!item;
  const [f, setF] = useState<FormState>(() =>
    item
      ? {
          name: item.name, emoji: item.emoji, groups: [...item.groups],
          unit: item.unit, opening: item.opening, closing: item.closing,
          rateNum: item.rateNum, supplier: item.supplier === "—" ? "" : item.supplier,
        }
      : { name: "", emoji: "🥬", groups: ["Vegetable"], unit: "kg", opening: "", closing: "", rateNum: "", supplier: "" }
  );

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }));
  const toggleGroup = (g: string) =>
    setF((p) => ({ ...p, groups: p.groups.includes(g) ? p.groups.filter((x) => x !== g) : [...p.groups, g] }));
  const valid = f.name.trim().length > 0;

  const [openGroupModal, setOpenGroupModal] = useState(false);
  const onSaveNewGroup = (g: StockGroupRow) => {
    const name = g.name.trim();
    if (!name) return;
    if (!ALL_GROUPS.includes(name)) ALL_GROUPS.push(name);
    GROUP_COLOR[name] = g.color;
    if (!STOCK_GROUPS.some((x) => x.name.toLowerCase() === name.toLowerCase())) {
      const nid = Math.max(0, ...STOCK_GROUPS.map((x) => x.id)) + 1;
      STOCK_GROUPS.push({ id: nid, name, color: g.color, itemCount: 0, description: g.description });
    }
    setF((p) => ({ ...p, groups: p.groups.includes(name) ? p.groups : [...p.groups, name] }));
    setOpenGroupModal(false);
  };

  const submit = () => {
    if (!valid) return;
    const opening = Number(f.opening) || 0;
    const closing = Number(f.closing) || 0;
    const rateNum = Number(f.rateNum) || 0;
    const valueNum = Math.round(closing * rateNum);
    onSave({
      ...(item ?? ({} as StockItem)),
      id: item?.id ?? 0,
      name: f.name.trim(),
      emoji: f.emoji,
      groups: f.groups.length ? f.groups : ["Pantry"],
      unit: f.unit,
      opening,
      closing,
      rateNum,
      rate: "Rs " + rateNum.toLocaleString(),
      valueNum,
      value: "Rs " + valueNum.toLocaleString(),
      supplier: f.supplier.trim() || "—",
    });
  };

  // compact field styling matching the original (38–40px tall, soft border,
  // orange focus instead of HeroUI's default near-black bordered focus)
  const labelCx = "text-[12px] font-bold text-warm-600";
  const wrapCx =
    "h-10 min-h-10 border-1 border-[#E6E1DC] bg-white shadow-none rounded-[9px] " +
    "data-[hover=true]:border-[#D8CFC6] group-data-[focus=true]:!border-[#F15022] data-[focus=true]:!border-[#F15022]";
  const inputCx = "text-[13.5px] text-ink placeholder:text-warm-500";

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="lg"
      scrollBehavior="inside"
      placement="center"
      classNames={{
        base: "rounded-[22px] overflow-hidden max-sm:m-0 max-sm:rounded-b-none max-sm:absolute max-sm:bottom-0 max-sm:max-h-[94%]",
        closeButton: "top-[16px] right-[18px] w-8 h-8 rounded-[9px] border border-[#EFEAE6] bg-white text-warm-500 hover:bg-warm-100",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex-col items-start gap-0 border-b border-warm-200">
          <h2 className="text-[18px] font-extrabold tracking-[-0.02em]">{editing ? "Edit Stock Item" : "Add Stock Item"}</h2>
          <p className="text-[12.5px] text-warm-500 font-normal mt-[3px]">
            {editing ? "Update ingredient details and stock levels." : "Track a new ingredient in your inventory."}
          </p>
        </ModalHeader>
        <ModalBody className="py-5 gap-[14px]">
          <Input
            autoFocus
            size="sm"
            label="Ingredient name"
            labelPlacement="outside"
            placeholder="e.g. Cheddar Cheese"
            value={f.name}
            onValueChange={(v) => set("name", v)}
            classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
            variant="bordered"
          />

          <div>
            <label className="text-[12px] font-bold text-warm-600 block mb-[6px]">Stock group</label>
            <div className="flex flex-wrap gap-[6px]">
              {ALL_GROUPS.map((g) => {
                const on = f.groups.includes(g);
                const c = GROUP_COLOR[g] ?? "#8A7D72";
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGroup(g)}
                    className="inline-flex items-center gap-[5px] px-[11px] py-[5px] rounded-full text-[12.5px] font-semibold"
                    style={{
                      border: on ? `1px solid ${c}` : "1px solid #E6E1DC",
                      background: on ? `${c}14` : "#fff",
                      color: on ? c : "#8A7D72",
                    }}
                  >
                    <span className="w-[6px] h-[6px] rounded-full" style={{ background: on ? c : "#C9BCB0" }} />
                    {g}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setOpenGroupModal(true)}
                className="inline-flex items-center gap-[5px] px-[11px] py-[5px] rounded-full text-[12.5px] font-semibold border border-dashed"
                style={{ borderColor: ORANGE, color: ORANGE, background: "#fff" }}
              >
                <Plus size={13} strokeWidth={2.4} />
                Add Stock Group
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Select
              size="sm"
              label="Unit"
              labelPlacement="outside"
              selectedKeys={new Set([f.unit])}
              onSelectionChange={(k) => set("unit", [...k][0] as Unit)}
              variant="bordered"
              classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
            >
              {UNITS.map((u) => <SelectItem key={u}>{u}</SelectItem>)}
            </Select>
            <NumberInput
              size="sm"
              label="Opening stock"
              labelPlacement="outside"
              placeholder="Optional"
              hideStepper
              minValue={0}
              value={f.opening === "" ? undefined : Number(f.opening)}
              onValueChange={(v) => set("opening", Number.isNaN(v) ? "" : v)}
              variant="bordered"
              classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
            />
            <NumberInput
              size="sm"
              label="Closing stock"
              labelPlacement="outside"
              placeholder="Optional"
              hideStepper
              minValue={0}
              value={f.closing === "" ? undefined : Number(f.closing)}
              onValueChange={(v) => set("closing", Number.isNaN(v) ? "" : v)}
              variant="bordered"
              classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberInput
              size="sm"
              label="Rate (per unit)"
              labelPlacement="outside"
              placeholder="0"
              hideStepper
              minValue={0}
              value={f.rateNum === "" ? undefined : Number(f.rateNum)}
              onValueChange={(v) => set("rateNum", Number.isNaN(v) ? "" : v)}
              startContent={<span className="text-[13.5px] text-warm-500 font-semibold">Rs</span>}
              variant="bordered"
              classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
            />
            <Input
              size="sm"
              label="Supplier"
              labelPlacement="outside"
              placeholder="e.g. Fresh Farms"
              value={f.supplier}
              onValueChange={(v) => set("supplier", v)}
              variant="bordered"
              classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
            />
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-warm-200 bg-warm-50">
          <Button variant="bordered" radius="md" className="border border-[#E6E1DC] bg-white font-semibold text-warm-600" onPress={onClose}>
            Cancel
          </Button>
          <Button
            radius="md"
            isDisabled={!valid}
            className="font-bold disabled:opacity-100"
            style={{
              background: valid ? ORANGE : "#EFE8E2",
              color: valid ? "#fff" : "#B7A99E",
              boxShadow: valid ? "0 2px 8px rgba(241,80,34,0.32)" : "none",
            }}
            onPress={submit}
          >
            {editing ? "Save changes" : "Add item"}
          </Button>
        </ModalFooter>
      </ModalContent>
      {openGroupModal && (
        <GroupModal group={null} onClose={() => setOpenGroupModal(false)} onSave={onSaveNewGroup} />
      )}
    </Modal>
  );
}

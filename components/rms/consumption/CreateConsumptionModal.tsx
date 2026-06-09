"use client";

import { useState } from "react";
import { Input, NumberInput, Select, SelectItem, Textarea } from "@heroui/react";
import { ModalShell, ModalFooterButtons, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import {
  CONSUMPTION_TYPES, type Consumption, type ConsumptionType,
} from "@/components/rms/data/consumption";

interface Props {
  onClose: () => void;
  onSave: (it: Consumption) => void;
}

interface FormState {
  finishedGood: string;
  type: ConsumptionType;
  salesPrice: number | "";
  cost: number | "";
  itemUsed: string;
}

export function CreateConsumptionModal({ onClose, onSave }: Props) {
  const [f, setF] = useState<FormState>({
    finishedGood: "", type: "Dish", salesPrice: "", cost: "", itemUsed: "",
  });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }));
  const valid = f.finishedGood.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    const salesPriceNum = Number(f.salesPrice) || 0;
    const costNum = Number(f.cost) || 0;
    onSave({
      id: 0,
      finishedGood: f.finishedGood.trim(),
      type: f.type,
      salesPrice: "Rs " + salesPriceNum.toLocaleString(),
      salesPriceNum,
      cost: "Rs " + costNum.toLocaleString(),
      costNum,
      itemUsed: f.itemUsed.trim(),
      stocksUsed: [],
    });
  };

  const footer = (
    <ModalFooterButtons onCancel={onClose} onConfirm={submit} confirmLabel="Add consumption" disabled={!valid} />
  );

  return (
    <ModalShell title="Add Consumption" subtitle="Record a finished good and the stock it uses." onClose={onClose} footer={footer}>
      <Input
        autoFocus
        size="sm"
        label="Finished Good"
        labelPlacement="outside"
        placeholder="e.g. Chicken Burger"
        value={f.finishedGood}
        onValueChange={(v) => set("finishedGood", v)}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
      />

      <Select
        size="sm"
        label="Type"
        labelPlacement="outside"
        selectedKeys={new Set([f.type])}
        onSelectionChange={(k) => set("type", [...k][0] as ConsumptionType)}
        variant="bordered"
        classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
      >
        {CONSUMPTION_TYPES.map((t) => <SelectItem key={t}>{t}</SelectItem>)}
      </Select>

      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          size="sm"
          label="Sales Price"
          labelPlacement="outside"
          placeholder="0"
          hideStepper
          minValue={0}
          value={f.salesPrice === "" ? undefined : Number(f.salesPrice)}
          onValueChange={(v) => set("salesPrice", Number.isNaN(v) ? "" : v)}
          startContent={<span className="text-[13.5px] text-warm-500 font-semibold">Rs</span>}
          variant="bordered"
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
        <NumberInput
          size="sm"
          label="Cost"
          labelPlacement="outside"
          placeholder="0"
          hideStepper
          minValue={0}
          value={f.cost === "" ? undefined : Number(f.cost)}
          onValueChange={(v) => set("cost", Number.isNaN(v) ? "" : v)}
          startContent={<span className="text-[13.5px] text-warm-500 font-semibold">Rs</span>}
          variant="bordered"
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
      </div>

      <Textarea
        size="sm"
        label="Item Used"
        labelPlacement="outside"
        placeholder="e.g. Lettuce (2.00kg)"
        minRows={2}
        value={f.itemUsed}
        onValueChange={(v) => set("itemUsed", v)}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
      />
    </ModalShell>
  );
}

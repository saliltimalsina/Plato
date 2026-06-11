"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@heroui/react";
import { Check, Shuffle } from "lucide-react";
import { ModalShell, ModalFooterButtons, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { GROUP_COLORS, StockGroupRow } from "@/components/rms/data/inventory";

export const PALETTE = Array.from(new Set([
  ...GROUP_COLORS,
  "#F15022", "#0EA5E9", "#16A34A", "#9B51E0", "#E5484D",
  "#A16207", "#1FA98B", "#F59E0B", "#EC4899", "#6366F1", "#14B8A6",
]));

const HEX_RE = /^#([0-9A-Fa-f]{6})$/;
export const isHex = (s: string) => HEX_RE.test(s);
export const randColor = () => PALETTE[Math.floor(Math.random() * PALETTE.length)];

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;

export function GroupModal({
  group, onClose, onSave,
}: {
  group: StockGroupRow | null;
  onClose: () => void;
  onSave: (g: StockGroupRow) => void;
}) {
  const [name, setName] = useState(group?.name ?? "");
  const [description, setDescription] = useState(group?.description ?? "");
  const [color, setColor] = useState(group?.color ?? randColor());
  const [customHex, setCustomHex] = useState(
    group && !PALETTE.includes(group.color) ? group.color.replace("#", "") : "",
  );

  const valid = name.trim().length > 0 && isHex(color);
  const submit = () =>
    onSave({
      id: group?.id ?? 0,
      name: name.trim(),
      color,
      itemCount: group?.itemCount ?? 0,
      description: description.trim(),
    });
  const reset = () => {
    setName(group?.name ?? "");
    setDescription(group?.description ?? "");
    setColor(group?.color ?? randColor());
    setCustomHex("");
  };
  const applyCustom = (hex: string) => {
    setCustomHex(hex);
    const candidate = `#${hex}`;
    if (isHex(candidate)) setColor(candidate.toUpperCase());
  };

  return (
    <ModalShell
      title={group ? "Edit Stock Group" : "Create Stock Group"}
      size="lg"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={reset}>
            Reset
          </Button>
          <ModalFooterButtons
            onCancel={onClose}
            onConfirm={submit}
            confirmLabel={group ? "Save changes" : "Save Group"}
            disabled={!valid}
          />
        </div>
      }
    >
      <Input
        autoFocus
        label={<>Group Name<Req /></>}
        labelPlacement="outside"
        placeholder="Enter group name"
        size="sm"
        variant="bordered"
        value={name}
        onValueChange={setName}
        startContent={<span className="w-[10px] h-[10px] rounded-full flex-shrink-0" style={{ background: color }} />}
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={labelCx}>Color<Req /></span>
          <Button
            size="sm" variant="light" radius="md"
            className="h-7 text-[12px] font-semibold text-warm-600"
            startContent={<Shuffle size={13} color="#6B5F55" />}
            onPress={() => { const c = randColor(); setColor(c); setCustomHex(""); }}
          >
            Randomize
          </Button>
        </div>
        <div className="flex flex-wrap gap-[10px]">
          {PALETTE.map((c) => {
            const on = c.toUpperCase() === color.toUpperCase();
            return (
              <button
                key={c} type="button"
                onClick={() => { setColor(c); setCustomHex(""); }}
                className="w-8 h-8 rounded-[10px] flex items-center justify-center transition-transform active:scale-95"
                style={{
                  background: c,
                  border: on ? "2px solid #fff" : "2px solid transparent",
                  boxShadow: on ? `0 0 0 2px ${c}` : "none",
                }}
                aria-label={c}
              >
                {on && <Check size={16} color="#fff" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-9 h-9 rounded-[9px] flex-shrink-0 border border-warm-200"
            style={{ background: isHex(`#${customHex}`) ? `#${customHex}` : "#fff" }} />
          <Input
            size="sm" aria-label="Custom hex" placeholder="Custom hex e.g. F15022"
            value={customHex} onValueChange={applyCustom}
            startContent={<span className="text-[12px] text-warm-500 font-semibold">#</span>}
            variant="bordered"
            classNames={{ base: "flex-1", inputWrapper: wrapCx, input: `${inputCx} font-mono uppercase` }}
            maxLength={6}
          />
        </div>
      </div>

      <Textarea
        label="Description" labelPlacement="outside"
        placeholder="Enter description"
        minRows={3} maxLength={240}
        value={description} onValueChange={setDescription}
        variant="bordered"
        classNames={{ label: labelCx, inputWrapper: `${wrapCx} h-auto min-h-[88px]`, input: inputCx }}
      />
    </ModalShell>
  );
}

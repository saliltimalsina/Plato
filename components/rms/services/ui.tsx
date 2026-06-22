"use client";

import { Select, SelectItem, Switch } from "@heroui/react";
import { labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";

/* section heading e.g. "Status and Menu set", "Others" */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[15px] font-extrabold text-ink tracking-[-0.01em]">{children}</h2>;
}

/* white outer card */
export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#EEEAE6] rounded-2xl p-5 ${className}`}
      style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
      {children}
    </div>
  );
}

/* green-when-on switch (matches reference) */
export function GreenSwitch({ value, onChange, ariaLabel }: { value: boolean; onChange: (v: boolean) => void; ariaLabel: string }) {
  return (
    <Switch isSelected={value} onValueChange={onChange} size="sm"
      classNames={{ wrapper: "group-data-[selected=true]:bg-[#15803D]" }} aria-label={ariaLabel} />
  );
}

/* a single bordered toggle setting card */
export function ToggleSetting({
  title, description, value, onChange,
}: { title: string; description?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="border border-[#EEEAE6] rounded-[14px] p-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="text-[14px] font-bold text-ink">{title}</div>
        {description && <div className="text-[13px] text-warm-500 mt-[3px] leading-relaxed">{description}</div>}
      </div>
      <GreenSwitch value={value} onChange={onChange} ariaLabel={title} />
    </div>
  );
}

/* Active Menu Set style select */
export function MenuSetSelect({
  label = "Active Menu Set", value, onChange, options,
}: { label?: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <span className={labelCx}>{label}</span>
      <Select aria-label={label} placeholder="Select Menu Set"
        selectedKeys={value ? [value] : []}
        onSelectionChange={(k) => onChange((Array.from(k)[0] as string) ?? "")}
        size="sm" variant="bordered" radius="md"
        classNames={{ trigger: wrapCx, value: inputCx }}>
        {options.map((o) => <SelectItem key={o}>{o}</SelectItem>)}
      </Select>
    </div>
  );
}

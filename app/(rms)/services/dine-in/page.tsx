"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { CalendarDays, ChevronRight } from "lucide-react";
import { PageHeader, ORANGE } from "@/components/rms/primitives";
import { SectionLabel, Panel, ToggleSetting, GreenSwitch, MenuSetSelect } from "@/components/rms/services/ui";
import { ACTIVE_MENUSETS, DINE_IN_OTHERS } from "@/components/rms/data/services";

export default function DineInPage() {
  const [status, setStatus] = useState(true);
  const [menuSet, setMenuSet] = useState(ACTIVE_MENUSETS[0]);
  const [others, setOthers] = useState<Record<string, boolean>>(
    () => Object.fromEntries(DINE_IN_OTHERS.map((t) => [t.key, t.default])),
  );

  return (
    <>
      <PageHeader title="Dine In Service" />

      <SectionLabel>Status and Menu set</SectionLabel>
      <Panel className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[14px] font-bold text-ink">Status</div>
          <div className="text-[13px] text-warm-500 mt-[3px]">This means you are serving dine in service in your restaurant or not.</div>
        </div>
        <GreenSwitch value={status} onChange={setStatus} ariaLabel="Dine in status" />
      </Panel>

      <Panel>
        <MenuSetSelect value={menuSet} onChange={setMenuSet} options={ACTIVE_MENUSETS} />
      </Panel>

      <Panel className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="text-[14px] font-bold text-ink">Menuset Schedule</div>
            <div className="text-[13px] text-warm-500 mt-[3px]">Schedule active menuset according to time and day.</div>
          </div>
          <Button size="sm" radius="md" className="h-9 text-white font-bold"
            style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
            startContent={<CalendarDays size={15} color="#fff" />}>
            Schedule Menuset
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13.5px] font-extrabold text-ink">Schedules</span>
          <Button size="sm" variant="bordered" radius="md"
            className="h-8 border border-[#E6E1DC] bg-white font-semibold text-warm-600 text-[12.5px]"
            endContent={<ChevronRight size={14} color="#8A7D72" />}>View All</Button>
        </div>
        <div className="border border-warm-200 rounded-[12px] overflow-hidden">
          <div className="grid bg-cream border-b border-warm-200 px-4 py-[10px] text-[11px] font-bold text-warm-600 uppercase tracking-[0.04em]"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 80px" }}>
            <span>Menu Set</span><span>Day</span><span>Start Time</span><span>End Time</span><span className="text-right">Actions</span>
          </div>
          <div className="py-8 text-center text-[13px] text-warm-500">No schedules</div>
        </div>
      </Panel>

      <SectionLabel>Others</SectionLabel>
      <div className="flex flex-col gap-3">
        {DINE_IN_OTHERS.map((t) => (
          <ToggleSetting key={t.key} title={t.title} description={t.description}
            value={others[t.key]} onChange={(v) => setOthers((p) => ({ ...p, [t.key]: v }))} />
        ))}
      </div>
    </>
  );
}

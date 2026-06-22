"use client";

import { useState } from "react";
import { Select, SelectItem } from "@heroui/react";
import { LayoutGrid, List } from "lucide-react";
import { PageHeader, ORANGE } from "@/components/rms/primitives";
import { Panel, GreenSwitch, MenuSetSelect } from "@/components/rms/services/ui";
import { labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { ACTIVE_MENUSETS } from "@/components/rms/data/services";

export default function SettingPage() {
  const [dishView, setDishView] = useState<"grid" | "list">("grid");
  const [takeAway, setTakeAway] = useState({ status: true, menu: ACTIVE_MENUSETS[0] });
  const [pickUp, setPickUp] = useState({ status: true, menu: ACTIVE_MENUSETS[0] });
  const [reservation, setReservation] = useState({ status: true, menu: ACTIVE_MENUSETS[0] });

  return (
    <>
      <PageHeader title="Settings" />

      <Panel className="flex flex-col gap-4">
        <h2 className="text-[15px] font-extrabold text-ink">Digital Menu Layout</h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[14px] font-bold text-ink">Dish View</div>
            <div className="text-[13px] text-warm-500 mt-[2px]">Set default dish view, grid or list.</div>
          </div>
          <div className="inline-flex rounded-[10px] border border-[#E6E1DC] overflow-hidden">
            <SegBtn active={dishView === "grid"} onClick={() => setDishView("grid")} icon={LayoutGrid} label="Grid" />
            <SegBtn active={dishView === "list"} onClick={() => setDishView("list")} icon={List} label="List" />
          </div>
        </div>
      </Panel>

      <ServiceModeCard title="Take Away" hint="Allow customers to place takeaway orders."
        state={takeAway} setState={setTakeAway} />
      <ServiceModeCard title="Pick Up" hint="Allow customers to place pickup orders."
        state={pickUp} setState={setPickUp} />

      <Panel className="flex flex-col gap-5">
        <h2 className="text-[15px] font-extrabold text-ink">Reservation</h2>
        <div className="flex items-start justify-between gap-4">
          <div><div className="text-[14px] font-bold text-ink">Status</div>
            <div className="text-[13px] text-warm-500 mt-[2px]">Accept reservation requests during the specified hours.</div></div>
          <GreenSwitch value={reservation.status} onChange={(v) => setReservation((p) => ({ ...p, status: v }))} ariaLabel="Reservation status" />
        </div>
        <MenuSetSelect value={reservation.menu} onChange={(v) => setReservation((p) => ({ ...p, menu: v }))} options={ACTIVE_MENUSETS} />
        <div>
          <h3 className="text-[14px] font-extrabold text-ink mb-3">Reservation Time</h3>
          <div className="flex items-end gap-6 flex-wrap">
            <TimePicker label="Start Time" h="12" m="00" ap="AM" />
            <TimePicker label="End Time" h="11" m="59" ap="PM" />
          </div>
        </div>
      </Panel>
    </>
  );
}

function SegBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof LayoutGrid; label: string }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-bold transition-colors"
      style={{ background: active ? ORANGE : "#fff", color: active ? "#fff" : "#6B5F55" }}>
      <Icon size={15} color={active ? "#fff" : "#6B5F55"} /> {label}
    </button>
  );
}

interface ModeState { status: boolean; menu: string }
function ServiceModeCard({ title, hint, state, setState }: { title: string; hint: string; state: ModeState; setState: (f: (p: ModeState) => ModeState) => void }) {
  return (
    <Panel className="flex flex-col gap-5">
      <h2 className="text-[15px] font-extrabold text-ink">{title}</h2>
      <div className="flex items-start justify-between gap-4">
        <div><div className="text-[14px] font-bold text-ink">Status</div>
          <div className="text-[13px] text-warm-500 mt-[2px]">{hint}</div></div>
        <GreenSwitch value={state.status} onChange={(v) => setState((p) => ({ ...p, status: v }))} ariaLabel={`${title} status`} />
      </div>
      <MenuSetSelect value={state.menu} onChange={(v) => setState((p) => ({ ...p, menu: v }))} options={ACTIVE_MENUSETS} />
    </Panel>
  );
}

function TimePicker({ label, h, m, ap }: { label: string; h: string; m: string; ap: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className={labelCx}>{label}</span>
      <div className="flex items-center gap-2">
        <span className="w-[54px] h-10 rounded-[9px] border border-[#E6E1DC] bg-white inline-flex items-center justify-center text-[15px] font-bold tnum text-ink">{h}</span>
        <span className="text-warm-400 font-bold">:</span>
        <span className="w-[54px] h-10 rounded-[9px] border border-[#E6E1DC] bg-white inline-flex items-center justify-center text-[15px] font-bold tnum text-ink">{m}</span>
        <Select aria-label={`${label} AM/PM`} size="sm" variant="bordered" radius="md" defaultSelectedKeys={[ap]}
          classNames={{ base: "w-[88px]", trigger: wrapCx, value: inputCx }}>
          {["AM", "PM"].map((x) => <SelectItem key={x}>{x}</SelectItem>)}
        </Select>
      </div>
    </div>
  );
}

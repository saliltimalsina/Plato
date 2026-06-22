"use client";

import { useState } from "react";
import { Button, Tabs, Tab } from "@heroui/react";
import { Copy, Download, Printer, Pencil, Plus, Bike, CheckSquare, Square } from "lucide-react";
import { PageHeader, ORANGE, Badge } from "@/components/rms/primitives";
import { SectionLabel, Panel, ToggleSetting, GreenSwitch, MenuSetSelect } from "@/components/rms/services/ui";
import { FakeQR } from "@/components/rms/FakeQR";
import {
  ACTIVE_MENUSETS, DELIVERY_OTHERS, DAYS, DELIVERY_PARTNERS, RIDERS,
} from "@/components/rms/data/services";

export default function DeliveryPage() {
  const [tab, setTab] = useState<"details" | "hours" | "partners">("details");

  return (
    <>
      <PageHeader title="Delivery Service" />
      <Tabs size="sm" radius="md" selectedKey={tab} onSelectionChange={(k) => setTab(k as typeof tab)}
        classNames={{ base: "self-start", tabList: "bg-[#F6EFE8]", cursor: "bg-white shadow-sm", tabContent: "font-bold text-[12.5px]" }}>
        <Tab key="details" title="Delivery Details" />
        <Tab key="hours" title="Opening Hour" />
        <Tab key="partners" title="Delivery Partners" />
      </Tabs>

      {tab === "details" && <DetailsTab />}
      {tab === "hours" && <HoursTab />}
      {tab === "partners" && <PartnersTab />}
    </>
  );
}

function DetailsTab() {
  const [status, setStatus] = useState(true);
  const [menuSet, setMenuSet] = useState(ACTIVE_MENUSETS[0]);
  const [others, setOthers] = useState<Record<string, boolean>>(
    () => Object.fromEntries(DELIVERY_OTHERS.map((t) => [t.key, t.default])),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">
      <div className="flex flex-col gap-4">
        <SectionLabel>Status and Menu Set</SectionLabel>
        <Panel className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[14px] font-bold text-ink">Status</div>
            <div className="text-[13px] text-warm-500 mt-[3px]">This means you are serving delivery service in your restaurant or not.</div>
          </div>
          <GreenSwitch value={status} onChange={setStatus} ariaLabel="Delivery status" />
        </Panel>
        <Panel><MenuSetSelect value={menuSet} onChange={setMenuSet} options={ACTIVE_MENUSETS} /></Panel>

        <SectionLabel>Others</SectionLabel>
        <div className="flex flex-col gap-3">
          {DELIVERY_OTHERS.map((t) => (
            <ToggleSetting key={t.key} title={t.title} description={t.description}
              value={others[t.key]} onChange={(v) => setOthers((p) => ({ ...p, [t.key]: v }))} />
          ))}
        </div>
      </div>

      {/* right rail */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-4">
        <Panel className="flex flex-col items-center gap-3">
          <span className="self-start text-[13.5px] font-extrabold text-ink">Share Delivery Menu</span>
          <FakeQR seed="https://rwar.plato.app/delivery" size={200} />
          <span className="text-[16px] font-extrabold text-ink">Delivery Menu</span>
          <div className="w-full flex items-center gap-2 border border-dashed rounded-[10px] px-3 py-[7px]" style={{ borderColor: "#F8C9B6" }}>
            <span className="flex-1 min-w-0 text-[12.5px] font-semibold truncate" style={{ color: ORANGE }}>rwar.plato.app/delivery/~</span>
            <button className="text-warm-500 hover:text-ink"><Copy size={14} color={ORANGE} /></button>
            <button className="text-warm-500 hover:text-ink"><Download size={14} color={ORANGE} /></button>
            <button className="text-warm-500 hover:text-ink"><Printer size={14} color={ORANGE} /></button>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13.5px] font-extrabold text-ink">Charges</span>
            <button><Pencil size={14} color="#8A7D72" /></button>
          </div>
          <ChargeRow label="Fixed Delivery Charge" hint="Delivery charge of Rs 0 will be added in the bill." value="Rs 0" />
          <ChargeRow label="Free Delivery Above" hint="Home delivery will be free for orders above Rs 0." value="Rs 0" />
          <ChargeRow label="Minimum Cart Value for Delivery" hint="Minimum cart value for delivery should be Rs 0." value="Rs 0" last />
        </Panel>

        <Panel>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13.5px] font-extrabold text-ink">Information Shown in Menu</span>
            <button><Pencil size={14} color="#8A7D72" /></button>
          </div>
          <div className="flex flex-col gap-2 text-[13px]">
            <InfoRow label="Name" value="Rwar" />
            <InfoRow label="Phone" value="+977 9840171882" />
            <InfoRow label="Address" value="imadol grish" />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function ChargeRow({ label, hint, value, last }: { label: string; hint: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-start justify-between gap-3 py-[10px] ${last ? "" : "border-b border-warm-200"}`}>
      <div className="min-w-0">
        <div className="text-[13.5px] font-bold text-ink">{label}</div>
        <div className="text-[12px] text-warm-500 mt-[2px]">{hint}</div>
      </div>
      <span className="text-[13.5px] font-extrabold text-ink tnum whitespace-nowrap">{value}</span>
    </div>
  );
}
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-warm-500 w-[70px]">{label}</span>
      <span className="text-warm-400">:</span>
      <span className="font-bold text-ink">{value}</span>
    </div>
  );
}

function HoursTab() {
  const [hours, setHours] = useState<Record<string, "closed" | "24hr">>(
    () => Object.fromEntries(DAYS.map((d) => [d, "24hr" as const])),
  );
  return (
    <div className="flex flex-col gap-4">
      <SectionLabel>Delivery Time</SectionLabel>
      <div className="flex flex-col gap-3">
        {DAYS.map((d) => {
          const v = hours[d];
          return (
            <Panel key={d} className="flex items-center justify-between gap-3">
              <span className="text-[15px] font-extrabold text-ink">{d}</span>
              <div className="flex items-center gap-2">
                <CheckPill label="Closed" tone="red" active={v === "closed"} onClick={() => setHours((p) => ({ ...p, [d]: "closed" }))} />
                <CheckPill label="24hr open" tone="green" active={v === "24hr"} onClick={() => setHours((p) => ({ ...p, [d]: "24hr" }))} />
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

function CheckPill({ label, tone, active, onClick }: { label: string; tone: "red" | "green"; active: boolean; onClick: () => void }) {
  const c = tone === "red" ? { fg: "#DC2626", bg: "#FEF2F2" } : { fg: "#15803D", bg: "#F0FDF4" };
  const Icon = active ? CheckSquare : Square;
  return (
    <button onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-[7px] rounded-[9px] text-[13px] font-semibold transition-colors"
      style={{ background: active ? c.bg : "#fff", border: `1px solid ${active ? c.fg + "55" : "#E6E1DC"}`, color: c.fg }}>
      <Icon size={15} color={c.fg} /> {label}
    </button>
  );
}

function PartnersTab() {
  const [partners, setPartners] = useState(DELIVERY_PARTNERS);
  const toggle = (id: number) => setPartners((p) => p.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SectionLabel>Platform</SectionLabel>
          <span className="text-[12px] font-bold text-warm-500 bg-warm-100 rounded-full w-5 h-5 flex items-center justify-center">{partners.length}</span>
        </div>
        <Button size="sm" radius="md" className="h-9 text-white font-bold" style={{ background: "#15803D" }}
          startContent={<Plus size={15} color="#fff" strokeWidth={2.4} />}>Add Delivery Platform</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {partners.map((p) => (
          <Panel key={p.id} className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <span className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center text-white text-[15px] font-extrabold" style={{ background: p.color }}>{p.abbr}</span>
              {!p.locked && <GreenSwitch value={p.active} onChange={() => toggle(p.id)} ariaLabel={p.name} />}
            </div>
            <div className="text-[16px] font-extrabold text-ink">{p.name}</div>
            <div className="flex items-center justify-between border-t border-warm-200 pt-3">
              <span className="text-[13px] text-warm-600">Commission</span>
              <span className="text-[14px] font-extrabold tnum" style={{ color: ORANGE }}>{p.commission}%</span>
            </div>
          </Panel>
        ))}
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <SectionLabel>Riders</SectionLabel>
          <span className="text-[12px] font-bold text-warm-500 bg-warm-100 rounded-full w-5 h-5 flex items-center justify-center">{RIDERS.length}</span>
        </div>
        <Button size="sm" radius="md" className="h-9 text-white font-bold" style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
          startContent={<Bike size={15} color="#fff" />}>Add Rider</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RIDERS.map((r) => (
          <Panel key={r.id} className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-[12px] bg-warm-100 flex items-center justify-center"><Bike size={18} color="#6B5F55" /></span>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-bold text-ink truncate">{r.name}</div>
              <div className="text-[12.5px] text-warm-500">{r.phone}</div>
            </div>
            <Badge tone="success">{r.role}</Badge>
          </Panel>
        ))}
      </div>
    </div>
  );
}

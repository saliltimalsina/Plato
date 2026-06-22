"use client";

import { useMemo, useState } from "react";
import {
  Button, Input, Textarea, Tabs, Tab,
} from "@heroui/react";
import {
  Send, Wallet, MessageSquare, MessagesSquare, Receipt, Search, Upload, UsersRound, Info, X,
} from "lucide-react";
import { PageHeader, ORANGE } from "@/components/rms/primitives";
import { GreenSwitch } from "@/components/rms/services/ui";
import { ModalShell, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { SMS_EVENTS } from "@/components/rms/data/services";

const SMS_RATE = 1.5;

function StatCard({ icon: Icon, tint, accent, label, value }: { icon: typeof Wallet; tint: string; accent: string; label: string; value: string }) {
  return (
    <div className="flex-1 min-w-0 bg-white border border-[#EEEAE6] rounded-2xl p-4 px-[18px]" style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
      <div className="flex items-center gap-[9px]">
        <span className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center" style={{ background: tint }}><Icon size={16} color={accent} /></span>
        <span className="text-[12.5px] font-semibold text-[#8A8079]">{label}</span>
      </div>
      <div className="text-[24px] font-bold text-ink tracking-[-0.02em] tnum mt-2">{value}</div>
    </div>
  );
}

export default function SmsPage() {
  const [tab, setTab] = useState<"logs" | "events" | "history">("logs");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [events, setEvents] = useState(SMS_EVENTS);

  return (
    <>
      <PageHeader title="SMS" actions={
        <Button size="sm" radius="md" className="h-9 text-white font-bold" style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
          startContent={<Send size={15} color="#fff" />} onPress={() => setBulkOpen(true)}>Send Bulk SMS</Button>
      } />

      {/* stats + promo */}
      <div className="grid grid-cols-1 lg:grid-cols-[repeat(4,1fr)_1.4fr] gap-[14px]">
        <StatCard icon={Wallet} tint="#EDE9FE" accent="#6D28D9" label="Available Balance" value="Rs 10" />
        <StatCard icon={MessageSquare} tint="#FEF3E2" accent="#F59E0B" label="Today's SMS" value="0" />
        <StatCard icon={MessagesSquare} tint="#FDECE4" accent={ORANGE} label="Yesterday's SMS" value="0" />
        <StatCard icon={Receipt} tint="#E3F6F1" accent="#1FA98B" label="Total Transactions" value="Rs 0" />
        <div className="bg-white border border-[#EEEAE6] rounded-2xl p-4 flex flex-col gap-3" style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
          <span className="text-[13px] font-semibold text-warm-600">Keep your customer communication active, instant &amp; professional.</span>
          <Button radius="md" className="h-10 font-bold text-white" style={{ background: "linear-gradient(90deg,#3F2A8C,#D8420F)" }}>Load SMS</Button>
        </div>
      </div>

      <Tabs size="sm" radius="md" selectedKey={tab} onSelectionChange={(k) => setTab(k as typeof tab)}
        classNames={{ base: "self-start", tabList: "bg-[#F6EFE8]", cursor: "bg-white shadow-sm", tabContent: "font-bold text-[12.5px]" }}>
        <Tab key="logs" title="SMS Logs" />
        <Tab key="events" title="Events" />
        <Tab key="history" title="Purchase History" />
      </Tabs>

      {tab === "logs" && (
        <EmptyTable
          columns={["SN", "Mobile Number", "Name", "Carrier", "Message", "Rate", "Event", "SMS Type", "Status", "Sent At"]}
          title="No SMS logs found" hint="No SMS logs found." />
      )}
      {tab === "events" && (
        <div className="bg-white border border-[#EEEAE6] rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
          <div className="grid bg-cream border-b border-warm-200 px-4 py-[10px] text-[11px] font-bold text-warm-600 uppercase tracking-[0.04em]"
            style={{ gridTemplateColumns: "50px 1.4fr 90px 2fr 2fr 130px" }}>
            <span>SN</span><span>Event</span><span>Status</span><span>Description</span><span>Message</span><span className="text-right">SMS Consumption</span>
          </div>
          {events.map((e, i) => (
            <div key={e.id} className="grid items-center px-4 py-3 border-t border-warm-200 text-[13px]"
              style={{ gridTemplateColumns: "50px 1.4fr 90px 2fr 2fr 130px" }}>
              <span className="font-mono text-warm-500">{i + 1}</span>
              <span className="font-semibold text-ink">{e.event}</span>
              <GreenSwitch value={e.status} onChange={(v) => setEvents((p) => p.map((x) => x.id === e.id ? { ...x, status: v } : x))} ariaLabel={e.event} />
              <span className="text-warm-600">{e.description}</span>
              <span className="text-warm-600 truncate">{e.message}</span>
              <span className="text-right tnum font-bold text-ink">{e.consumption}</span>
            </div>
          ))}
        </div>
      )}
      {tab === "history" && (
        <EmptyTable columns={["SN", "User", "Amount", "Payment Method", "Purchase At"]}
          title="No SMS Purchase History found" hint="No SMS purchase history found." />
      )}

      {bulkOpen && <SendBulkModal onClose={() => setBulkOpen(false)} />}
    </>
  );
}

function EmptyTable({ columns, title, hint }: { columns: string[]; title: string; hint: string }) {
  return (
    <div className="bg-white border border-[#EEEAE6] rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
      <div className="flex gap-4 bg-cream border-b border-warm-200 px-4 py-[10px] text-[11px] font-bold text-warm-600 uppercase tracking-[0.04em] overflow-x-auto no-sb">
        {columns.map((c) => <span key={c} className="whitespace-nowrap">{c}</span>)}
      </div>
      <div className="py-[70px] text-center">
        <div className="w-[60px] h-[60px] rounded-full bg-warm-100 inline-flex items-center justify-center mb-3"><Search size={24} color="#C9BCB0" /></div>
        <div className="text-[15px] font-extrabold text-ink">{title}</div>
        <div className="text-[13px] text-warm-500 mt-1">{hint}</div>
      </div>
    </div>
  );
}

function SendBulkModal({ onClose }: { onClose: () => void }) {
  const [contacts, setContacts] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("");

  const addContact = () => {
    const v = draft.trim();
    if (v && !contacts.includes(v)) setContacts((p) => [...p, v]);
    setDraft("");
  };
  const total = useMemo(() => contacts.length * SMS_RATE * Math.max(1, Math.ceil(message.length / 160)), [contacts, message]);
  const valid = contacts.length > 0 && message.trim().length > 0;

  return (
    <ModalShell title="Send Bulk SMS" size="2xl" onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={() => { setContacts([]); setMessage(""); }}>Reset</Button>
          <Button radius="md" isDisabled={!valid} className="font-bold disabled:opacity-100"
            style={{ background: valid ? ORANGE : "#EFE8E2", color: valid ? "#fff" : "#B7A99E", boxShadow: valid ? "0 2px 8px rgba(241,80,34,0.32)" : "none" }}
            startContent={<Send size={15} color={valid ? "#fff" : "#B7A99E"} />}>Send</Button>
        </div>
      }>
      <div className="flex flex-col gap-2">
        <span className={labelCx}>Contacts<span className="text-[#F15022] ml-[2px]">*</span></span>
        <div className="border border-[#E6E1DC] rounded-[9px] bg-white px-2 py-2 flex flex-wrap gap-2 min-h-10">
          {contacts.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-warm-100 text-[12.5px] font-semibold text-warm-700">
              {c}<button onClick={() => setContacts((p) => p.filter((x) => x !== c))}><X size={12} color="#8A7D72" /></button>
            </span>
          ))}
          <input value={draft} onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addContact(); } }}
            placeholder="Type and press Enter…" className="flex-1 min-w-[140px] outline-none text-[13.5px] bg-transparent" />
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="bordered" radius="md" className="h-9 border border-[#E6E1DC] bg-warm-50 font-semibold text-warm-700"
            startContent={<Upload size={14} color="#6B5F55" />}>Import From Excel</Button>
          <Button size="sm" variant="bordered" radius="md" className="h-9 border border-[#E6E1DC] bg-warm-50 font-semibold text-warm-700"
            startContent={<UsersRound size={14} color="#6B5F55" />}>Import from Customer</Button>
        </div>
      </div>

      <Textarea label={<>Message<span className="text-[#F15022] ml-[2px]">*</span></>} labelPlacement="outside" placeholder="Enter Message"
        minRows={4} value={message} onValueChange={setMessage} variant="bordered"
        classNames={{ label: labelCx, inputWrapper: `${wrapCx} h-auto min-h-[100px]`, input: inputCx }} />

      <div className="rounded-[12px] border border-[#BFDBFE] bg-[#EFF6FF] p-4">
        <div className="flex items-center gap-2 mb-2"><Info size={15} color="#2563EB" /><span className="text-[13.5px] font-extrabold text-[#2563EB]">Cost Breakdown</span></div>
        <div className="flex flex-col gap-1 text-[13px] text-[#2563EB]">
          <Line label="Characters" value={String(message.length)} />
          <Line label="Contacts" value={String(contacts.length)} />
          <Line label={`Length (${message.length}/160)`} value={String(Math.max(0, Math.ceil(message.length / 160)))} />
          <Line label="Rate" value={SMS_RATE.toFixed(2)} />
        </div>
        <div className="border-t border-[#BFDBFE] mt-2 pt-2 flex items-center justify-between">
          <span className="text-[13.5px] font-extrabold text-ink">Total Cost</span>
          <span className="text-[14px] font-extrabold tnum" style={{ color: ORANGE }}>Rs {total.toFixed(2)}</span>
        </div>
      </div>
    </ModalShell>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between"><span>{label}</span><span className="tnum">{value}</span></div>;
}

"use client";

import { useState } from "react";
import { Button, Tabs, Tab } from "@heroui/react";
import { SlidersHorizontal, UsersRound, Bike } from "lucide-react";
import { PageHeader, ORANGE } from "@/components/rms/primitives";

const ORDER_NOTIFS = [
  { id: 1, title: "Order updated", body: <><b className="text-ink">Salil Timalsina</b> has changed status from Pending to Billed for Table order <b className="text-ink">Cabin 1</b>.</>, time: "04:56 PM / 06-22-2026", kot: false },
  { id: 2, title: "Order created", body: <><b className="text-ink">Salil Timalsina</b> created Table order for <b className="text-ink">Cabin 1</b>.</>, time: "04:56 PM / 06-22-2026", kot: true },
  { id: 3, title: "Order created", body: <><b className="text-ink">Bibek Gurung</b> created Table order for <b className="text-ink">Booth B</b>.</>, time: "05:14 PM / 06-22-2026", kot: true },
  { id: 4, title: "Order updated", body: <><b className="text-ink">Salil Timalsina</b> added 2× <b className="text-ink">Burger</b> to Table order <b className="text-ink">Table 2</b>.</>, time: "05:10 PM / 06-22-2026", kot: false },
  { id: 5, title: "Payment received", body: <>Payment of <b className="text-ink">Rs 570</b> received for <b className="text-ink">Cabin 2</b> via eSewa.</>, time: "05:02 PM / 06-22-2026", kot: false },
];

const ACTIVITY = [
  { id: 1, title: "Delivery platform updated", body: "changed isActive to active status for delivery platform Pathao Food.", time: "05:15 PM / 06-22-2026", icon: UsersRound },
  { id: 2, title: "Delivery platform updated", body: "changed isActive to active status for delivery platform FoodMandu.", time: "05:15 PM / 06-22-2026", icon: UsersRound },
  { id: 3, title: "Delivery Rider created", body: "created delivery rider Salil Timalsina.", time: "05:14 PM / 06-22-2026", icon: Bike },
  { id: 4, title: "Space created", body: "created space Upstairs.", time: "05:05 PM / 06-22-2026", icon: UsersRound },
  { id: 5, title: "Table updated", body: "changed out of service status from on to off of Cabin 1.", time: "05:05 PM / 06-22-2026", icon: UsersRound },
  { id: 6, title: "Table updated", body: "changed out of service status from off to on of Cabin 1.", time: "05:05 PM / 06-22-2026", icon: UsersRound },
];

export default function NotificationPage() {
  const [tab, setTab] = useState<"order" | "activity">("order");

  return (
    <>
      <PageHeader title="Notification" actions={
        tab === "activity" ? (
          <Button size="sm" radius="md" variant="bordered" className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-600"
            startContent={<SlidersHorizontal size={15} color="#6B5F55" />}>Filter</Button>
        ) : undefined
      } />

      <Tabs size="sm" radius="md" selectedKey={tab} onSelectionChange={(k) => setTab(k as typeof tab)}
        classNames={{ base: "self-start", tabList: "bg-[#F6EFE8]", cursor: "bg-white shadow-sm", tabContent: "font-bold text-[12.5px]" }}>
        <Tab key="order" title="Order" />
        <Tab key="activity" title="Activity" />
      </Tabs>

      <h2 className="text-[15px] font-extrabold text-ink">Today</h2>

      {tab === "order" ? (
        <div className="flex flex-col gap-3 max-w-[760px]">
          {ORDER_NOTIFS.map((n) => (
            <div key={n.id} className="bg-white border border-[#EEEAE6] rounded-2xl p-4" style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
              <div className="text-[14.5px] font-extrabold text-ink">{n.title}</div>
              <p className="text-[13px] text-warm-600 mt-1 leading-relaxed">{n.body}</p>
              <div className="text-[12.5px] text-warm-500 mt-2">at {n.time}</div>
              {n.kot && <button className="text-[13px] font-bold mt-2" style={{ color: "#2563EB" }}>View KOT</button>}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {ACTIVITY.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={a.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="w-8 h-8 rounded-full bg-[#FDECE4] inline-flex items-center justify-center flex-shrink-0"><Icon size={15} color={ORANGE} /></span>
                  {i < ACTIVITY.length - 1 && <span className="w-px flex-1 bg-warm-200 my-1" />}
                </div>
                <div className="flex-1 min-w-0 pb-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[14px] font-bold text-ink">{a.title}</span>
                    <span className="text-[11.5px] text-warm-500 tnum whitespace-nowrap">{a.time}</span>
                  </div>
                  <p className="text-[13px] text-warm-600 mt-[2px]"><b className="text-ink">Salil Timalsina</b> {a.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

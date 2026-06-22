"use client";

import { useState } from "react";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerBody,
  Tabs, Tab, Button, Switch, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from "@heroui/react";
import { Pencil, Trash2, X, MoreHorizontal, Copy, ExternalLink, UserRound } from "lucide-react";
import { Badge, Tone, ORANGE } from "@/components/rms/primitives";
import { FakeQR } from "@/components/rms/FakeQR";
import { RestoTable, TableStatus, RESTAURANT_NAME } from "@/components/rms/data/tables";

const STATUS_TONE: Record<TableStatus, Tone> = {
  Open: "primary", Occupied: "success", Reserved: "warning",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-[10px] border-b border-warm-200 last:border-b-0">
      <span className="text-[13px] font-semibold text-warm-600">{label}</span>
      <span className="text-[13.5px] font-bold text-ink text-right">{children}</span>
    </div>
  );
}

/* mock activity feed — static timestamps (no Date.now in render) */
const ACTIVITY = [
  { id: 1, from: "on", to: "off", time: "05:05 PM / 06-22-2026" },
  { id: 2, from: "off", to: "on", time: "05:05 PM / 06-22-2026" },
  { id: 3, from: "on", to: "off", time: "05:05 PM / 06-22-2026" },
  { id: 4, from: "off", to: "on", time: "05:04 PM / 06-22-2026" },
];

export function TableDetailDrawer({
  table, onClose, onEdit, onDelete, onToggle,
}: {
  table: RestoTable;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (v: boolean) => void;
}) {
  const [tab, setTab] = useState<"qr" | "activity">("qr");
  const url = `https://${RESTAURANT_NAME.toLowerCase()}.plato.app/menu?t=${table.id}`;

  return (
    <Drawer isOpen onClose={onClose} placement="right" size="md"
      classNames={{ base: "sm:max-w-[520px]", closeButton: "hidden" }}>
      <DrawerContent>
        <DrawerHeader className="flex items-start gap-3 border-b border-warm-200">
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-extrabold text-ink tracking-[-0.02em] truncate">{table.type} - {table.name}</div>
          </div>
          <Button size="sm" variant="bordered" radius="md"
            className="h-[34px] border border-[#E6E1DC] bg-white font-semibold text-warm-600 text-[12.5px]"
            startContent={<Pencil size={14} color="#8A7D72" />} onPress={onEdit}>
            Edit
          </Button>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="bordered" radius="md"
                className="w-[34px] h-[34px] min-w-[34px] border border-[#E6E1DC] bg-white">
                <MoreHorizontal size={16} color="#8A7D72" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Table actions">
              <DropdownItem key="del" className="text-[#F15022]" color="danger"
                startContent={<Trash2 size={15} color="#F15022" />} onPress={onDelete}>Move to trash</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button isIconOnly size="sm" variant="bordered" radius="md"
            className="w-[34px] h-[34px] min-w-[34px] border border-[#E6E1DC] bg-white" onPress={onClose}>
            <X size={16} color="#8A7D72" />
          </Button>
        </DrawerHeader>

        <DrawerBody className="px-5 gap-[14px] py-5">
          {/* fields */}
          <div className="border border-warm-200 rounded-[14px] px-4">
            <Row label="Table Capacity"><span className="tnum">{table.capacity}</span></Row>
            <Row label="Table Type">{table.type}</Row>
            <Row label="Space">{table.space || "—"}</Row>
            <Row label="Table Status"><Badge tone={STATUS_TONE[table.status]}>{table.status}</Badge></Row>
            <Row label="Charge"><span className="tnum">{table.charge ? `Rs ${table.charge}` : "—"}</span></Row>
            <Row label="Available">
              <Switch isSelected={table.available} onValueChange={onToggle} size="sm"
                classNames={{ wrapper: table.available ? "bg-[#15803D]" : "" }} aria-label="Available" />
            </Row>
          </div>

          {/* share link */}
          <div className="border border-warm-200 rounded-[14px] p-4 flex flex-col gap-[10px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-extrabold text-ink">Share table link</span>
              <button className="text-[12.5px] font-bold text-[#3B82F6]">Get your own domain?</button>
            </div>
            <div className="flex items-center gap-2 bg-warm-50 border border-warm-200 rounded-[10px] pl-3 pr-[6px] py-[6px]">
              <span className="flex-1 min-w-0 text-[13px] text-warm-700 truncate">{url.replace("https://", "")}</span>
              <button className="w-8 h-8 rounded-md inline-flex items-center justify-center hover:bg-warm-100"><Copy size={15} color="#6B5F55" /></button>
              <Button size="sm" radius="md" className="h-9 font-bold text-white bg-[#1F1A17]"
                startContent={<ExternalLink size={14} color="#fff" />}>Open Link</Button>
            </div>
          </div>

          {/* tabs */}
          <Tabs size="sm" radius="md" selectedKey={tab} onSelectionChange={(k) => setTab(k as typeof tab)}
            classNames={{ tabList: "bg-[#F6EFE8]", cursor: "bg-white shadow-sm", tabContent: "font-bold text-[12.5px]" }}>
            <Tab key="qr" title="QR Code" />
            <Tab key="activity" title="Activity" />
          </Tabs>

          {tab === "qr" ? (
            <div className="border border-warm-200 rounded-[14px] p-6 flex flex-col items-center gap-4">
              <div className="flex items-center gap-[6px] text-[18px] font-extrabold lowercase text-ink">
                <span className="w-[22px] h-[22px] rounded-[6px] inline-flex items-center justify-center text-white text-[13px] font-extrabold" style={{ background: ORANGE }}>p</span>
                plato
              </div>
              <div className="p-3 rounded-[12px] bg-white border border-warm-200">
                <FakeQR seed={url} size={180} />
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[14px] font-extrabold text-ink mb-2">Today</div>
              <div className="flex flex-col">
                {ACTIVITY.map((a, i) => (
                  <div key={a.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="w-8 h-8 rounded-full bg-[#FDECE4] inline-flex items-center justify-center flex-shrink-0">
                        <UserRound size={15} color={ORANGE} />
                      </span>
                      {i < ACTIVITY.length - 1 && <span className="w-px flex-1 bg-warm-200 my-1" />}
                    </div>
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[13.5px] font-bold text-ink">Table updated</span>
                        <span className="text-[11.5px] text-warm-500 tnum whitespace-nowrap">{a.time}</span>
                      </div>
                      <p className="text-[12.5px] text-warm-600 mt-[2px]">
                        <span className="font-bold text-ink">Salil Timalsina</span> changed out of service status from {a.from} to {a.to} of <span className="font-bold text-ink">{table.name}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

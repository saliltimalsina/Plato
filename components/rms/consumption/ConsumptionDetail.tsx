"use client";

import { Button } from "@heroui/react";
import { Box, Pencil, Trash2 } from "lucide-react";
import { DrawerShell, Section, DField } from "@/components/rms/DrawerShell";
import { Badge, ORANGE } from "@/components/rms/primitives";
import type { Consumption, StockUsed } from "@/components/rms/data/consumption";

interface Props {
  item: Consumption;
  onClose: () => void;
  onEdit: (it: Consumption) => void;
  onDelete: (it: Consumption) => void;
}

export function ConsumptionDetail({ item, onClose, onEdit, onDelete }: Props) {
  const header = (
    <>
      <div className="flex-1 min-w-0 flex items-center gap-[9px]">
        <span className="text-[18px] font-extrabold text-ink tracking-[-0.02em] truncate">{item.finishedGood}</span>
        <span className="text-[11px] font-semibold font-mono text-warm-500 bg-warm-200 px-[7px] py-[2px] rounded-md flex-shrink-0">
          #{String(item.id).padStart(4, "0")}
        </span>
      </div>
      <Button size="sm" variant="bordered" radius="md" className="h-[34px] border border-[#E6E1DC] bg-white font-semibold text-warm-600 text-[12.5px]"
        startContent={<Pencil size={14} color="#8A7D72" />} onPress={() => onEdit(item)}>
        Edit
      </Button>
      <Button isIconOnly size="sm" variant="bordered" radius="md" className="w-[34px] h-[34px] min-w-[34px] border border-[#E6E1DC] bg-white" onPress={() => onDelete(item)}>
        <Trash2 size={16} color={ORANGE} />
      </Button>
    </>
  );

  const footer = (
    <>
      <Button variant="bordered" radius="lg" className="h-[42px] border border-[#E6E1DC] bg-white font-semibold text-warm-600"
        startContent={<Trash2 size={16} color={ORANGE} />} onPress={() => onDelete(item)}>
        Delete
      </Button>
      <Button radius="lg" className="flex-1 h-[42px] font-bold text-white"
        style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
        startContent={<Pencil size={15} color="#fff" />} onPress={() => onEdit(item)}>
        Edit consumption
      </Button>
    </>
  );

  return (
    <DrawerShell header={header} footer={footer} onClose={onClose}>
      <Section title="Overview" first>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <DField label="Finished Good">{item.finishedGood}</DField>
          <DField label="Type"><Badge tone="secondary">{item.type}</Badge></DField>
          <DField label="Sales Price"><span className="tnum">{item.salesPrice}</span></DField>
          <DField label="Cost"><span className="tnum">{item.cost}</span></DField>
        </div>
      </Section>

      <Section title="Stocks Used" action={item.stocksUsed.length > 0 ? <span className="text-[11.5px] font-bold text-warm-500">{item.stocksUsed.length} item{item.stocksUsed.length > 1 ? "s" : ""}</span> : undefined}>
        <StocksTable rows={item.stocksUsed} />
      </Section>
    </DrawerShell>
  );
}

function StocksTable({ rows }: { rows: StockUsed[] }) {
  if (!rows.length) {
    return (
      <div className="border-[1.5px] border-dashed border-warm-200 rounded-[12px] py-[22px] text-center flex flex-col items-center gap-2">
        <div className="w-[34px] h-[34px] rounded-[10px] bg-warm-100 flex items-center justify-center"><Box size={16} color="#C9BCB0" /></div>
        <span className="text-[12.5px] text-warm-500 font-medium">No stocks recorded yet.</span>
      </div>
    );
  }
  const cols = "34px 1fr 52px 46px 86px";
  return (
    <div className="border border-[#EEEAE6] rounded-[12px] overflow-hidden">
      <div className="grid bg-cream border-b border-warm-200 px-3 py-2 text-[10.5px] font-bold text-warm-500 uppercase tracking-[0.04em]" style={{ gridTemplateColumns: cols }}>
        <span>S.N</span><span>Name</span><span className="text-center">Qty</span><span className="text-center">Unit</span><span className="text-right">Amount</span>
      </div>
      {rows.map((r, i) => (
        <div key={r.id} className="grid px-3 py-[10px] items-center" style={{ gridTemplateColumns: cols, borderBottom: i === rows.length - 1 ? "none" : "1px solid #F4EFEB" }}>
          <span className="text-[12px] font-mono text-warm-500">{i + 1}</span>
          <span className="text-[13px] font-semibold text-ink">{r.name}</span>
          <span className="text-[13px] font-semibold text-warm-600 text-center tnum">{r.qty}</span>
          <span className="text-[13px] font-semibold text-warm-600 text-center">{r.unit}</span>
          <span className="text-[13px] font-bold text-ink text-right tnum">{r.amount}</span>
        </div>
      ))}
    </div>
  );
}

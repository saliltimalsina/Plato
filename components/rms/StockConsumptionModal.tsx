"use client";

import { Button, Input, Select, SelectItem } from "@heroui/react";
import { Plus, Trash2 } from "lucide-react";
import { ModalShell, ModalFooterButtons, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { ITEMS as STOCK_ITEMS, UNITS } from "@/components/stock/data";

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;

/* stock consumption row */
export interface StockUsageRow {
  id: number;
  stockItem: string;
  unit: string;
  qty: string;
}

export const newStockRow = (id: number): StockUsageRow => ({
  id, stockItem: "", unit: "", qty: "",
});

/* total cost of consumed stock (used as COGS) */
export const stockRowsCost = (rows: StockUsageRow[]) =>
  rows.reduce((sum, r) => {
    const stock = STOCK_ITEMS.find((s) => s.name === r.stockItem);
    return sum + (Number(r.qty) || 0) * (stock?.rateNum ?? 0);
  }, 0);

export function StockConsumptionModal({
  rows, setRows, onClose, onSave,
}: {
  rows: StockUsageRow[];
  setRows: (fn: (p: StockUsageRow[]) => StockUsageRow[]) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const add    = () => setRows((r) => [...r, newStockRow((r.at(-1)?.id ?? 0) + 1)]);
  const remove = (id: number) => setRows((r) => (r.length > 1 ? r.filter((x) => x.id !== id) : r));
  const patch  = (id: number, p: Partial<StockUsageRow>) =>
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const valid = rows.every((r) => r.stockItem && r.unit && Number(r.qty) > 0);

  return (
    <ModalShell
      title="Stock Used or Reduced after Sales"
      size="3xl"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600"
            onPress={() => setRows(() => [newStockRow(1)])}>
            Reset
          </Button>
          <ModalFooterButtons onCancel={onClose} onConfirm={onSave}
            confirmLabel="Save Consumption" disabled={!valid} />
        </div>
      }
    >
      <div className="border border-warm-200 rounded-[12px] overflow-hidden">
        <div className="grid gap-x-3 bg-cream border-b border-warm-200 px-4 py-[10px] text-[11px] font-bold text-warm-600 uppercase tracking-[0.04em] min-w-[640px]"
          style={{ gridTemplateColumns: "1.6fr 0.8fr 0.7fr 0.9fr 40px" }}>
          <span>Stocks<Req /></span>
          <span>Unit<Req /></span>
          <span>QTY<Req /></span>
          <span>Amount</span>
          <span />
        </div>
        {rows.map((row, i) => {
          const stock = STOCK_ITEMS.find((s) => s.name === row.stockItem);
          const amount = (Number(row.qty) || 0) * (stock?.rateNum ?? 0);
          return (
            <div key={row.id} className="grid gap-x-3 px-4 py-3 items-center min-w-[640px]"
              style={{
                gridTemplateColumns: "1.6fr 0.8fr 0.7fr 0.9fr 40px",
                borderBottom: i === rows.length - 1 ? "none" : "1px solid #F4EFEB",
              }}>
              <Select
                size="sm" aria-label="Stock Item" placeholder="Select Stock Item"
                selectedKeys={row.stockItem ? [row.stockItem] : []}
                onSelectionChange={(k) => {
                  const v = Array.from(k)[0] as string;
                  const it = STOCK_ITEMS.find((x) => x.name === v);
                  patch(row.id, { stockItem: v, unit: it?.unit ?? row.unit });
                }}
                variant="bordered" radius="md"
                classNames={{ trigger: wrapCx, value: inputCx }}>
                {STOCK_ITEMS.map((s) => <SelectItem key={s.name}>{s.name}</SelectItem>)}
              </Select>
              <Select
                size="sm" aria-label="Unit" placeholder="Unit"
                selectedKeys={row.unit ? [row.unit] : []}
                onSelectionChange={(k) => patch(row.id, { unit: Array.from(k)[0] as string })}
                variant="bordered" radius="md"
                classNames={{ trigger: wrapCx, value: inputCx }}>
                {UNITS.map((u) => <SelectItem key={u}>{u}</SelectItem>)}
              </Select>
              <Input
                size="sm" aria-label="QTY" type="number" placeholder="0"
                value={row.qty} onValueChange={(v) => patch(row.id, { qty: v })}
                variant="bordered"
                classNames={{ inputWrapper: wrapCx, input: `${inputCx} text-right tnum` }} />
              <div className="h-10 flex items-center px-3 rounded-[9px] bg-warm-50 border border-warm-200 text-[13px] font-semibold text-ink tnum">
                <span className="text-warm-500 text-[12px] mr-1">Rs</span>
                {amount.toFixed(2)}
              </div>
              <button
                onClick={() => remove(row.id)}
                className="w-9 h-9 rounded-[9px] flex items-center justify-center border border-warm-200 bg-white hover:bg-warm-100 transition-colors"
                title="Remove row"
              >
                <Trash2 size={14} color="#8A7D72" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mt-1">
        <Button size="sm" variant="bordered" radius="md"
          className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-700 text-[12.5px]"
          startContent={<Plus size={14} color="#6B5F55" strokeWidth={2.4} />}
          onPress={add}>
          Add More
        </Button>
      </div>
    </ModalShell>
  );
}

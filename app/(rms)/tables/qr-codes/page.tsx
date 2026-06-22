"use client";

import { useMemo, useState } from "react";
import { Button, Input } from "@heroui/react";
import { Search, Download, Printer, Link2 } from "lucide-react";
import { PageHeader, ORANGE } from "@/components/rms/primitives";
import { FakeQR } from "@/components/rms/FakeQR";
import { TABLES, RESTAURANT_NAME, RestoTable } from "@/components/rms/data/tables";

/* ── QR card ───────────────────────────────────────────────────── */
function QRCard({ table }: { table: RestoTable }) {
  const url = `https://${RESTAURANT_NAME.toLowerCase()}.plato.app/menu?t=${table.id}`;
  return (
    <div className="bg-warm-50 border border-[#EEEAE6] rounded-2xl overflow-hidden flex flex-col">
      <div className="flex-1 flex flex-col items-center px-5 pt-6 pb-5">
        <span className="text-[13px] font-semibold text-warm-600">Welcome To</span>
        <span className="text-[26px] font-extrabold text-ink tracking-[-0.02em] mt-[2px]">{RESTAURANT_NAME}</span>
        <div className="relative mt-5 p-3 rounded-[14px] bg-white" style={{ border: `2px solid ${ORANGE}` }}>
          <span className="absolute -top-[13px] left-1/2 -translate-x-1/2 px-3 py-[3px] rounded-[7px] text-[11px] font-extrabold uppercase tracking-wide text-white whitespace-nowrap"
            style={{ background: ORANGE }}>{table.name}</span>
          <FakeQR seed={url} />
        </div>
        <span className="text-[12.5px] text-warm-600 mt-4">Scan To Explore Our Menu</span>
        <div className="flex items-center gap-[6px] mt-5 text-[11px] text-warm-500">
          Powered By
          <span className="inline-flex items-center gap-[3px] font-extrabold text-ink lowercase">
            <span className="w-[15px] h-[15px] rounded-[4px] inline-flex items-center justify-center text-white text-[10px] font-extrabold" style={{ background: ORANGE }}>p</span>
            plato
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-[10px] border-t border-warm-200 bg-white">
        <span className="flex-1 inline-flex items-center gap-[6px] min-w-0 text-[12px] text-[#3B82F6] bg-[#EFF6FF] rounded-md px-2 py-[5px]">
          <Link2 size={13} /> <span className="truncate">{url.replace("https://", "")}</span>
        </span>
        <button className="w-8 h-8 rounded-md inline-flex items-center justify-center hover:bg-warm-100"><Download size={15} color="#6B5F55" /></button>
        <button className="w-8 h-8 rounded-md inline-flex items-center justify-center hover:bg-warm-100"><Printer size={15} color="#6B5F55" /></button>
      </div>
    </div>
  );
}

export default function QRCodesPage() {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tables = TABLES.filter((t) => !q || t.name.toLowerCase().includes(q));
    const bySpace = new Map<string, RestoTable[]>();
    for (const t of tables) {
      const key = t.space || "Unassigned Space";
      if (!bySpace.has(key)) bySpace.set(key, []);
      bySpace.get(key)!.push(t);
    }
    return [...bySpace.entries()];
  }, [query]);

  return (
    <>
      <PageHeader
        title="QR Codes"
        actions={
          <div className="hidden lg:flex items-center gap-[9px]">
            <Input size="sm" radius="md" placeholder="Search…" value={query} onValueChange={setQuery}
              startContent={<Search size={15} color="#B0A69E" />}
              classNames={{ base: "w-[210px]", inputWrapper: "bg-white border border-[#E6E1DC] h-9 shadow-none" }} />
            <Button size="sm" radius="md" className="h-9 text-white font-bold"
              style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
              startContent={<Download size={15} color="#fff" />}>
              Download All QR
            </Button>
          </div>
        }
      />

      {/* mobile search */}
      <div className="flex lg:hidden">
        <Input radius="lg" placeholder="Search…" value={query} onValueChange={setQuery}
          startContent={<Search size={16} color="#B0A69E" />}
          classNames={{ base: "flex-1", inputWrapper: "bg-white border border-[#E6E1DC] h-11 shadow-none" }} />
      </div>

      {groups.map(([spaceName, tables]) => (
        <div key={spaceName} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="w-[3px] h-[15px] rounded-full" style={{ background: ORANGE }} />
            <span className="text-[15px] font-extrabold text-ink">{spaceName}</span>
            <span className="text-[11.5px] font-bold px-[9px] py-[2px] rounded-full" style={{ background: "#FDECE4", color: ORANGE }}>
              {tables.length} {tables.length === 1 ? "Table" : "Tables"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tables.map((t) => <QRCard key={t.id} table={t} />)}
          </div>
        </div>
      ))}

      {groups.length === 0 && (
        <div className="py-[60px] text-center">
          <div className="text-[14.5px] font-bold text-ink">No QR codes found</div>
          <div className="text-[13px] text-warm-500 mt-[3px]">Try a different search.</div>
        </div>
      )}
    </>
  );
}

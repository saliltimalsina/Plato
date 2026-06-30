"use client";

import { useMemo, useState } from "react";
import {
  Button, Input, Modal, ModalContent, Tabs, Tab, Tooltip,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Popover, PopoverTrigger, PopoverContent,
} from "@heroui/react";
import {
  Search, Plus, ChevronDown, MoreHorizontal, MoreVertical, Utensils, Bike, CalendarCheck,
  ShoppingBag, ShoppingCart, FileText, X, Scissors, Printer, UserPlus, ChevronRight, Zap,
  BadgeCheck, Copy, Pin, Trash2,
} from "lucide-react";
import { PageHeader, ORANGE, Badge, Tone } from "@/components/rms/primitives";
import { wrapCx, inputCx } from "@/components/rms/ModalShell";
import { DISHES, Dish } from "@/components/rms/data/menu";
import { TABLES, RestoTable, TableStatus } from "@/components/rms/data/tables";
import { OPEN_ORDERS, OpenOrder, KOTS, ORDER_TYPES, STAFF_LIST } from "@/components/rms/data/orders";

const STATUS_TONE: Record<TableStatus, Tone> = { Open: "primary", Occupied: "success", Reserved: "warning" };
const ORDER_TYPE_ICON: Record<string, typeof Utensils> = {
  "dine-in": Utensils, delivery: Bike, reservation: CalendarCheck, takeaway: ShoppingBag, pickup: ShoppingCart, quick: FileText,
};

export default function OrdersPage() {
  const [tab, setTab] = useState<"orders" | "table" | "kot">("orders");
  const [addOrderOpen, setAddOrderOpen] = useState(false);
  const [dishesOpen, setDishesOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Tabs size="sm" radius="md" selectedKey={tab} onSelectionChange={(k) => setTab(k as typeof tab)}
          classNames={{ tabList: "bg-[#F6EFE8]", cursor: "bg-white shadow-sm", tabContent: "font-bold text-[13px]" }}>
          <Tab key="orders" title="Orders" />
          <Tab key="table" title="Table" />
          <Tab key="kot" title="KOT" />
        </Tabs>
        <div className="flex items-center gap-[9px]">
          {tab === "orders" && (
            <>
              <Button size="sm" radius="md" variant="bordered" className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-700">POS Mode</Button>
              <Button size="sm" radius="md" variant="bordered" className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-700">KDS Mode</Button>
            </>
          )}
          {tab === "kot" && (
            <>
              <Button size="sm" radius="md" variant="bordered" className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-700">Completed KOTs</Button>
              <Button size="sm" radius="md" variant="bordered" className="h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-700"
                startContent={<Scissors size={14} color="#6B5F55" />}>Split KOT by type</Button>
            </>
          )}
          <Input size="sm" radius="md" placeholder="Search…" startContent={<Search size={15} color="#B0A69E" />}
            classNames={{ base: "w-[180px]", inputWrapper: "bg-white border border-[#E6E1DC] h-9 shadow-none" }} />
          <AddOrderButton onPick={() => { setAddOrderOpen(true); }} />
          <Button isIconOnly size="sm" radius="md" variant="bordered" className="h-9 w-9 min-w-9 bg-white border border-[#E6E1DC]"><MoreHorizontal size={18} color="#9A8C80" /></Button>
        </div>
      </div>

      {tab === "orders" && <OrdersTab />}
      {tab === "table" && <TableTab />}
      {tab === "kot" && <KotTab />}

      {addOrderOpen && (
        <AddOrderModal onClose={() => setAddOrderOpen(false)} onPickTable={() => { setAddOrderOpen(false); setDishesOpen(true); }} />
      )}
      {dishesOpen && <SelectDishesModal onClose={() => setDishesOpen(false)} />}
    </>
  );
}

function AddOrderButton({ onPick }: { onPick: (key: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover placement="bottom-end" isOpen={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className="inline-flex items-stretch rounded-md overflow-hidden cursor-pointer" style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}>
          <span className="h-9 px-3 inline-flex items-center gap-1 text-white font-bold text-[13px]"><Plus size={16} color="#fff" strokeWidth={2.4} />Add New Order</span>
          <span className="w-px bg-white/30 my-[6px]" />
          <span className="h-9 w-8 inline-flex items-center justify-center"><ChevronDown size={16} color="#fff" strokeWidth={2.4} /></span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-4 w-[460px]">
        <div className="w-full">
          <div className="text-[16px] font-extrabold text-ink mb-3">Add New Order</div>
          <div className="grid grid-cols-2 gap-3">
            {ORDER_TYPES.map((o) => {
              const Icon = ORDER_TYPE_ICON[o.key];
              return (
                <button key={o.key} onClick={() => { setOpen(false); onPick(o.key); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-[12px] bg-warm-50 border border-[#EEEAE6] hover:bg-warm-100 transition-colors text-left">
                  <span className="w-10 h-10 rounded-[10px] bg-white border border-warm-200 flex items-center justify-center"><Icon size={18} color="#3F3933" /></span>
                  <span className="text-[14.5px] font-bold text-ink">{o.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function OrdersTab() {
  return (
    <>
      <div className="inline-flex self-start items-center gap-2 h-9 px-3 rounded-[10px] border border-[#E6E1DC] bg-white">
        <Utensils size={15} color="#6B5F55" /><span className="text-[13px] font-bold text-warm-700">Dine In</span>
        <span className="text-[12px] font-bold text-warm-500 bg-warm-100 rounded-md px-[7px]">{OPEN_ORDERS.length}</span>
      </div>
      <div className="flex flex-wrap gap-5">
        {OPEN_ORDERS.map((o) => <OrderCard key={o.id} order={o} />)}
      </div>
    </>
  );
}

/* order card: dish lines by default → checkout actions on hover */
function OrderCard({ order: o }: { order: OpenOrder }) {
  const actions = [
    { icon: Plus,     label: "Add Order" },
    { icon: Printer,  label: "Print Order" },
    { icon: FileText, label: "Send Bill" },
    { icon: Zap,      label: "Quick Checkout" },
  ];
  return (
    <div className="w-[300px]">
      <div className="text-[15px] font-extrabold text-ink mb-2">{o.table}</div>
      <div className="group relative rounded-[14px] border-2 border-[#F4D58A] bg-[#FFFBEB] p-4 min-h-[212px] transition-colors group-hover:border-[#E6E1DC]">
        {/* default: dish lines */}
        <div className="flex items-center justify-between">
          <span className="text-[13.5px] font-bold text-ink">{o.type}</span>
          <span className="text-[12.5px] font-bold" style={{ color: "#15803D" }}>{o.placedAgo}</span>
        </div>
        <div className="mt-3 flex flex-col gap-[6px]">
          {o.lines.map((l) => (
            <div key={l.name} className="flex items-center justify-between text-[13px]">
              <span className="inline-flex items-center gap-2 text-warm-700"><span className="w-[6px] h-[6px] rounded-full" style={{ background: ORANGE }} />{l.name}</span>
              <span className="tnum font-semibold text-ink">{l.qty}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-[#EBD9A8] flex items-center justify-between text-[13px]">
          <span className="text-warm-600">Dishes: <span className="font-bold text-ink">{o.lines.length}</span></span>
          <span className="font-extrabold text-ink tnum">Rs {o.total}</span>
        </div>

        {/* hover: total + quick actions */}
        <div className="absolute inset-0 rounded-[12px] bg-white p-4 flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-150">
          {/* More menu — HeroUI dropdown */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light" radius="sm"
                className="absolute top-3 right-3 w-7 h-7 min-w-7"
                aria-label="More actions">
                <MoreVertical size={16} color="#9A8C80" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Order actions">
              <DropdownItem key="unbilled" startContent={<BadgeCheck size={15} color={ORANGE} />}>Marked as Unbilled</DropdownItem>
              <DropdownItem key="duplicate" startContent={<Copy size={15} color="#8A7D72" />}>Duplicate Order</DropdownItem>
              <DropdownItem key="pin" startContent={<Pin size={15} color="#8A7D72" />}>Pin Order To Top</DropdownItem>
              <DropdownItem key="print-slip" startContent={<Printer size={15} color="#8A7D72" />}>Print Order Slip</DropdownItem>
              <DropdownItem key="clear" className="text-[#F15022]" color="danger"
                startContent={<Trash2 size={15} color={ORANGE} />}>
                Clear Order
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="text-[26px] font-extrabold text-ink tnum">Rs {o.total}</div>
            <div className="text-[13px] text-warm-500 mt-1">Click to view full order details.</div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            {actions.map((a) => {
              const Icon = a.icon;
              return (
                <Tooltip key={a.label} content={a.label} placement="top" delay={120} closeDelay={0}
                  classNames={{
                    base: "before:bg-[#1F1A14]",
                    content: "bg-[#1F1A14] text-white text-[12px] font-semibold px-2 py-[5px] rounded-md",
                  }}>
                  <Button isIconOnly variant="bordered" radius="md" size="md"
                    aria-label={a.label}
                    className="w-[44px] h-[44px] min-w-[44px] border border-[#E6E1DC] bg-white hover:bg-warm-50">
                    <Icon size={18} color="#3F3933" />
                  </Button>
                </Tooltip>
              );
            })}
          </div>
          <button className="h-[46px] rounded-[10px] border text-[14px] font-bold transition-colors"
            style={{ borderColor: "#BBE7C9", background: "#F1FBF4", color: "#15803D" }}>Checkout</button>
        </div>
      </div>
    </div>
  );
}

function TableTab() {
  const [filter, setFilter] = useState<"all" | "uncat">("all");
  return (
    <>
      <div className="flex items-center gap-2">
        <FilterChip label="All" count={TABLES.length} active={filter === "all"} onClick={() => setFilter("all")} />
        <FilterChip label="Uncategorized" count={TABLES.length} active={filter === "uncat"} onClick={() => setFilter("uncat")} />
      </div>
      <div className="text-[14px] font-extrabold text-ink">Uncategorized</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {TABLES.map((t) => {
          const billed = t.status === "Occupied";
          return (
            <div key={t.id} className="rounded-[14px] p-4 border"
              style={{ background: billed ? "#FCE9B8" : "#F4EFEB", borderColor: billed ? "#F0D78A" : "#EEEAE6" }}>
              <div className="text-[15px] font-extrabold text-ink">{t.name}</div>
              <div className="text-[12.5px] font-semibold mt-1" style={{ color: billed ? "#B45309" : "#0EA5E9" }}>{billed ? "Billed" : "Open"}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function FilterChip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 h-9 px-3 rounded-[10px] text-[13px] font-bold transition-colors"
      style={{ background: active ? "#15803D" : "#fff", color: active ? "#fff" : "#6B5F55", border: `1px solid ${active ? "#15803D" : "#E6E1DC"}` }}>
      {label}<span className="text-[11.5px] font-bold rounded-md px-[6px]" style={{ background: active ? "rgba(255,255,255,0.25)" : "#F4EFEB" }}>{count}</span>
    </button>
  );
}

function KotTab() {
  return (
    <>
      <div className="text-[14px] font-semibold text-warm-500">Pending Orders</div>
      <div className="flex flex-wrap gap-4">
        {KOTS.map((k) => (
          <div key={k.id} className="w-[320px] bg-white border border-[#EEEAE6] rounded-2xl p-5" style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
            <div className="text-center text-[18px] font-extrabold text-ink">KOT {k.id}</div>
            <div className="mt-3 text-[12.5px] text-warm-700 flex flex-col gap-1">
              <div className="flex justify-between"><span>Type: {k.type}</span><span>Table: {k.table}</span></div>
              <div>Order By: {k.orderBy}</div>
              <div>Order At: {k.orderAt}</div>
            </div>
            <div className="mt-3 border-t border-dashed border-warm-300 pt-2">
              <div className="flex justify-between text-[11.5px] font-bold text-warm-600 uppercase tracking-[0.04em]"><span>S.N Dishes</span><span>QTY</span></div>
              {k.dishes.map((d, i) => (
                <div key={d.name} className="flex justify-between text-[13px] py-[3px]"><span>{i + 1}.&nbsp; {d.name}</span><span className="tnum">{d.qty}</span></div>
              ))}
            </div>
            <div className="border-t border-dashed border-warm-300 mt-2 pt-2 flex justify-between text-[13px] font-bold">
              <span>Total (Dishes/QTY)</span><span className="tnum">{k.dishes.length}/{k.dishes.reduce((s, d) => s + d.qty, 0)}</span>
            </div>
            <div className="text-center text-[13px] font-semibold text-warm-600 my-3">Thank You!</div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="bordered" radius="md" className="flex-1 h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-700"
                endContent={<ChevronDown size={13} color="#8A7D72" />}>{k.status}</Button>
              <Button size="sm" variant="bordered" radius="md" className="flex-1 h-9 border border-[#E6E1DC] bg-white font-semibold text-warm-700"
                startContent={<Printer size={14} color="#6B5F55" />} endContent={<ChevronDown size={13} color="#8A7D72" />}>Print</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Add Order modal (Table / Customer / Staff) ───────────────── */
function AddOrderModal({ onClose, onPickTable }: { onClose: () => void; onPickTable: (t: RestoTable) => void }) {
  const [tab, setTab] = useState<"table" | "customer" | "staff">("table");
  const [query, setQuery] = useState("");

  return (
    <Modal isOpen onClose={onClose} size="5xl" placement="center" scrollBehavior="inside" hideCloseButton
      classNames={{ base: "rounded-[18px] overflow-hidden bg-white h-[88vh] max-h-[88vh]" }}>
      <ModalContent>
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-warm-200">
          <div className="flex items-center gap-4">
            <h2 className="text-[18px] font-extrabold text-ink">Add Order</h2>
            <Tabs size="sm" radius="md" selectedKey={tab} onSelectionChange={(k) => setTab(k as typeof tab)}
              classNames={{ tabList: "bg-[#F6EFE8]", cursor: "bg-white shadow-sm", tabContent: "font-bold text-[12.5px]" }}>
              <Tab key="table" title="Table" />
              <Tab key="customer" title="Customer" />
              <Tab key="staff" title="Staff" />
            </Tabs>
          </div>
          <div className="flex items-center gap-3">
            <Input size="sm" radius="md" placeholder="Search" value={query} onValueChange={setQuery}
              startContent={<Search size={15} color="#B0A69E" />}
              classNames={{ base: "w-[260px]", inputWrapper: "bg-white border border-[#E6E1DC] h-9 shadow-none" }} />
            <button onClick={onClose} className="w-9 h-9 rounded-[10px] border border-[#E6E1DC] bg-white inline-flex items-center justify-center"><X size={17} color="#8A7D72" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {tab === "table" && (
            <>
              <div className="text-[14px] font-extrabold text-ink mb-3">Uncategorized</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TABLES.map((t) => (
                  <button key={t.id} onClick={() => onPickTable(t)}
                    className="flex items-center justify-between gap-3 px-4 py-4 rounded-[12px] border border-[#EEEAE6] bg-white hover:border-[#F8C9B6] hover:bg-warm-50 transition-colors text-left">
                    <span className="text-[15px] font-bold text-warm-700">{t.name}</span>
                    <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge>
                  </button>
                ))}
              </div>
            </>
          )}
          {tab === "customer" && (
            <div className="border border-[#EEEAE6] rounded-2xl">
              <div className="grid bg-cream border-b border-warm-200 px-4 py-[10px] text-[12px] font-bold text-warm-600" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                <span>Name</span><span>Address</span><span>Contact</span>
              </div>
              <div className="py-[70px] text-center">
                <div className="w-[60px] h-[60px] rounded-full bg-warm-100 inline-flex items-center justify-center mb-3"><Search size={24} color="#C9BCB0" /></div>
                <div className="text-[15px] font-extrabold text-ink">No customer found</div>
                <div className="text-[13px] text-warm-500 mt-1">No customers found</div>
              </div>
            </div>
          )}
          {tab === "staff" && (
            <div className="border border-[#EEEAE6] rounded-2xl overflow-hidden">
              <div className="grid bg-cream border-b border-warm-200 px-4 py-[10px] text-[12px] font-bold text-warm-600" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <span>Full Name</span><span>User Name</span>
              </div>
              {STAFF_LIST.map((st) => (
                <button key={st.id} className="w-full grid items-center px-4 py-3 border-t border-warm-200 hover:bg-warm-50 text-left" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <span className="inline-flex items-center gap-3">
                    <span className="w-9 h-9 rounded-[10px] bg-[#E8E4FB] text-[#6D28D9] flex items-center justify-center text-[12px] font-bold">ST</span>
                    <span className="text-[13.5px] font-semibold text-ink">{st.fullName}</span>
                  </span>
                  <span className="text-[13.5px] text-warm-700">{st.userName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}

/* ── Select Dishes modal (grid + cart + check-in) ─────────────── */
interface CartItem { id: number; dishId: number; qty: number }

function SelectDishesModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [custName, setCustName] = useState("");

  const cats = ["all", ...Array.from(new Set(DISHES.map((d) => d.category)))];
  const filtered = DISHES.filter((d) =>
    (cat === "all" || d.category === cat) &&
    (!query.trim() || d.name.toLowerCase().includes(query.trim().toLowerCase())));

  const dishById = useMemo(() => new Map(DISHES.map((d) => [d.id, d] as const)), []);
  const priceOf = (d?: Dish) => d?.variants[0]?.price ?? 0;
  const add = (d: Dish) => setCart((p) => {
    const ex = p.find((x) => x.dishId === d.id);
    if (ex) return p.map((x) => x === ex ? { ...x, qty: x.qty + 1 } : x);
    return [...p, { id: Date.now() + Math.random(), dishId: d.id, qty: 1 }];
  });
  const total = cart.reduce((s, it) => s + priceOf(dishById.get(it.dishId)) * it.qty, 0);
  const canConfirm = cart.length > 0 || custName.trim().length > 0;

  const tintFor = (d: Dish) => d.recommended ? "linear-gradient(135deg,#FFE9DE,#FFF6EE)" : "linear-gradient(135deg,#F4EFEB,#FAF7F3)";

  return (
    <Modal isOpen onClose={onClose} size="5xl" placement="center" scrollBehavior="inside" hideCloseButton
      classNames={{ base: "rounded-[18px] overflow-hidden bg-white h-[92vh] max-h-[92vh]" }}>
      <ModalContent>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px] min-h-0 overflow-hidden">
          {/* left: dishes */}
          <div className="flex flex-col min-h-0 border-r border-warm-200">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-warm-200 flex-wrap">
              <h2 className="text-[17px] font-extrabold text-ink">Select Dishes</h2>
              <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-warm-100 text-[12.5px] font-semibold text-warm-700"><UserPlus size={13} color="#6B5F55" />Salil Timalsina</span>
              <Input size="sm" radius="md" placeholder="Search here" value={query} onValueChange={setQuery}
                startContent={<Search size={15} color="#B0A69E" />}
                classNames={{ base: "flex-1 min-w-[160px]", inputWrapper: "bg-white border border-[#E6E1DC] h-9 shadow-none" }} />
            </div>
            <div className="flex items-center gap-2 px-5 py-3 overflow-x-auto no-sb">
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className="px-3 py-[7px] rounded-[9px] text-[12.5px] font-bold whitespace-nowrap transition-colors"
                  style={{ background: cat === c ? ORANGE : "#fff", color: cat === c ? "#fff" : "#6B5F55", border: `1px solid ${cat === c ? ORANGE : "#E6E1DC"}` }}>
                  {c === "all" ? "All Categories" : c}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-auto px-5 pb-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filtered.map((d) => (
                  <div key={d.id} className="bg-white border border-warm-200 rounded-[14px] overflow-hidden flex flex-col">
                    <div className="aspect-[5/4] flex items-center justify-center text-[48px]" style={{ background: tintFor(d) }}>{d.emoji}</div>
                    <div className="p-3 flex flex-col gap-1">
                      <div className="text-[13px] font-bold text-ink truncate">{d.name}</div>
                      <div className="text-[12.5px] font-bold tnum" style={{ color: ORANGE }}>Rs {priceOf(d)}</div>
                      <button onClick={() => add(d)} className="mt-1 h-8 rounded-[8px] bg-warm-50 border border-warm-200 text-[12.5px] font-bold text-warm-700 hover:bg-warm-100">Add</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* right: cart + check-in */}
          <div className="flex flex-col min-h-0 bg-warm-50">
            <div className="flex items-center justify-between px-5 py-4 border-b border-warm-200">
              <h3 className="text-[15px] font-extrabold text-ink">Cart Items</h3>
              <Button size="sm" radius="md" className="h-8 text-white font-bold" style={{ background: "#15803D" }} startContent={<Plus size={13} color="#fff" />}>Add Custom Items</Button>
            </div>
            <div className="flex-1 overflow-auto px-5 py-4 flex flex-col gap-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center text-warm-400 py-6"><ShoppingBag size={26} /><span className="text-[12.5px] mt-2">No items added yet</span></div>
              ) : (
                <div className="flex flex-col gap-2">
                  {cart.map((it) => {
                    const d = dishById.get(it.dishId);
                    return (
                      <div key={it.id} className="flex items-center justify-between gap-2 bg-white border border-warm-200 rounded-[10px] px-3 py-2">
                        <span className="text-[13px] font-semibold text-ink truncate">{d?.emoji} {d?.name}</span>
                        <span className="text-[13px] tnum font-bold text-ink">×{it.qty}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="bg-white border border-warm-200 rounded-[14px] p-4">
                <h4 className="text-[14px] font-extrabold text-ink mb-3">Add Check-In Details</h4>
                <button className="w-full flex items-center gap-3 border border-warm-200 rounded-[12px] px-3 py-3 hover:bg-warm-50 text-left">
                  <span className="w-9 h-9 rounded-[10px] bg-[#1F1A17] flex items-center justify-center"><UserPlus size={16} color="#fff" /></span>
                  <span className="flex-1 text-[13.5px] font-semibold text-warm-500">Select Existing Customer</span>
                  <ChevronRight size={16} color="#A89B8F" />
                </button>
                <div className="text-[14px] font-extrabold text-ink mt-4 mb-2">Or, add manually</div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-bold" style={{ color: ORANGE }}>Customer Name *</span>
                  <Input size="sm" variant="bordered" placeholder="Enter customer name" value={custName} onValueChange={setCustName}
                    classNames={{ inputWrapper: wrapCx, input: inputCx }} />
                  {cart.length === 0 && custName.trim() === "" && (
                    <span className="text-[11.5px] mt-1" style={{ color: ORANGE }}>Customer name is required when no items are provided.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-warm-200 bg-white px-5 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[14px]"><span className="font-bold text-ink">Total</span><span className="font-extrabold text-ink tnum">Rs {total}</span></div>
              <div className="flex items-center gap-2">
                <Button variant="bordered" radius="md" className="flex-1 border border-[#E6E1DC] bg-white font-semibold text-warm-700" onPress={onClose}>Confirm &amp; Print</Button>
                <Button radius="md" isDisabled={!canConfirm} className="flex-1 font-bold disabled:opacity-100"
                  style={{ background: canConfirm ? ORANGE : "#EFE8E2", color: canConfirm ? "#fff" : "#B7A99E", boxShadow: canConfirm ? "0 2px 8px rgba(241,80,34,0.32)" : "none" }}
                  onPress={onClose}>Confirm Order</Button>
              </div>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="absolute top-3 right-3 w-9 h-9 rounded-[10px] border border-[#E6E1DC] bg-white inline-flex items-center justify-center z-10"><X size={17} color="#8A7D72" /></button>
      </ModalContent>
    </Modal>
  );
}

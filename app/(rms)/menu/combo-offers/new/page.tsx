"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button, Input, Textarea, Select, SelectItem,
  Modal, ModalContent,
} from "@heroui/react";
import {
  ArrowLeft, UploadCloud, Plus, Minus, Trash2, ImageOff, Package, X, Search,
} from "lucide-react";
import { labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { ORANGE } from "@/components/rms/primitives";
import {
  SUB_MENUS, CATEGORIES, DISHES, ADDONS, Dish, DishVariant,
} from "@/components/rms/data/menu";

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;
const COMBO_TYPES = ["Veg", "Non-Veg", "Egg", "Vegan"];

interface SelectedItem {
  id: number;
  dishId: number;
  variantId?: number;
  qty: number;
  addonIds?: number[];
  remarks?: string;
}

export default function CreateComboOfferPage() {
  const router = useRouter();

  const [type, setType]               = useState("");
  const [name, setName]               = useState("");
  const [hsCode, setHsCode]           = useState("");
  const [prepHrs, setPrepHrs]         = useState("");
  const [prepMin, setPrepMin]         = useState("");
  const [subMenu, setSubMenu]         = useState("");
  const [category, setCategory]       = useState("");
  const [comboPrice, setComboPrice]   = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems]             = useState<SelectedItem[]>([]);
  const [pickerOpen, setPickerOpen]   = useState(false);

  const dishById = useMemo(() => {
    const m = new Map<number, Dish>();
    for (const d of DISHES) m.set(d.id, d);
    return m;
  }, []);

  const subtotalFor = (it: SelectedItem): number => {
    const d = dishById.get(it.dishId);
    if (!d) return 0;
    const v: DishVariant | undefined = it.variantId
      ? d.variants.find((x) => x.id === it.variantId)
      : d.variants[0];
    return (v?.price ?? 0) * it.qty;
  };

  const actualPrice = items.reduce((sum, it) => sum + subtotalFor(it), 0);

  const valid = name.trim() && subMenu && category && comboPrice;

  const reset = () => {
    setType(""); setName(""); setHsCode(""); setPrepHrs(""); setPrepMin("");
    setSubMenu(""); setCategory(""); setComboPrice(""); setDescription("");
    setItems([]);
  };

  const addPickedItems = (picks: SelectedItem[]) => {
    setItems((prev) => {
      const merged = [...prev];
      for (const p of picks) {
        const existing = merged.find((x) => x.dishId === p.dishId && x.variantId === p.variantId);
        if (existing) existing.qty += p.qty;
        else merged.push({ ...p, id: Date.now() + Math.random() });
      }
      return merged;
    });
    setPickerOpen(false);
  };

  const updateQty = (id: number, qty: number) =>
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)));

  const removeItem = (id: number) => setItems((prev) => prev.filter((x) => x.id !== id));

  const prepLabel =
    Number(prepHrs) || Number(prepMin)
      ? `${Number(prepHrs) ? `${Number(prepHrs)} hrs ` : ""}${Number(prepMin) || 0} mins`
      : "00 mins";

  return (
    <div className="flex flex-col min-h-0 flex-1 -mx-4 lg:-mx-8 px-4 lg:px-8 pb-6">
      {/* header */}
      <div className="flex items-center gap-3 py-4">
        <button onClick={() => router.back()}
          className="w-9 h-9 rounded-[10px] border border-[#E6E1DC] bg-white inline-flex items-center justify-center">
          <ArrowLeft size={18} color={ORANGE} />
        </button>
        <h1 className="text-[20px] font-extrabold text-ink tracking-[-0.02em]">Create Combo Offer</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">
        {/* form */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* row: Type / Combo Name / HS Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Type" labelPlacement="outside" placeholder="Select combo-offer type"
              selectedKeys={type ? [type] : []}
              onSelectionChange={(k) => setType(Array.from(k)[0] as string ?? "")}
              size="sm" variant="bordered" radius="md"
              startContent={<span className="text-warm-400 text-[14px]">🍽️</span>}
              classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
            >
              {COMBO_TYPES.map((t) => <SelectItem key={t}>{t}</SelectItem>)}
            </Select>
            <Input label={<>Combo Name<Req /></>} labelPlacement="outside" placeholder="Enter Combo Name"
              size="sm" variant="bordered" value={name} onValueChange={setName}
              classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
            <Input label="HS Code" labelPlacement="outside" placeholder="Enter HS Code eg. 121.1"
              size="sm" variant="bordered" value={hsCode} onValueChange={setHsCode}
              classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }} />
          </div>

          {/* row: Combo Photo / Preparation Time */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_280px] gap-4 items-end">
            <div className="flex flex-col gap-2">
              <span className={labelCx}>Combo Photo</span>
              <label className="border border-dashed border-[#E6E1DC] bg-warm-50/40 rounded-[10px] px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-warm-100">
                <UploadCloud size={18} color="#9A8C80" />
                <span className="text-[13px] text-warm-500">Click here to upload your image</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <span className={labelCx}>Preparation Time</span>
              <div className="flex items-center gap-2">
                <Input size="sm" variant="bordered" placeholder="00" type="number"
                  value={prepHrs} onValueChange={setPrepHrs}
                  endContent={<span className="text-[12px] text-warm-500">hrs</span>}
                  classNames={{ inputWrapper: wrapCx, input: `${inputCx} tnum` }} />
                <span className="text-warm-400">:</span>
                <Input size="sm" variant="bordered" placeholder="00" type="number"
                  value={prepMin} onValueChange={setPrepMin}
                  endContent={<span className="text-[12px] text-warm-500">mins</span>}
                  classNames={{ inputWrapper: wrapCx, input: `${inputCx} tnum` }} />
              </div>
            </div>
          </div>

          {/* Menu section */}
          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-extrabold text-ink">Menu:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label={<>Sub-Menu<Req /></>} labelPlacement="outside" placeholder="Select Sub-Menu"
                selectedKeys={subMenu ? [subMenu] : []}
                onSelectionChange={(k) => setSubMenu(Array.from(k)[0] as string ?? "")}
                size="sm" variant="bordered" radius="md"
                classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
              >
                {SUB_MENUS.map((m) => <SelectItem key={m.name}>{m.name}</SelectItem>)}
              </Select>
              <Select
                label={<>Category<Req /></>} labelPlacement="outside" placeholder="Select Category"
                selectedKeys={category ? [category] : []}
                onSelectionChange={(k) => setCategory(Array.from(k)[0] as string ?? "")}
                size="sm" variant="bordered" radius="md"
                classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
              >
                {CATEGORIES.map((c) => <SelectItem key={c.name}>{c.name}</SelectItem>)}
              </Select>
            </div>
          </div>

          {/* Selected Combo Dishes */}
          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-extrabold text-ink">Selected Combo Dishes</span>
            <span className="text-[12px] text-warm-500">{items.length} items selected</span>
            <div className="border border-warm-200 rounded-[12px] overflow-hidden">
              <div className="grid bg-cream border-b border-warm-200 px-3 py-2 text-[11px] font-bold text-warm-600 uppercase tracking-[0.04em]"
                style={{ gridTemplateColumns: "1.4fr 90px 110px 1fr 1fr 110px 60px" }}>
                <span>Dish Name</span>
                <span>Quantity</span>
                <span>Unit Price</span>
                <span>Variant</span>
                <span>Add-ons</span>
                <span className="text-right">Subtotal</span>
                <span className="text-center">Actions</span>
              </div>
              {items.length === 0 ? (
                <div className="py-8 text-center text-[13px] text-warm-500">No dishes selected.</div>
              ) : (
                items.map((it) => {
                  const d = dishById.get(it.dishId);
                  const v = it.variantId ? d?.variants.find((x) => x.id === it.variantId) : d?.variants[0];
                  return (
                    <div key={it.id} className="grid items-center px-3 py-[10px] border-t border-warm-200"
                      style={{ gridTemplateColumns: "1.4fr 90px 110px 1fr 1fr 110px 60px" }}>
                      <span className="text-[13px] font-semibold text-ink inline-flex items-center gap-2">
                        <span className="text-[15px]">{d?.emoji ?? "🍽️"}</span>{d?.name ?? "—"}
                      </span>
                      <Input size="sm" type="number" variant="bordered"
                        value={String(it.qty)} onValueChange={(v) => updateQty(it.id, Number(v) || 1)}
                        classNames={{ inputWrapper: "h-8 min-h-8 border bg-white", input: "tnum text-[13px]" }} />
                      <span className="text-[13px] tnum">Rs {v?.price ?? 0}</span>
                      <span className="text-[13px]">{v?.name ?? "—"}</span>
                      <span className="text-[12.5px] text-warm-500">—</span>
                      <span className="text-[13px] font-bold tnum text-right">Rs {subtotalFor(it)}</span>
                      <span className="text-center">
                        <button onClick={() => removeItem(it.id)}
                          className="inline-flex w-7 h-7 rounded-md items-center justify-center hover:bg-[#FDECE4]">
                          <Trash2 size={15} color="#F15022" />
                        </button>
                      </span>
                    </div>
                  );
                })
              )}
              <div className="py-3 flex items-center justify-center border-t border-warm-200">
                <Button size="sm" radius="md" className="h-9 text-white font-bold"
                  style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
                  startContent={<Plus size={15} color="#fff" strokeWidth={2.4} />}
                  onPress={() => setPickerOpen(true)}>
                  Add Items
                </Button>
              </div>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label={<>Actual Price<Req /></>} labelPlacement="outside"
              size="sm" variant="bordered" type="number" placeholder="0.00"
              value={String(actualPrice)} isReadOnly
              startContent={<span className="text-[13px] text-warm-500 font-semibold">Rs</span>}
              classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }} />
            <Input label={<>Combo Offer Price<Req /></>} labelPlacement="outside" placeholder="Enter Combo Offer Price"
              size="sm" variant="bordered" type="number" value={comboPrice} onValueChange={setComboPrice}
              startContent={<span className="text-[13px] text-warm-500 font-semibold">Rs</span>}
              classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-extrabold text-ink">Description:</span>
            <Textarea
              variant="bordered" placeholder="Enter description"
              minRows={5} value={description} onValueChange={setDescription}
              classNames={{ inputWrapper: `${wrapCx} h-auto min-h-[140px]`, input: inputCx }}
            />
          </div>
        </div>

        {/* side preview */}
        <aside className="hidden lg:flex w-[340px] flex-shrink-0 flex-col">
          <div className="bg-white border border-[#EEEAE6] rounded-2xl p-4 flex flex-col gap-3 sticky top-4">
            <div className="border border-warm-200 rounded-[12px] bg-warm-50 aspect-[16/10] flex flex-col items-center justify-center text-warm-400">
              <ImageOff size={32} />
              <span className="text-[12.5px] mt-1">No images available</span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[16px] font-extrabold text-ink truncate">{name || "Combo Name"}</span>
              <span className="text-[13px] font-bold tnum" style={{ color: "#15803D" }}>Rs {Number(comboPrice) || 0}</span>
            </div>
            <div className="text-[12.5px] text-warm-600">Preparation Time: <span className="font-semibold text-ink">{prepLabel}</span></div>
            <div className="text-[12.5px] text-warm-600">
              Submenu: <span className="font-semibold text-ink">{subMenu || "—"}</span>
              {"   "}Category: <span className="font-semibold text-ink">{category || "—"}</span>
            </div>
            <div>
              <div className="text-[13px] font-extrabold text-ink mt-1">Description</div>
              <div className="text-[12.5px] text-warm-600 mt-1 line-clamp-3">{description || <span className="text-warm-400">—</span>}</div>
            </div>
            <div>
              <div className="text-[13px] font-extrabold text-ink mt-2">Included Items</div>
              {items.length === 0 ? (
                <div className="mt-3 flex flex-col items-center text-warm-400 py-4">
                  <div className="w-[44px] h-[44px] rounded-full bg-warm-100 flex items-center justify-center"><Package size={20} /></div>
                  <span className="text-[12.5px] mt-2">No items included in this combo</span>
                </div>
              ) : (
                <ul className="mt-2 flex flex-col gap-1">
                  {items.map((it) => {
                    const d = dishById.get(it.dishId);
                    return (
                      <li key={it.id} className="flex items-center justify-between text-[12.5px]">
                        <span className="text-ink">{d?.emoji ?? "🍽️"} {d?.name} × {it.qty}</span>
                        <span className="text-warm-600 tnum">Rs {subtotalFor(it)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* footer */}
      <div className="flex justify-center gap-3 mt-6 border-t border-warm-200 pt-5">
        <Button variant="bordered" radius="md" className="border border-[#E6E1DC] bg-white font-semibold text-warm-600 px-8" onPress={reset}>
          Reset
        </Button>
        <Button
          radius="md"
          isDisabled={!valid}
          className="font-bold disabled:opacity-100 px-10"
          style={{
            background: valid ? ORANGE : "#F0B5A5",
            color: "#fff",
            boxShadow: valid ? "0 2px 8px rgba(241,80,34,0.32)" : "none",
          }}
          onPress={() => { if (valid) router.push("/menu/combo-offers"); }}
        >
          Save
        </Button>
      </div>

      {pickerOpen && (
        <DishPickerModal
          onClose={() => setPickerOpen(false)}
          onConfirm={addPickedItems}
        />
      )}
    </div>
  );
}

function DishPickerModal({
  onClose, onConfirm,
}: { onClose: () => void; onConfirm: (picks: SelectedItem[]) => void }) {
  const [cart, setCart] = useState<SelectedItem[]>([]);
  const [query, setQuery] = useState("");

  const priceFor = (it: SelectedItem): number => {
    const d = DISHES.find((x) => x.id === it.dishId);
    if (!d) return 0;
    const v = it.variantId ? d.variants.find((x) => x.id === it.variantId) : d.variants[0];
    const addonSum = (it.addonIds ?? []).reduce((acc, aid) => {
      const a = ADDONS.find((x) => x.id === aid);
      return acc + (a?.price ?? 0);
    }, 0);
    return ((v?.price ?? 0) + addonSum) * it.qty;
  };

  const total = cart.reduce((sum, it) => sum + priceFor(it), 0);
  const totalQty = cart.reduce((sum, it) => sum + it.qty, 0);

  const filtered = DISHES.filter((d) =>
    !query.trim() || d.name.toLowerCase().includes(query.trim().toLowerCase()));

  const addOrIncrement = (it: SelectedItem) => {
    setCart((prev) => {
      const existing = prev.find((x) =>
        x.dishId === it.dishId &&
        x.variantId === it.variantId &&
        JSON.stringify(x.addonIds ?? []) === JSON.stringify(it.addonIds ?? []));
      if (existing) return prev.map((x) => x === existing ? { ...x, qty: x.qty + it.qty } : x);
      return [...prev, { ...it, id: Date.now() + Math.random() }];
    });
  };

  const updateQty = (id: number, delta: number) =>
    setCart((prev) => prev
      .map((x) => x.id === id ? { ...x, qty: Math.max(1, x.qty + delta) } : x));

  const updateRemarks = (id: number, remarks: string) =>
    setCart((prev) => prev.map((x) => x.id === id ? { ...x, remarks } : x));

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((x) => x.id !== id));

  const [customizing, setCustomizing] = useState<Dish | null>(null);

  const handleAddClick = (d: Dish) => {
    const hasAddons = (d.addons ?? []).length > 0;
    if (d.variants.length > 1 || hasAddons) setCustomizing(d);
    else addOrIncrement({ id: 0, dishId: d.id, variantId: d.variants[0]?.id, qty: 1 });
  };

  const tintFor = (d: Dish): string => {
    switch (d.category) {
      case "Lunch":     return "linear-gradient(135deg, #FFE9DE 0%, #FFF6EE 100%)";
      case "Dinner":    return "linear-gradient(135deg, #FDE2E4 0%, #FFF1F2 100%)";
      case "Breakfast": return "linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)";
      case "Beverages": return "linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)";
      case "Desserts":  return "linear-gradient(135deg, #FCE7F3 0%, #FDF2F8 100%)";
      case "Snacks":    return "linear-gradient(135deg, #DCFCE7 0%, #F0FDF4 100%)";
      default:          return "linear-gradient(135deg, #F4EFEB 0%, #FAF7F3 100%)";
    }
  };

  return (
    <Modal isOpen onClose={onClose} size="5xl" placement="center" scrollBehavior="inside" hideCloseButton
      classNames={{ base: "bg-white rounded-[18px] overflow-hidden max-h-[90vh] h-[90vh]" }}>
      <ModalContent>
        {/* header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-warm-200 bg-white">
          <h2 className="text-[17px] font-extrabold text-ink tracking-[-0.02em]">Select Dishes</h2>
          <div className="flex-1 max-w-[360px]">
            <Input size="sm" radius="md" placeholder="Search here" value={query} onValueChange={setQuery}
              startContent={<Search size={15} color="#B0A69E" />}
              classNames={{ inputWrapper: "bg-white border border-[#E6E1DC] h-9 shadow-none" }} />
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-[10px] border border-[#E6E1DC] bg-white inline-flex items-center justify-center">
            <X size={17} color="#8A7D72" />
          </button>
        </div>

        {/* body: dish grid + selected items */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] min-h-0 overflow-hidden bg-warm-50">
          {/* dish grid */}
          <div className="overflow-auto p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((d) => {
                const minP = Math.min(...d.variants.map((v) => v.price));
                const maxP = Math.max(...d.variants.map((v) => v.price));
                const optCount = d.variants.length + (d.addons?.length ?? 0);
                const inCartCount = cart.filter((x) => x.dishId === d.id).reduce((s, x) => s + x.qty, 0);
                return (
                  <button key={d.id} onClick={() => handleAddClick(d)}
                    className="group relative bg-white border border-warm-200 rounded-[14px] overflow-hidden flex flex-col text-left transition-all hover:shadow-md hover:border-[#F8C9B6]"
                    style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.04)" }}>
                    {/* image area */}
                    <div className="relative w-full aspect-[5/4] flex items-center justify-center"
                      style={{ background: tintFor(d) }}>
                      <span className="text-[64px] leading-none drop-shadow-sm transition-transform group-hover:scale-110">
                        {d.emoji}
                      </span>
                      {d.recommended && (
                        <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10px] font-extrabold uppercase tracking-wide"
                          style={{ background: "#F4B400", color: "#fff" }}>
                          ★ Recommended
                        </span>
                      )}
                      {inCartCount > 0 && (
                        <span className="absolute top-2 right-2 min-w-[22px] h-[22px] px-1 rounded-full text-[11px] font-extrabold inline-flex items-center justify-center text-white tnum"
                          style={{ background: ORANGE, boxShadow: "0 2px 6px rgba(241,80,34,0.4)" }}>
                          {inCartCount}
                        </span>
                      )}
                    </div>
                    {/* content */}
                    <div className="flex-1 flex flex-col gap-1 p-3">
                      <div className="text-[13.5px] font-extrabold text-ink truncate">{d.name}</div>
                      <div className="flex items-center gap-2 text-[11.5px] text-warm-500 truncate">
                        <span>{d.category}</span>
                        {d.type !== "-" && (<><span>·</span><span>{d.type}</span></>)}
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="text-[13.5px] font-bold tnum" style={{ color: "#15803D" }}>
                          {minP === maxP ? `Rs ${minP}` : `Rs ${minP}-${maxP}`}
                        </span>
                        <span className="inline-flex items-center gap-[3px] text-[12px] font-bold px-[10px] py-[5px] rounded-md transition-colors"
                          style={{ background: ORANGE, color: "#fff" }}>
                          <Plus size={12} color="#fff" strokeWidth={2.8} />Add
                        </span>
                      </div>
                      {optCount > 1 && (
                        <span className="text-[10.5px] text-warm-500 mt-[2px]">{optCount} options</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* selected items panel */}
          <aside className="border-l border-warm-200 bg-white flex flex-col min-h-0">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-extrabold text-ink">Selected Items</h3>
              {cart.length > 0 && (
                <button onClick={() => setCart([])} className="text-[12px] font-bold inline-flex items-center gap-1" style={{ color: ORANGE }}>
                  Clear All <Trash2 size={13} color={ORANGE} />
                </button>
              )}
            </div>
            <div className="flex-1 overflow-auto px-5 pb-3">
              {cart.length === 0 ? (
                <div className="text-center text-[13px] text-warm-500 py-10">No items selected.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {cart.map((it) => {
                    const d = DISHES.find((x) => x.id === it.dishId);
                    const v = it.variantId ? d?.variants.find((x) => x.id === it.variantId) : d?.variants[0];
                    return (
                      <div key={it.id} className="border border-warm-200 rounded-[12px] p-3 bg-white">
                        <div className="flex items-start gap-2">
                          <span className="w-8 h-8 rounded-[8px] bg-warm-100 flex items-center justify-center text-[16px] flex-shrink-0">{d?.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13.5px] font-bold text-ink truncate">{d?.name}</div>
                            <div className="text-[12px] text-warm-500">
                              <span className="font-semibold">{v?.name}</span> @ Rs {v?.price}
                            </div>
                            {(it.addonIds ?? []).length > 0 && (
                              <div className="text-[12px] text-warm-600 mt-1">
                                Add-Ons or Extras:
                                <ul className="ml-3 list-disc">
                                  {(it.addonIds ?? []).map((aid) => {
                                    const a = ADDONS.find((x) => x.id === aid);
                                    return a ? <li key={aid}>{a.name} x 1</li> : null;
                                  })}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div className="text-[13px] font-bold tnum text-ink">Rs {priceFor(it)}</div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Input size="sm" variant="bordered" placeholder="Remarks"
                            value={it.remarks ?? ""} onValueChange={(v) => updateRemarks(it.id, v)}
                            classNames={{ inputWrapper: "h-8 min-h-8 border bg-white", input: "text-[12.5px]" }} />
                          <div className="inline-flex items-stretch rounded-md overflow-hidden" style={{ background: ORANGE }}>
                            <button onClick={() => updateQty(it.id, -1)} className="px-2 text-white">
                              <Minus size={13} color="#fff" />
                            </button>
                            <span className="px-3 text-[13px] font-bold text-white inline-flex items-center tnum">{it.qty}</span>
                            <button onClick={() => updateQty(it.id, +1)} className="px-2 text-white">
                              <Plus size={13} color="#fff" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(it.id)} className="w-7 h-7 inline-flex items-center justify-center rounded-md hover:bg-[#FDECE4]">
                            <Trash2 size={14} color="#F15022" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="border-t border-warm-200 px-5 py-3 flex items-center justify-between text-[13px]">
              <span className="font-bold text-ink">Total</span>
              <span className="text-warm-600">QTY: <span className="font-bold text-ink tnum">{totalQty}</span></span>
              <span className="font-extrabold text-ink tnum">Rs {total}</span>
            </div>
          </aside>
        </div>

        {/* sticky footer — dishes /new style */}
        <div className="border-t border-warm-200 bg-white px-6 py-4 flex items-center justify-end gap-3">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={onClose}>
            Cancel
          </Button>
          <Button
            radius="md"
            isDisabled={cart.length === 0}
            className="font-bold disabled:opacity-100"
            style={{
              background: cart.length > 0 ? ORANGE : "#EFE8E2",
              color: cart.length > 0 ? "#fff" : "#B7A99E",
              boxShadow: cart.length > 0 ? "0 2px 8px rgba(241,80,34,0.32)" : "none",
            }}
            onPress={() => onConfirm(cart)}>
            Save{cart.length > 0 ? ` (${cart.length})` : ""}
          </Button>
        </div>
      </ModalContent>

      {customizing && (
        <CustomizeDishModal
          dish={customizing}
          onClose={() => setCustomizing(null)}
          onAdd={(it) => { addOrIncrement(it); setCustomizing(null); }}
        />
      )}
    </Modal>
  );
}

function CustomizeDishModal({
  dish, onClose, onAdd,
}: { dish: Dish; onClose: () => void; onAdd: (it: SelectedItem) => void }) {
  const [variantId, setVariantId] = useState<number>(dish.variants[0]?.id ?? 0);
  const [qty, setQty] = useState(1);
  const [addonIds, setAddonIds] = useState<Set<number>>(new Set());
  const [remarks, setRemarks] = useState("");

  const variant = dish.variants.find((v) => v.id === variantId);
  const addonSum = Array.from(addonIds).reduce((acc, aid) => {
    const a = ADDONS.find((x) => x.id === aid);
    return acc + (a?.price ?? 0);
  }, 0);
  const total = ((variant?.price ?? 0) + addonSum) * qty;

  const dishAddons = ADDONS.filter((a) => (dish.addons ?? []).includes(a.id));

  return (
    <Modal isOpen onClose={onClose} size="md" placement="center"
      classNames={{ base: "rounded-[18px] overflow-hidden bg-white" }}>
      <ModalContent>
        <div className="flex items-center justify-between px-5 py-4 border-b border-warm-200">
          <h3 className="text-[16px] font-extrabold text-ink">Customize Dish</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-[8px] border border-[#E6E1DC] bg-white inline-flex items-center justify-center">
            <X size={15} color="#8A7D72" />
          </button>
        </div>
        <div className="px-5 py-4 flex flex-col gap-4 max-h-[60vh] overflow-auto">
          <div className="border border-warm-200 rounded-[10px] p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-10 h-10 rounded-[10px] bg-warm-100 flex items-center justify-center text-[20px] flex-shrink-0">{dish.emoji}</span>
              <span className="text-[14.5px] font-bold text-ink truncate">{dish.name}</span>
            </div>
            <div className="inline-flex items-stretch rounded-md overflow-hidden" style={{ background: ORANGE }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-2 text-white">
                <Minus size={14} color="#fff" />
              </button>
              <span className="px-3 text-[13px] font-bold text-white inline-flex items-center tnum">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-2 text-white">
                <Plus size={14} color="#fff" />
              </button>
            </div>
          </div>

          {dish.variants.length > 1 && (
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-extrabold text-ink">Select Variants</span>
              <div className="grid grid-cols-3 gap-2">
                {dish.variants.map((v) => {
                  const active = v.id === variantId;
                  return (
                    <button key={v.id} onClick={() => setVariantId(v.id)}
                      className="border rounded-[10px] p-2 text-left transition-colors"
                      style={{
                        background: active ? ORANGE : "#fff",
                        borderColor: active ? ORANGE : "#E6E1DC",
                        color: active ? "#fff" : "#3F3933",
                      }}>
                      <div className="text-[13px] font-bold">{v.name}</div>
                      <div className="text-[12.5px] font-bold tnum" style={{ color: active ? "#fff" : ORANGE }}>Rs {v.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {dishAddons.length > 0 && (
            <div className="flex flex-col gap-2">
              <div>
                <div className="text-[13px] font-extrabold text-ink">Add-Ons or Extras</div>
                <div className="text-[12px] text-warm-500">Choose your taste.</div>
              </div>
              <div className="flex flex-col gap-2">
                {dishAddons.map((a) => {
                  const on = addonIds.has(a.id);
                  return (
                    <div key={a.id} className="flex items-center justify-between gap-3 border border-warm-200 rounded-[10px] px-3 py-2 bg-white">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[15px]">{a.emoji ?? "🍽️"}</span>
                        <span className="text-[13px] font-bold text-ink truncate">{a.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] font-bold tnum text-warm-700">Rs {a.price}</span>
                        <button onClick={() => setAddonIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(a.id)) next.delete(a.id); else next.add(a.id);
                          return next;
                        })}
                          className="inline-flex items-center gap-1 px-3 py-[5px] rounded-md border text-[12px] font-bold"
                          style={{
                            background: on ? ORANGE : "#FFF6F2",
                            borderColor: "#F8C9B6",
                            color: on ? "#fff" : ORANGE,
                          }}>
                          {on ? "Added" : <><Plus size={12} color={ORANGE} strokeWidth={2.4} />Add</>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-extrabold text-ink">Remarks</span>
            <Input size="sm" variant="bordered" placeholder="Enter remarks"
              value={remarks} onValueChange={setRemarks}
              classNames={{ inputWrapper: wrapCx, input: inputCx }} />
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-4 border-t border-warm-200 bg-white">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={onClose}>
            Cancel
          </Button>
          <Button radius="md" className="flex-1 font-bold text-white"
            style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
            onPress={() => onAdd({ id: 0, dishId: dish.id, variantId, qty, addonIds: Array.from(addonIds), remarks })}>
            Add to Cart Rs {total}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button, Input, Textarea, Select, SelectItem, Checkbox,
  Drawer, DrawerContent, DrawerHeader, DrawerBody,
} from "@heroui/react";
import {
  ArrowLeft, UploadCloud, Plus, Pencil, X, Search, Trash2,
} from "lucide-react";
import { ModalShell, ModalFooterButtons, labelCx, wrapCx, inputCx } from "@/components/rms/ModalShell";
import { ORANGE } from "@/components/rms/primitives";
import {
  DishType, DISH_TYPES, DISH_TYPE_EMOJI,
  SUB_MENUS, CATEGORIES, ADDONS,
} from "@/components/rms/data/menu";
import { ITEMS as STOCK_ITEMS, UNITS } from "@/components/stock/data";

const Req = () => <span className="text-[#F15022] ml-[2px]">*</span>;

interface LocalAddon { id: number; name: string; price: number; used: number }
const initialAddons: LocalAddon[] = ADDONS.map((a) => ({
  id: a.id, name: a.name, price: a.price, used: 0,
}));

/* stock consumption row */
interface StockUsageRow {
  id: number;
  stockItem: string;
  unit: string;
  qty: string;
}
const newStockRow = (id: number): StockUsageRow => ({
  id, stockItem: "", unit: "", qty: "",
});

export default function CreateDishPage() {
  const router = useRouter();

  /* form state */
  const [type, setType]           = useState<DishType | "">("");
  const [name, setName]           = useState("");
  const [hsCode, setHsCode]       = useState("");
  const [prepHrs, setPrepHrs]     = useState("");
  const [prepMin, setPrepMin]     = useState("");
  const [subMenu, setSubMenu]     = useState("");
  const [category, setCategory]   = useState("");
  const [actualPrice, setActualPrice] = useState("");
  const [discount, setDiscount]   = useState("");
  const [description, setDescription] = useState("");

  /* dynamic option lists */
  const [subMenus, setSubMenus]     = useState(SUB_MENUS.map((s) => s.name));
  const [categories, setCategories] = useState(CATEGORIES.map((c) => c.name));
  const [addons, setAddons]         = useState<LocalAddon[]>(initialAddons);
  const [selectedAddons, setSelectedAddons] = useState<Set<number>>(new Set());

  /* sub-modals */
  const [openSubMenuModal, setOpenSubMenuModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openAddonsDrawer, setOpenAddonsDrawer] = useState(false);
  const [openNewAddonModal, setOpenNewAddonModal] = useState(false);
  const [openStockModal, setOpenStockModal] = useState(false);
  const [stockRows, setStockRows] = useState<StockUsageRow[]>([newStockRow(1)]);

  const listedPrice = Number(actualPrice) || 0;
  const finalPrice  = Math.max(0, listedPrice - (Number(discount) || 0));
  const cogs = 0;
  const grossProfit = Math.max(0, finalPrice - cogs);

  const valid = name.trim().length > 0 && subMenu && Number(actualPrice) > 0;

  const save = (createAnother: boolean) => {
    if (!valid) return;
    if (createAnother) {
      // reset minimal
      setName(""); setHsCode(""); setActualPrice(""); setDiscount(""); setDescription("");
      setSelectedAddons(new Set());
    } else {
      router.push("/menu/dishes");
    }
  };

  const reset = () => {
    setType(""); setName(""); setHsCode("");
    setPrepHrs(""); setPrepMin("");
    setSubMenu(""); setCategory("");
    setActualPrice(""); setDiscount("");
    setDescription(""); setSelectedAddons(new Set());
  };

  return (
    <div className="flex flex-col gap-[18px]">
      {/* header */}
      <div className="flex items-center gap-3">
        <Button isIconOnly size="sm" variant="bordered" radius="md"
          className="w-9 h-9 min-w-9 border border-[#E6E1DC] bg-white"
          onPress={() => router.push("/menu/dishes")}>
          <ArrowLeft size={18} color={ORANGE} />
        </Button>
        <h1 className="text-[22px] font-extrabold tracking-[-0.025em] text-ink m-0">Create Dish</h1>
      </div>

      <div className="bg-white border border-[#EEEAE6] rounded-2xl p-5 flex flex-col gap-5"
        style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
        {/* row 1: type / name / HS code */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Select
            label="Type" labelPlacement="outside" placeholder="Select dish type"
            selectedKeys={type ? [type] : []}
            onSelectionChange={(k) => setType((Array.from(k)[0] as DishType) ?? "")}
            startContent={
              type && type !== "-"
                ? <span className="text-[16px] leading-none">{DISH_TYPE_EMOJI[type]}</span>
                : <span className="w-[14px] h-[14px] rounded-full bg-warm-200 flex-shrink-0" />
            }
            variant="bordered" radius="md"
            classNames={{
              label: labelCx, trigger: wrapCx, value: inputCx,
              listboxWrapper: "p-1",
            }}
          >
            {DISH_TYPES.map((t) => (
              <SelectItem
                key={t}
                startContent={
                  <span className="w-7 h-7 rounded-[8px] bg-warm-50 border border-warm-200 flex items-center justify-center text-[14px] flex-shrink-0">
                    {DISH_TYPE_EMOJI[t]}
                  </span>
                }
                classNames={{
                  base: "data-[selected=true]:bg-[#FFF1EB] data-[hover=true]:bg-warm-50 rounded-[10px]",
                  title: "font-semibold text-[13.5px]",
                }}
              >
                {t}
              </SelectItem>
            ))}
          </Select>

          <Input
            label={<>Dish Name<Req /></>}
            labelPlacement="outside" placeholder="Enter Dish Name"
            value={name} onValueChange={setName}
            variant="bordered"
            classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
          />

          <Input
            label="HS Code" labelPlacement="outside" placeholder="Enter HS Code eg. 121.1"
            value={hsCode} onValueChange={setHsCode}
            variant="bordered"
            classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
          />
        </div>

        {/* dish photo + prep time */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-end">
          <div className="flex flex-col gap-2">
            <span className={labelCx}>Dish Photo</span>
            <button className="w-full flex items-center gap-3 h-11 px-3 rounded-[10px] border border-warm-200 bg-warm-50 hover:bg-warm-100 transition-colors text-left">
              <UploadCloud size={16} color="#8A7D72" />
              <span className="text-[13px] text-warm-500 font-medium">Click here to upload your image</span>
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <span className={labelCx}>Preparation Time</span>
            <div className="flex items-center gap-2">
              <Input
                aria-label="Hours" placeholder="0 hrs" type="number"
                value={prepHrs} onValueChange={setPrepHrs}
                variant="bordered"
                classNames={{ base: "w-[110px]", inputWrapper: wrapCx, input: `${inputCx} text-right tnum` }}
              />
              <span className="text-warm-500 font-bold">:</span>
              <Input
                aria-label="Minutes" placeholder="0 min" type="number"
                value={prepMin} onValueChange={setPrepMin}
                variant="bordered"
                classNames={{ base: "w-[110px]", inputWrapper: wrapCx, input: `${inputCx} text-right tnum` }}
              />
            </div>
          </div>
        </div>

        {/* menu: sub-menu + category */}
        <div>
          <h3 className="text-[13px] font-extrabold text-ink mb-3">Menu:</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Select
              label={<>Sub-Menu<Req /></>} labelPlacement="outside"
              placeholder="Select Sub-Menu"
              selectedKeys={subMenu ? [subMenu] : []}
              onSelectionChange={(k) => {
                const v = Array.from(k)[0] as string;
                if (v === "__create_sub_menu__") setOpenSubMenuModal(true);
                else setSubMenu(v ?? "");
              }}
              variant="bordered" radius="md"
              classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
            >
              <>
                {subMenus.map((sm) => <SelectItem key={sm}>{sm}</SelectItem>)}
                <SelectItem
                  key="__create_sub_menu__"
                  startContent={<Plus size={14} color={ORANGE} strokeWidth={2.4} />}
                  className="text-[#F15022] font-bold"
                >
                  Create Sub-Menu
                </SelectItem>
              </>
            </Select>

            <Select
              label={<>Category<Req /></>} labelPlacement="outside"
              placeholder="Select Category"
              selectedKeys={category ? [category] : []}
              onSelectionChange={(k) => {
                const v = Array.from(k)[0] as string;
                if (v === "__create_category__") setOpenCategoryModal(true);
                else setCategory(v ?? "");
              }}
              variant="bordered" radius="md"
              classNames={{ label: labelCx, trigger: wrapCx, value: inputCx }}
            >
              <>
                {categories.map((c) => <SelectItem key={c}>{c}</SelectItem>)}
                <SelectItem
                  key="__create_category__"
                  startContent={<Plus size={14} color={ORANGE} strokeWidth={2.4} />}
                  className="text-[#F15022] font-bold"
                >
                  Create Category
                </SelectItem>
              </>
            </Select>
          </div>
        </div>

        {/* default price card */}
        <div>
          <h3 className="text-[13px] font-extrabold text-ink mb-3">Default Price:</h3>
          <div className="border border-warm-200 rounded-[14px] p-4">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-3 items-end">
              <Input
                label={<>Actual Price<Req /></>} labelPlacement="outside"
                placeholder="0" type="number"
                value={actualPrice} onValueChange={setActualPrice}
                startContent={<span className="text-[13px] text-warm-500 font-semibold">Rs</span>}
                variant="bordered"
                classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }}
              />
              <Input
                label="Discount" labelPlacement="outside"
                placeholder="0" type="number"
                value={discount} onValueChange={setDiscount}
                startContent={<span className="text-[13px] text-warm-500 font-semibold">Rs</span>}
                variant="bordered"
                classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }}
              />
              <Button size="sm" variant="bordered" radius="md"
                className="h-10 border border-[#E6E1DC] bg-white font-semibold text-warm-700 text-[12.5px]"
                startContent={<Plus size={14} color="#6B5F55" strokeWidth={2.4} />}>
                Add Variant
              </Button>
            </div>
            <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4 text-[12.5px]">
                <span className="text-warm-600">Listed Price: <span className="font-bold text-ink tnum">Rs {listedPrice.toFixed(2)}</span></span>
                <span className="text-warm-600">COGS: <span className="font-bold text-ink tnum">Rs {cogs}</span></span>
                <span className="font-bold tnum" style={{ color: "#15803D" }}>Gross Profit: Rs {grossProfit.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setOpenStockModal(true)}
                className="inline-flex items-center gap-2 h-8 px-3 rounded-[9px] border text-[12.5px] font-bold transition-colors"
                style={{ background: "#FFF1EB", borderColor: "#F8C9B6", color: ORANGE }}>
                Setup stock consumption
                <Pencil size={13} color={ORANGE} />
              </button>
            </div>
          </div>
        </div>

        {/* add-ons */}
        <div>
          <h3 className="text-[13px] font-extrabold text-ink mb-3">Add-Ons / Extras:</h3>
          {selectedAddons.size === 0 ? (
            <button
              onClick={() => setOpenAddonsDrawer(true)}
              className="w-full border-[1.5px] border-dashed rounded-[12px] px-4 py-4 flex items-start gap-3 text-left hover:bg-warm-50 transition-colors"
              style={{ borderColor: "#F8C9B6", background: "#FFF6F2" }}
            >
              <span className="text-[10.5px] font-extrabold uppercase tracking-[0.04em] px-[7px] py-[2px] rounded-md flex-shrink-0"
                style={{ background: "#F4EFEB", color: "#6B5F55" }}>New</span>
              <div className="flex-1">
                <div className="text-[13.5px] font-bold text-ink">Add-Ons!! Click Here</div>
                <div className="text-[12.5px] text-warm-600 mt-[2px]">
                  Provide your customers with the option to add-ons and make their next meal super delicious!
                </div>
              </div>
            </button>
          ) : (
            <div className="border border-warm-200 rounded-[12px] p-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-wrap gap-[6px]">
                {addons.filter((a) => selectedAddons.has(a.id)).map((a) => (
                  <span key={a.id}
                    className="inline-flex items-center gap-2 px-[10px] py-[5px] rounded-md text-[12px] font-semibold bg-warm-100 text-warm-700">
                    {a.name}
                    <span className="text-warm-500 tnum">Rs {a.price}</span>
                  </span>
                ))}
              </div>
              <Button size="sm" variant="bordered" radius="md"
                className="h-8 border border-[#E6E1DC] bg-white text-warm-700 text-[12px] font-semibold"
                startContent={<Pencil size={12} color="#6B5F55" />}
                onPress={() => setOpenAddonsDrawer(true)}>
                Manage
              </Button>
            </div>
          )}
        </div>

        {/* description */}
        <div>
          <h3 className="text-[13px] font-extrabold text-ink mb-2">Description:</h3>
          <Textarea
            aria-label="Description" placeholder="Describe the dish, ingredients, allergens…"
            minRows={4} maxLength={600}
            value={description} onValueChange={setDescription}
            variant="bordered"
            classNames={{ inputWrapper: `${wrapCx} h-auto min-h-[110px]`, input: inputCx }}
          />
        </div>
      </div>

      {/* footer */}
      <div className="flex items-center justify-end gap-3 flex-wrap">
        <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={reset}>Reset</Button>
        <Button
          radius="md"
          isDisabled={!valid}
          className="font-bold disabled:opacity-100"
          style={{
            background: valid ? "#F15022" : "#EFE8E2",
            color: valid ? "#fff" : "#B7A99E",
            boxShadow: valid ? "0 2px 8px rgba(241,80,34,0.32)" : "none",
          }}
          onPress={() => save(false)}>
          Save Dish
        </Button>
        <Button
          radius="md"
          variant="bordered"
          isDisabled={!valid}
          className="font-bold border disabled:opacity-100"
          style={{
            background: valid ? "#FFF1EB" : "#F4EFEB",
            color: valid ? "#F15022" : "#B7A99E",
            borderColor: valid ? "#F8C9B6" : "#E6E1DC",
          }}
          onPress={() => save(true)}>
          Save and Create Another
        </Button>
      </div>

      {/* Add Sub-Menu modal */}
      {openSubMenuModal && (
        <AddSubMenuModal
          onClose={() => setOpenSubMenuModal(false)}
          onSave={(name) => { setSubMenus((p) => [...p, name]); setSubMenu(name); setOpenSubMenuModal(false); }}
        />
      )}
      {openCategoryModal && (
        <AddSubMenuModal
          title="Add Category" nameLabel="Category Name" saveLabel="Save Category"
          onClose={() => setOpenCategoryModal(false)}
          onSave={(name) => { setCategories((p) => [...p, name]); setCategory(name); setOpenCategoryModal(false); }}
        />
      )}

      {/* Add-Ons drawer */}
      {openAddonsDrawer && (
        <AddonsDrawer
          addons={addons}
          selected={selectedAddons}
          onToggle={(id) => setSelectedAddons((p) => {
            const n = new Set(p);
            if (n.has(id)) n.delete(id); else n.add(id);
            return n;
          })}
          onClose={() => setOpenAddonsDrawer(false)}
          onNewAddon={() => setOpenNewAddonModal(true)}
        />
      )}

      {openNewAddonModal && (
        <NewAddonModal
          onClose={() => setOpenNewAddonModal(false)}
          onSave={(a) => {
            const id = Math.max(0, ...addons.map((x) => x.id)) + 1;
            setAddons((p) => [...p, { ...a, id, used: 0 }]);
            setSelectedAddons((p) => new Set(p).add(id));
            setOpenNewAddonModal(false);
          }}
        />
      )}

      {openStockModal && (
        <StockConsumptionModal
          rows={stockRows}
          setRows={setStockRows}
          onClose={() => setOpenStockModal(false)}
          onSave={() => setOpenStockModal(false)}
        />
      )}
    </div>
  );
}

/* ── Add Sub-Menu / Category modal ────────────────────────────── */
function AddSubMenuModal({
  title = "Add Sub-Menu",
  nameLabel = "Sub-Menu Name",
  saveLabel = "Save Sub Menu",
  onClose, onSave,
}: {
  title?: string;
  nameLabel?: string;
  saveLabel?: string;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const valid = name.trim().length > 0;
  return (
    <ModalShell
      title={title} size="lg" onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600" onPress={() => setName("")}>Reset</Button>
          <ModalFooterButtons onCancel={onClose} onConfirm={() => onSave(name.trim())} confirmLabel={saveLabel} disabled={!valid} />
        </div>
      }
    >
      <Input
        autoFocus
        label={<>{nameLabel}<Req /></>}
        labelPlacement="outside" placeholder={`Enter ${nameLabel}`}
        size="sm" variant="bordered" value={name} onValueChange={setName}
        classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
      />
      <div className="flex flex-col gap-2">
        <span className={labelCx}>Photo</span>
        <button className="w-full flex items-center gap-3 h-11 px-3 rounded-[10px] border border-warm-200 bg-warm-50 hover:bg-warm-100 transition-colors text-left">
          <UploadCloud size={16} color="#8A7D72" />
          <span className="text-[13px] text-warm-500 font-medium">Click here to upload your image</span>
        </button>
      </div>
    </ModalShell>
  );
}

/* ── Add-Ons drawer (selectable list + New Addon) ──────────────── */
function AddonsDrawer({
  addons, selected, onToggle, onClose, onNewAddon,
}: {
  addons: LocalAddon[];
  selected: Set<number>;
  onToggle: (id: number) => void;
  onClose: () => void;
  onNewAddon: () => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () => addons.filter((a) => a.name.toLowerCase().includes(search.trim().toLowerCase())),
    [addons, search],
  );

  return (
    <Drawer isOpen onClose={onClose} placement="right" size="md"
      classNames={{ base: "sm:max-w-[460px]", closeButton: "hidden" }}>
      <DrawerContent>
        <DrawerHeader className="flex items-center gap-2 border-b border-warm-200">
          <span className="flex-1 text-[17px] font-extrabold text-ink tracking-[-0.02em]">Selected Add-Ons</span>
          <Button size="sm" radius="md"
            className="h-9 text-white font-bold"
            style={{ background: ORANGE, boxShadow: "0 2px 8px rgba(241,80,34,0.32)" }}
            startContent={<Plus size={14} color="#fff" strokeWidth={2.4} />}
            onPress={onNewAddon}>
            New Addon
          </Button>
          <Button isIconOnly size="sm" variant="bordered" radius="md"
            className="w-[34px] h-[34px] min-w-[34px] border border-[#E6E1DC] bg-white"
            onPress={onClose}>
            <X size={16} color="#8A7D72" />
          </Button>
        </DrawerHeader>
        <DrawerBody className="px-5 gap-3">
          <Input
            size="sm" radius="md" placeholder="Search"
            value={search} onValueChange={setSearch}
            startContent={<Search size={15} color="#B0A69E" />}
            classNames={{ inputWrapper: "bg-white border border-[#E6E1DC] h-10 shadow-none", input: inputCx }}
          />
          <div className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-warm-500">Add-Ons</div>
          <div className="flex flex-col gap-2">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-[13px] text-warm-500 font-medium">No add-ons match.</div>
            ) : filtered.map((a) => {
              const on = selected.has(a.id);
              return (
                <label key={a.id}
                  className="flex items-center gap-3 border border-warm-200 rounded-[12px] px-3 py-[10px] cursor-pointer hover:bg-warm-50"
                  style={{ background: on ? "#FFF6F2" : "#fff", borderColor: on ? "#F8C9B6" : "#E6E1DC" }}>
                  <Checkbox isSelected={on} onValueChange={() => onToggle(a.id)} size="md"
                    classNames={{ wrapper: on ? "after:bg-[#F15022]" : undefined }} />
                  <span className="w-9 h-9 rounded-[8px] bg-warm-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-bold text-ink truncate">{a.name}</div>
                    <div className="text-[11.5px] text-warm-500">Used In: {a.used} Dishes</div>
                  </div>
                  <span className="text-[13px] font-bold text-ink tnum">Rs {a.price}</span>
                </label>
              );
            })}
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

/* ── New Addon modal ───────────────────────────────────────────── */
function NewAddonModal({
  onClose, onSave,
}: { onClose: () => void; onSave: (a: { name: string; price: number }) => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const valid = name.trim().length > 0 && Number(price) >= 0;
  return (
    <ModalShell
      title="Add New Add-On" size="lg" onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3 w-full">
          <Button variant="light" radius="md" className="font-semibold text-warm-600"
            onPress={() => { setName(""); setPrice(""); }}>Reset</Button>
          <ModalFooterButtons onCancel={onClose} onConfirm={() => onSave({ name: name.trim(), price: Number(price) })}
            confirmLabel="Save Add-On" disabled={!valid} />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          autoFocus
          label={<>Add-On Name<Req /></>}
          labelPlacement="outside" placeholder="e.g. Extra Cheese"
          size="sm" variant="bordered" value={name} onValueChange={setName}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: inputCx }}
        />
        <Input
          label={<>Price<Req /></>}
          labelPlacement="outside" placeholder="0" type="number"
          size="sm" variant="bordered" value={price} onValueChange={setPrice}
          startContent={<span className="text-[13px] text-warm-500 font-semibold">Rs</span>}
          classNames={{ label: labelCx, inputWrapper: wrapCx, input: `${inputCx} tnum` }}
        />
      </div>
    </ModalShell>
  );
}

/* ── Stock Consumption modal ───────────────────────────────────── */
function StockConsumptionModal({
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


// Shared stock data + helpers (ported from the Plato "Stock Items" prototype).

export type StockGroup =
  | "Vegetable"
  | "Meat"
  | "Drinks"
  | "Beverage"
  | "Dairy"
  | "Pantry";

export type Unit = "kg" | "L" | "btl" | "pcs" | "g";

export interface StockItem {
  id: number;
  name: string;
  emoji: string;
  groups: string[];
  rate: string;
  rateNum: number;
  unit: Unit;
  opening: number;
  closing: number;
  value: string;
  valueNum: number;
  supplier: string;
}

export const ITEMS: StockItem[] = [
  { id: 1, name: "Lettuce",        emoji: "🥬", groups: ["Vegetable"],          rate: "Rs 200",   rateNum: 200,  unit: "kg",  opening: 60,  closing: 60,   value: "Rs 12,000", valueNum: 12000, supplier: "Fresh Farms" },
  { id: 2, name: "Tomato",         emoji: "🍅", groups: ["Vegetable"],          rate: "Rs 120",   rateNum: 120,  unit: "kg",  opening: 40,  closing: 32,   value: "Rs 3,840",  valueNum: 3840,  supplier: "Fresh Farms" },
  { id: 3, name: "Chicken Breast", emoji: "🍗", groups: ["Meat"],               rate: "Rs 850",   rateNum: 850,  unit: "kg",  opening: 25,  closing: 18.5, value: "Rs 15,725", valueNum: 15725, supplier: "Himalayan Meats" },
  { id: 4, name: "Coca Cola",      emoji: "🥤", groups: ["Drinks", "Beverage"], rate: "Rs 80",    rateNum: 80,   unit: "btl", opening: 120, closing: 98,   value: "Rs 7,840",  valueNum: 7840,  supplier: "Coca-Cola Co." },
  { id: 5, name: "Espresso Beans", emoji: "☕", groups: ["Drinks", "Pantry"],   rate: "Rs 1,200", rateNum: 1200, unit: "kg",  opening: 10,  closing: 2.1,  value: "Rs 2,520",  valueNum: 2520,  supplier: "Himalayan Roasters" },
  { id: 6, name: "Mozzarella",     emoji: "🧀", groups: ["Dairy"],              rate: "Rs 950",   rateNum: 950,  unit: "kg",  opening: 15,  closing: 6.4,  value: "Rs 6,080",  valueNum: 6080,  supplier: "Everest Dairy" },
  { id: 7, name: "Olive Oil",      emoji: "🫒", groups: ["Pantry"],             rate: "Rs 1,800", rateNum: 1800, unit: "L",   opening: 20,  closing: 14.5, value: "Rs 26,100", valueNum: 26100, supplier: "Mediterra Imports" },
  { id: 8, name: "Mineral Water",  emoji: "💧", groups: ["Drinks", "Beverage"], rate: "Rs 25",    rateNum: 25,   unit: "btl", opening: 200, closing: 152,  value: "Rs 3,800",  valueNum: 3800,  supplier: "Aqua Pure" },
  { id: 9, name: "Basmati Rice",   emoji: "🍚", groups: ["Pantry"],             rate: "Rs 180",   rateNum: 180,  unit: "kg",  opening: 50,  closing: 42,   value: "Rs 7,560",  valueNum: 7560,  supplier: "Annapurna Grains" },
];

export const ALL_GROUPS: string[] = [
  "Vegetable", "Meat", "Drinks", "Beverage", "Dairy", "Pantry",
];

export const UNITS: Unit[] = ["kg", "L", "btl", "pcs", "g"];

export const EMOJIS = ["🥬","🍅","🍗","🥩","🐟","🥚","🧀","🥛","🍚","🍞","🫒","🌶️","🧄","🧅","🥔","🥕","🍋","☕","🥤","💧","🍷","🍺"];

export type Status = "ok" | "watch" | "low";

// pct of opening remaining
export function pct(it: StockItem): number {
  if (!it.opening || it.opening <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((it.closing / it.opening) * 100)));
}

// status: ok >= 60, watch 35-59, low < 35
export function status(it: StockItem): Status {
  const p = pct(it);
  if (p < 35) return "low";
  if (p < 60) return "watch";
  return "ok";
}

export interface StatusStyle {
  fg: string;
  bg: string;
  bar: string;
  dot: string;
  label: string;
  chip: "success" | "warning" | "danger";
}

export const STATUS_COLOR: Record<Status, StatusStyle> = {
  ok:    { fg: "#15803D", bg: "#E7F6EC", bar: "#22C55E", dot: "#22C55E", label: "In stock",    chip: "success" },
  watch: { fg: "#B45309", bg: "#FEF3E2", bar: "#F59E0B", dot: "#F59E0B", label: "Running low", chip: "warning" },
  low:   { fg: "#C2410C", bg: "#FDECE4", bar: "#F15022", dot: "#F15022", label: "Reorder now", chip: "danger"  },
};

export const GROUP_COLOR: Record<string, string> = {
  Vegetable: "#16A34A",
  Meat:      "#E5484D",
  Drinks:    "#0EA5E9",
  Beverage:  "#0EA5E9",
  Pantry:    "#A16207",
  Dairy:     "#9B51E0",
};

export const ORANGE = "#F15022";

export const fmtMoney = (n: number) => "Rs " + n.toLocaleString();
export const fmtK = (n: number) =>
  n >= 1000 ? "Rs " + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : "Rs " + n;
export const fmtQty = (v: number, unit: string) =>
  `${Number.isInteger(v) ? v : v.toFixed(1)} ${unit}`;

export const STATUS_TABS: { k: "all" | Status; l: string }[] = [
  { k: "all", l: "All" },
  { k: "ok", l: "In stock" },
  { k: "watch", l: "Running low" },
  { k: "low", l: "Reorder" },
];

export const SORTS: { k: SortKey | null; l: string }[] = [
  { k: null, l: "Default" },
  { k: "name", l: "Name (A–Z)" },
  { k: "stock", l: "Stock level" },
  { k: "value", l: "Stock value" },
  { k: "rate", l: "Rate" },
];

export type SortKey = "name" | "rate" | "stock" | "value";

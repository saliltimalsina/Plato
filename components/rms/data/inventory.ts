// Simple inventory reference entities: measuring units, stock groups, stock history.

export interface MeasuringUnit {
  id: number;
  name: string;        // Unit Name
  symbol: string;      // Short Name
  type: "Weight" | "Volume" | "Count";
  description?: string;
}

export const MEASURING_UNITS: MeasuringUnit[] = [
  { id: 1, name: "Gram",       symbol: "g",   type: "Weight", description: "" },
  { id: 2, name: "Kilogram",   symbol: "kg",  type: "Weight", description: "" },
  { id: 3, name: "Pound",      symbol: "lb",  type: "Weight", description: "" },
  { id: 4, name: "Litre",      symbol: "ltr", type: "Volume", description: "" },
  { id: 5, name: "Millilitre", symbol: "ml",  type: "Volume", description: "" },
  { id: 6, name: "Ounce",      symbol: "oz",  type: "Weight", description: "" },
  { id: 7, name: "Piece",      symbol: "pc",  type: "Count",  description: "" },
  { id: 8, name: "Packet",     symbol: "pkt", type: "Count",  description: "" },
];

export const UNIT_TYPES = ["Weight", "Volume", "Count"] as const;

export interface StockGroupRow {
  id: number;
  name: string;
  color: string;
  itemCount: number;
  description?: string;
}

export const STOCK_GROUPS: StockGroupRow[] = [
  { id: 1, name: "Drinks",    color: "#0EA5E9", itemCount: 1, description: "Includes soft drinks, fruit juices, energy drinks, flavored water, and a variety of hot and cold beverage options" },
  { id: 2, name: "Groceries", color: "#A16207", itemCount: 0, description: "Includes pantry staples like rice, flour, oils, spices, canned goods, and dry essentials" },
  { id: 3, name: "Meat",      color: "#E5484D", itemCount: 0, description: "Includes premium cuts of chicken, mutton, pork, and seafood items sourced from trusted suppliers" },
  { id: 4, name: "Others",    color: "#9B51E0", itemCount: 0, description: "Includes specialty items, cleaning supplies and remaining miscellaneous stock" },
  { id: 5, name: "Vegetable", color: "#16A34A", itemCount: 1, description: "Includes fresh leafy greens, root vegetables, and organic seasonal produce" },
];

export const GROUP_COLORS = ["#16A34A", "#E5484D", "#0EA5E9", "#9B51E0", "#A16207", "#F15022", "#1FA98B"];

export type MovementType = "Stock In" | "Stock Out" | "Opening" | "Adjustment";

export interface StockHistoryRow {
  id: number;
  date: string;
  item: string;
  type: MovementType;
  qty: string;
  balance: string;
  by: string;
}

export const STOCK_HISTORY: StockHistoryRow[] = [
  { id: 1, date: "2026-06-05", item: "Lettuce",        type: "Opening",    qty: "+60.00 kg",  balance: "60.00 kg",  by: "Salil Timalsina" },
  { id: 2, date: "2026-06-05", item: "Tomato",         type: "Opening",    qty: "+40.00 kg",  balance: "40.00 kg",  by: "Salil Timalsina" },
  { id: 3, date: "2026-06-06", item: "Tomato",         type: "Stock Out",  qty: "-8.00 kg",   balance: "32.00 kg",  by: "Kitchen" },
  { id: 4, date: "2026-06-06", item: "Chicken Breast", type: "Stock Out",  qty: "-6.50 kg",   balance: "18.50 kg",  by: "Kitchen" },
  { id: 5, date: "2026-06-07", item: "Mozzarella",     type: "Stock Out",  qty: "-8.60 kg",   balance: "6.40 kg",   by: "Kitchen" },
  { id: 6, date: "2026-06-07", item: "Coca Cola",      type: "Stock In",   qty: "+24 btl",    balance: "98 btl",    by: "Salil Timalsina" },
  { id: 7, date: "2026-06-08", item: "Espresso Beans", type: "Adjustment", qty: "-0.50 kg",   balance: "2.10 kg",   by: "Salil Timalsina" },
];

export const MOVEMENT_TONE: Record<MovementType, "success" | "danger" | "primary" | "neutral"> = {
  "Stock In": "success",
  "Stock Out": "danger",
  Opening: "primary",
  Adjustment: "neutral",
};

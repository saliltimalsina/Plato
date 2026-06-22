/* ── Orders mock data ─────────────────────────────────────────── */

export interface OrderLine { name: string; qty: number }
export interface OpenOrder {
  id: number; table: string; type: string; placedAgo: string;
  lines: OrderLine[]; total: number; status: "Pending" | "Billed";
}

export const OPEN_ORDERS: OpenOrder[] = [
  {
    id: 1, table: "Cabin 1", type: "Dine In", placedAgo: "25 mins ago",
    lines: [{ name: "Chicken Pizza - Large", qty: 1 }, { name: "Water", qty: 1 }, { name: "Coke", qty: 1 }],
    total: 685, status: "Billed",
  },
  {
    id: 2, table: "Table 2", type: "Dine In", placedAgo: "12 mins ago",
    lines: [{ name: "Burger", qty: 2 }, { name: "Coke", qty: 2 }],
    total: 480, status: "Pending",
  },
  {
    id: 3, table: "Booth B", type: "Dine In", placedAgo: "8 mins ago",
    lines: [{ name: "Chicken Pizza - Medium", qty: 1 }, { name: "Iced Latte", qty: 2 }, { name: "Coffee", qty: 1 }],
    total: 790, status: "Pending",
  },
  {
    id: 4, table: "Cabin 2", type: "Dine In", placedAgo: "40 mins ago",
    lines: [{ name: "Coffee", qty: 3 }, { name: "Burger", qty: 1 }],
    total: 570, status: "Billed",
  },
];

export interface Kot {
  id: number; type: string; table: string; orderBy: string; orderAt: string;
  dishes: OrderLine[]; status: "Pending" | "Preparing" | "Ready";
}

export const KOTS: Kot[] = [
  {
    id: 1, type: "Dine In", table: "Cabin 1", orderBy: "Salil Timalsina", orderAt: "22 Jun 2026 04:56 PM",
    dishes: [{ name: "Chicken Pizza - Large", qty: 1 }, { name: "Water", qty: 1 }, { name: "Coke", qty: 1 }],
    status: "Pending",
  },
  {
    id: 2, type: "Dine In", table: "Table 2", orderBy: "Salil Timalsina", orderAt: "22 Jun 2026 05:10 PM",
    dishes: [{ name: "Burger", qty: 2 }, { name: "Coke", qty: 2 }],
    status: "Preparing",
  },
  {
    id: 3, type: "Dine In", table: "Booth B", orderBy: "Bibek Gurung", orderAt: "22 Jun 2026 05:14 PM",
    dishes: [{ name: "Chicken Pizza - Medium", qty: 1 }, { name: "Iced Latte", qty: 2 }, { name: "Coffee", qty: 1 }],
    status: "Ready",
  },
];

export const ORDER_TYPES = [
  { key: "dine-in",   label: "Dine In order" },
  { key: "delivery",  label: "Delivery order" },
  { key: "reservation", label: "Reservation" },
  { key: "takeaway",  label: "Take away" },
  { key: "pickup",    label: "Pick up" },
  { key: "quick",     label: "Quick billing" },
];

export const STAFF_LIST = [
  { id: 1, fullName: "Salil Timalsina", userName: "saliltimalsina" },
];

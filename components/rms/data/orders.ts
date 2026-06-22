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

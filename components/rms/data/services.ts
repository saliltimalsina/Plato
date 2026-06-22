/* ── Services mock data ───────────────────────────────────────── */

export const ACTIVE_MENUSETS = ["Default Menuset", "Lunch Menu", "Dinner Menu"];

export interface ToggleDef { key: string; title: string; description: string; default: boolean }

export const DINE_IN_OTHERS: ToggleDef[] = [
  { key: "viewInvoice", title: "View Invoice", description: "Customer can view invoice, they will see final amount of their orders too.", default: true },
  { key: "viewKot", title: "View KOT", description: "Customer can view KOT, they can't see the amount of orders. Only see number of items.", default: true },
  { key: "checkIn", title: "Check-In", description: "While creating order you can add check-in option for dine-in customers details.", default: true },
  { key: "orderConfirm", title: "Require Order Confirmation", description: "If you enable this, you will have to confirm order before it goes to kitchen.", default: true },
];

export const DELIVERY_OTHERS: ToggleDef[] = [
  { key: "viewInvoice", title: "View Invoice", description: "Customer can view invoice, they will see final amount of their orders too.", default: true },
  { key: "viewKot", title: "View KOT", description: "Customer can view KOT, they can't see the amount of orders. Only see number of items.", default: true },
  { key: "orderConfirm", title: "Require Order Confirmation", description: "If you enable this, you will have to confirm order before it goes to kitchen.", default: true },
  { key: "autoPrint", title: "Auto print Delivery Request", description: "If you enable this, delivery request will be printed automatically.", default: false },
  { key: "custReg", title: "Customer Registration", description: "If you enable this, customers can register themselves from Digital Menu.", default: true },
];

export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export interface DeliveryPartner { id: number; name: string; commission: number; locked?: boolean; active: boolean; color: string; abbr: string }
export const DELIVERY_PARTNERS: DeliveryPartner[] = [
  { id: 1, name: "Direct Order", commission: 0, locked: true, active: true, color: "#1A1A1A", abbr: "DO" },
  { id: 2, name: "Website",      commission: 0, locked: true, active: true, color: "#E11D2A", abbr: "RX" },
  { id: 3, name: "FoodMandu",    commission: 0, active: false, color: "#F4C400", abbr: "FM" },
  { id: 4, name: "Pathao Food",  commission: 0, active: false, color: "#E11D2A", abbr: "PF" },
];

export interface Rider { id: number; name: string; phone: string; role: string }
export const RIDERS: Rider[] = [
  { id: 1, name: "Salil Timalsina", phone: "977 9840171882", role: "Staff" },
];

export interface SmsEvent { id: number; event: string; status: boolean; description: string; message: string; consumption: number }
export const SMS_EVENTS: SmsEvent[] = [
  { id: 1, event: "Customer Birthday", status: true, description: "Birthday", message: "Happy Birthday, $name!", consumption: 0 },
  { id: 2, event: "Delivery Order Received", status: false, description: "New delivery order received - For Customer", message: "Hi $name, we got your order!", consumption: 0 },
  { id: 3, event: "Delivery Order Received", status: false, description: "New delivery order received - For Restaurant", message: "New delivery order from $name.", consumption: 0 },
  { id: 4, event: "Delivery Order Completed", status: false, description: "Delivery Order Completed", message: "Hi $name, your order has been delivered.", consumption: 0 },
];

export interface StampProgram {
  id: number; name: string; engagedUsers: number; stampsRequired: number;
  reward: string; expiresIn: string; description?: string; available: boolean;
}
export const STAMP_PROGRAMS: StampProgram[] = [
  { id: 1, name: "Loyuwa", engagedUsers: 0, stampsRequired: 10, reward: "asd", expiresIn: "20 days", description: "", available: true },
];

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
  { id: 2, name: "Bibek Gurung",    phone: "977 9812345678", role: "Rider" },
  { id: 3, name: "Anish Shrestha",  phone: "977 9803456789", role: "Rider" },
];

export interface SmsLog { id: number; mobile: string; name: string; carrier: string; message: string; rate: number; event: string; type: string; status: "Delivered" | "Failed" | "Pending"; sentAt: string }
export const SMS_LOGS: SmsLog[] = [
  { id: 1, mobile: "+977 9840171882", name: "Salil Timalsina", carrier: "Ncell",     message: "Happy Birthday, Salil!",            rate: 1.5, event: "Customer Birthday",       type: "Promotional", status: "Delivered", sentAt: "06-20-2026 09:12 AM" },
  { id: 2, mobile: "+977 9812345678", name: "Bibek Gurung",    carrier: "NTC",       message: "Hi Bibek, we got your order!",     rate: 1.5, event: "Delivery Order Received", type: "Transactional", status: "Delivered", sentAt: "06-19-2026 06:45 PM" },
  { id: 3, mobile: "+977 9803456789", name: "Anish Shrestha",  carrier: "Ncell",     message: "Your order has been delivered.",   rate: 1.5, event: "Delivery Order Completed", type: "Transactional", status: "Failed",    sentAt: "06-19-2026 07:30 PM" },
  { id: 4, mobile: "+977 9856781234", name: "Sita Rai",        carrier: "NTC",       message: "Flat 20% off this weekend!",       rate: 1.5, event: "Bulk SMS",               type: "Promotional", status: "Delivered", sentAt: "06-18-2026 11:00 AM" },
];

export interface SmsPurchase { id: number; user: string; amount: number; method: string; purchasedAt: string }
export const SMS_PURCHASES: SmsPurchase[] = [
  { id: 1, user: "Salil Timalsina", amount: 500, method: "eSewa",  purchasedAt: "06-15-2026 10:20 AM" },
  { id: 2, user: "Salil Timalsina", amount: 1000, method: "Khalti", purchasedAt: "06-01-2026 04:05 PM" },
];

export const SMS_STATS = { balance: 248.5, today: 12, yesterday: 8, totalTransactions: 1500 };

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
  { id: 1, name: "Coffee Lovers",    engagedUsers: 124, stampsRequired: 8,  reward: "Free Coffee",       expiresIn: "30 days", description: "Buy 8 coffees, get 1 free.", available: true },
  { id: 2, name: "Pizza Club",       engagedUsers: 86,  stampsRequired: 10, reward: "Free Garlic Bread", expiresIn: "60 days", description: "Earn a free garlic bread.",  available: true },
  { id: 3, name: "Weekend Brunch",   engagedUsers: 41,  stampsRequired: 6,  reward: "20% Off",           expiresIn: "14 days", description: "", available: false },
  { id: 4, name: "Loyalty Rewards",  engagedUsers: 203, stampsRequired: 12, reward: "Free Dessert",      expiresIn: "90 days", description: "Our flagship loyalty program.", available: true },
];

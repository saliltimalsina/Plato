export type DueDirection = "To Receive" | "To Pay" | "Settled";

export interface Supplier {
  id: number;
  name: string;
  initials: string;
  phone: string;
  dob: string;
  dueAmount: number;
  direction: DueDirection;
  email: string;
  address?: string;
  legalName?: string;
  taxNumber?: string;
  joined?: string;
}

export const SUPPLIERS: Supplier[] = [
  { id: 1, name: "Salil Timalsina", initials: "ST", phone: "+977 9840171882", dob: "1995-03-12", dueAmount: 1000, direction: "To Receive", email: "salil.timalsina@gmail.com" },
  { id: 2, name: "Priya Sharma",    initials: "PS", phone: "+977 9812345678", dob: "1988-07-24", dueAmount: 4500, direction: "To Pay",     email: "priya.sharma@outlook.com" },
  { id: 3, name: "Ramesh Thapa",    initials: "RT", phone: "+977 9823456789", dob: "1990-11-05", dueAmount: 2800, direction: "To Receive", email: "ramesh.thapa@gmail.com" },
  { id: 4, name: "Sunita Rai",      initials: "SR", phone: "+977 9834567890", dob: "-",          dueAmount: 0,    direction: "Settled",    email: "sunita.rai@yahoo.com" },
  { id: 5, name: "Bikash Gurung",   initials: "BG", phone: "+977 9845678901", dob: "1983-02-18", dueAmount: 7200, direction: "To Pay",     email: "bikash.gurung@business.np" },
  { id: 6, name: "Anita Karki",     initials: "AK", phone: "+977 9856789012", dob: "1992-09-30", dueAmount: 3150, direction: "To Receive", email: "anita.karki@gmail.com" },
  { id: 7, name: "Dipak Shrestha",  initials: "DS", phone: "+977 9867890123", dob: "1986-06-14", dueAmount: 0,    direction: "Settled",    email: "dipak.shrestha@supplierco.com" },
  { id: 8, name: "Manisha Pandey",  initials: "MP", phone: "+977 9878901234", dob: "1994-12-01", dueAmount: 600,  direction: "To Receive", email: "manisha.pandey@hotmail.com" },
];

export const DUE_DIRECTIONS: DueDirection[] = ["To Receive", "To Pay", "Settled"];

export const DIRECTION_TONE: Record<DueDirection, "success" | "danger" | "neutral"> = {
  "To Receive": "success",
  "To Pay": "danger",
  Settled: "neutral",
};

// Supplier detail: summary cards + transaction/activity/credit tabs
export interface SupplierTxn {
  id: number;
  txnNo: string;
  particular: string;
  txnType: string;
  amount: string;
  unpaid: string;
  date: string;
}

export const SUPPLIER_SUMMARY = [
  { label: "Total Purchase", value: "Rs 13,700", icon: "DollarSign", iconBg: "#E6F7F3", iconColor: "#1FA98B" },
  { label: "Purchase Return", value: "Rs 800", icon: "RotateCcw", iconBg: "#F3EEFF", iconColor: "#7C3AED" },
  { label: "Payment In", value: "Rs 10,000", icon: "ArrowDown", iconBg: "#E6F7F3", iconColor: "#1FA98B" },
  { label: "Payment Out", value: "Rs 0", icon: "ArrowUp", iconBg: "#FFF1EE", iconColor: "#F15022" },
];

export const SUPPLIER_TXNS: SupplierTxn[] = [
  { id: 1, txnNo: "PB-0002", particular: "Cooking Oil (20L)",   txnType: "Purchase Bill", amount: "Rs 3,200", unpaid: "Rs 3,200", date: "2025.09.05" },
  { id: 2, txnNo: "PB-0001", particular: "Vegetables — weekly", txnType: "Purchase Bill", amount: "Rs 5,400", unpaid: "Rs 0",     date: "2025.08.28" },
  { id: 3, txnNo: "PI-0003", particular: "Payment received",    txnType: "Payment In",    amount: "Rs 5,000", unpaid: "Rs 0",     date: "2025.08.20" },
  { id: 4, txnNo: "DN-0001", particular: "Damaged stock return", txnType: "Debit Note",   amount: "Rs 800",   unpaid: "Rs 0",     date: "2025.08.12" },
  { id: 5, txnNo: "PB-0000", particular: "Spices restock",      txnType: "Purchase Bill", amount: "Rs 2,100", unpaid: "Rs 0",     date: "2025.08.02" },
  { id: 6, txnNo: "PI-0002", particular: "Payment received",    txnType: "Payment In",    amount: "Rs 5,000", unpaid: "Rs 0",     date: "2025.07.25" },
  { id: 7, txnNo: "PB-0003", particular: "Dairy supply",        txnType: "Purchase Bill", amount: "Rs 3,000", unpaid: "Rs 0",     date: "2025.07.18" },
  { id: 8, txnNo: "PI-0001", particular: "Opening balance",     txnType: "Payment In",    amount: "Rs 0",     unpaid: "Rs 0",     date: "2025.07.01" },
];

export const SUPPLIER_ACTIVITY = [
  { id: 1, title: "Supplier created", at: "2026, June 05 · Salil Timalsina" },
  { id: 2, title: "Purchase Bill PB-0002 added", at: "2025, Sep 05 · Salil Timalsina" },
  { id: 3, title: "Payment received Rs 5,000", at: "2025, Aug 20 · Priya Yadav" },
];

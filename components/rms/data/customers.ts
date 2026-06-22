/* ── Customers mock data ──────────────────────────────────────── */

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;            // YYYY-MM-DD
  loyaltyDisc: number;    // percent
  dueAmount: number;      // >0 = to receive (Dr), <0 = to pay (Cr), 0 = settled
  group?: string;
}

export const CUSTOMER_GROUPS = ["Regular", "VIP", "Corporate", "Wholesale"];

export const CUSTOMERS_DATA: Customer[] = [
  { id: 1, name: "Salil Timalsina", email: "salil.timalsina@gmail.com", phone: "+977 9840171882", dob: "2013-06-22", loyaltyDisc: 10, dueAmount: 0,     group: "Regular" },
  { id: 2, name: "Sita Rai",        email: "sita.rai@gmail.com",        phone: "+977 9812345678", dob: "1995-03-14", loyaltyDisc: 5,  dueAmount: 1200,  group: "VIP" },
  { id: 3, name: "Anish Shrestha",  email: "anish.shrestha@gmail.com",  phone: "+977 9803456789", dob: "1990-11-02", loyaltyDisc: 0,  dueAmount: 0,     group: "Regular" },
  { id: 4, name: "Ramesh Karki",    email: "ramesh.karki@gmail.com",    phone: "+977 9856781234", dob: "1988-07-19", loyaltyDisc: 15, dueAmount: -800,  group: "Corporate" },
  { id: 5, name: "Gita Thapa",      email: "gita.thapa@gmail.com",      phone: "+977 9841122334", dob: "2000-01-30", loyaltyDisc: 8,  dueAmount: 450,   group: "Regular" },
];

/** today as MM-DD for "Today" birthday badge (app date 2026-06-22) */
export const TODAY_MMDD = "06-22";

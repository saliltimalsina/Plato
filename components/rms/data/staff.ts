export type Role = "kitchen" | "billing" | "server" | "admin";
export type StaffStatus = "active" | "pending";

export interface Staff {
  id: number;
  name: string;
  initials: string;
  role: Role;
  position: string;
  phone: string;
  email: string;
  status: StaffStatus;
}

export const ROLE_CONFIG: Record<Role, { label: string; color: string; tone: "warning" | "primary" | "secondary" | "success" }> = {
  kitchen: { label: "Kitchen", color: "#F59E0B", tone: "warning" },
  billing: { label: "Billing", color: "#0EA5E9", tone: "primary" },
  server:  { label: "Server", color: "#22C55E", tone: "success" },
  admin:   { label: "Super Admin", color: "#9B51E0", tone: "secondary" },
};

export const STAFF: Staff[] = [
  { id: 1, name: "Jaspreet Singh", initials: "JS", role: "kitchen", position: "Head",            phone: "+977 9178238912", email: "momo.snob@test.com",        status: "active" },
  { id: 2, name: "Priya Yadav",    initials: "PY", role: "billing", position: "Manager",         phone: "+977 9123456789", email: "priya.yadav@example.com",  status: "active" },
  { id: 3, name: "Ravi Kumar",     initials: "RK", role: "server",  position: "Sales Executive", phone: "+977 9182736450", email: "ravi.kumar@example.com",   status: "active" },
  { id: 4, name: "Sita Nepali",    initials: "SN", role: "admin",   position: "Assistant",       phone: "+977 9198765432", email: "sita.nepali@example.com",  status: "pending" },
  { id: 5, name: "Amit Sharma",    initials: "AS", role: "kitchen", position: "Sous Chef",       phone: "+977 9145623789", email: "amit.sharma@example.com",  status: "active" },
  { id: 6, name: "Meera Joshi",    initials: "MJ", role: "billing", position: "Cashier",         phone: "+977 9167892345", email: "meera.joshi@example.com",  status: "pending" },
];

export const ROLES: Role[] = ["kitchen", "billing", "server", "admin"];

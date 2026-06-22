/* ── Table & Space mock data ──────────────────────────────────── */

export type TableTypeName = "Table" | "Cabin" | "Booth" | "Counter" | "Outdoor";
export const TABLE_TYPES: TableTypeName[] = ["Table", "Cabin", "Booth", "Counter", "Outdoor"];

export type TableStatus = "Open" | "Occupied" | "Reserved";

export interface RestoTable {
  id: number;
  name: string;
  type: TableTypeName;
  space: string;        // space name, or "" when unassigned
  capacity: number;
  charge: number;       // 0 = no charge ("-")
  status: TableStatus;
  available: boolean;
}

export interface Space {
  id: number;
  name: string;
  description?: string;
}

/** max tables a plan allows — drives "3/50" KPI */
export const TABLE_LIMIT = 50;
/** max spaces a plan allows — drives "1/10" KPI */
export const SPACE_LIMIT = 10;

/** restaurant display name (used on QR cards) */
export const RESTAURANT_NAME = "Rwar";

export const SPACES: Space[] = [
  { id: 1, name: "Upstairs" },
];

export const TABLES: RestoTable[] = [
  { id: 1, name: "Cabin 1", type: "Cabin", space: "", capacity: 4, charge: 0, status: "Occupied", available: true },
  { id: 2, name: "Table 1", type: "Table", space: "", capacity: 4, charge: 0, status: "Open",     available: true },
  { id: 3, name: "Table 2", type: "Table", space: "", capacity: 4, charge: 0, status: "Open",     available: true },
];

/* derived helpers */
export const tablesInSpace = (tables: RestoTable[], spaceName: string) =>
  tables.filter((t) => t.space === spaceName);

export const spaceCapacity = (tables: RestoTable[], spaceName: string) =>
  tablesInSpace(tables, spaceName).reduce((sum, t) => sum + t.capacity, 0);

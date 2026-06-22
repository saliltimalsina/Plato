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
  { id: 1, name: "Ground Floor",    description: "Main dining hall near the entrance." },
  { id: 2, name: "Upstairs",        description: "Quieter floor with cabins and booths." },
  { id: 3, name: "Rooftop Terrace", description: "Open-air seating, best for evenings." },
  { id: 4, name: "Garden",          description: "Outdoor garden seating." },
];

export const TABLES: RestoTable[] = [
  { id: 1,  name: "Table 1",     type: "Table",   space: "Ground Floor",    capacity: 4, charge: 0,   status: "Open",     available: true },
  { id: 2,  name: "Table 2",     type: "Table",   space: "Ground Floor",    capacity: 2, charge: 0,   status: "Occupied", available: true },
  { id: 3,  name: "Table 3",     type: "Table",   space: "Ground Floor",    capacity: 6, charge: 0,   status: "Open",     available: true },
  { id: 4,  name: "Counter 1",   type: "Counter", space: "Ground Floor",    capacity: 2, charge: 0,   status: "Open",     available: true },
  { id: 5,  name: "Cabin 1",     type: "Cabin",   space: "Ground Floor",    capacity: 4, charge: 200, status: "Occupied", available: true },
  { id: 6,  name: "Cabin 2",     type: "Cabin",   space: "Upstairs",        capacity: 6, charge: 300, status: "Reserved", available: true },
  { id: 7,  name: "Booth A",     type: "Booth",   space: "Upstairs",        capacity: 4, charge: 150, status: "Open",     available: true },
  { id: 8,  name: "Booth B",     type: "Booth",   space: "Upstairs",        capacity: 4, charge: 150, status: "Occupied", available: true },
  { id: 9,  name: "Terrace 1",   type: "Outdoor", space: "Rooftop Terrace", capacity: 8, charge: 0,   status: "Open",     available: true },
  { id: 10, name: "Terrace 2",   type: "Outdoor", space: "Rooftop Terrace", capacity: 8, charge: 0,   status: "Open",     available: false },
  { id: 11, name: "Garden 1",    type: "Outdoor", space: "Garden",          capacity: 6, charge: 0,   status: "Open",     available: true },
  { id: 12, name: "Bar Counter", type: "Counter", space: "",                capacity: 3, charge: 0,   status: "Open",     available: true },
];

/* derived helpers */
export const tablesInSpace = (tables: RestoTable[], spaceName: string) =>
  tables.filter((t) => t.space === spaceName);

export const spaceCapacity = (tables: RestoTable[], spaceName: string) =>
  tablesInSpace(tables, spaceName).reduce((sum, t) => sum + t.capacity, 0);

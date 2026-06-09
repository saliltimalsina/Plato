// Menu module shared data: dishes, categories, sub-menus, menu sets, addons, combo offers.

export type DishType = "Veg" | "Non-Veg" | "Egg" | "Vegan" | "-";

export interface DishVariant {
  id: number;
  name: string;
  price: number;        // sales price (Rs)
  strikePrice?: number; // original / MRP, shown struck through
  type: DishType;
  cogs?: number;        // cost of goods sold
  ingredients?: { id: number; name: string; qty: string; amount: string }[];
  transactions?: DishTxn[];
}

export interface DishTxn {
  id: number;
  date: string;     // e.g. "2026-06-08"
  time: string;     // e.g. "12:32 PM"
  orderNo: string;  // "#ORD-0012"
  qty: number;
  amount: number;
  staff: string;
  range: "Today" | "This Week" | "This Month" | "All Time";
}

export interface Dish {
  id: number;
  name: string;
  emoji: string;
  category: string;     // e.g. "Lunch", "Beverages"
  subMenu: string;      // e.g. "Food Menu", "Cafe Menu"
  type: DishType;       // overall type when single (else "-")
  prepTime?: string;    // e.g. "15m"
  kotType?: string;     // KOT category
  hsCode?: string;
  available: boolean;
  recommended?: boolean;
  variants: DishVariant[];
}

export const DISHES: Dish[] = [
  {
    id: 1, name: "Burger", emoji: "🍔",
    category: "Lunch", subMenu: "Food Menu", type: "-",
    prepTime: "12 min", kotType: "KOT", hsCode: "2106.90",
    available: true, recommended: true,
    variants: [
      {
        id: 1, name: "Chicken", type: "Non-Veg",
        price: 200, strikePrice: 220, cogs: 400,
        ingredients: [
          { id: 1, name: "Chicken Breast", qty: "0.18 kg", amount: "Rs 153" },
          { id: 2, name: "Lettuce",        qty: "0.05 kg", amount: "Rs 10" },
          { id: 3, name: "Tomato",         qty: "0.06 kg", amount: "Rs 7" },
          { id: 4, name: "Burger Bun",     qty: "1 pcs",   amount: "Rs 25" },
        ],
        transactions: [
          { id: 11, date: "2026-06-09", time: "12:32 PM", orderNo: "#ORD-0042", qty: 2, amount: 400, staff: "Salil Timalsina", range: "Today" },
          { id: 12, date: "2026-06-09", time: "01:18 PM", orderNo: "#ORD-0044", qty: 1, amount: 200, staff: "Priya Yadav",     range: "Today" },
          { id: 13, date: "2026-06-07", time: "07:21 PM", orderNo: "#ORD-0031", qty: 3, amount: 600, staff: "Bikash Gurung",   range: "This Week" },
          { id: 14, date: "2026-05-28", time: "12:55 PM", orderNo: "#ORD-0019", qty: 1, amount: 200, staff: "Salil Timalsina", range: "This Month" },
        ],
      },
      {
        id: 2, name: "Veg", type: "Veg",
        price: 180, cogs: 80,
        ingredients: [
          { id: 1, name: "Lettuce",      qty: "0.05 kg", amount: "Rs 10" },
          { id: 2, name: "Tomato",       qty: "0.08 kg", amount: "Rs 10" },
          { id: 3, name: "Mozzarella",   qty: "0.04 kg", amount: "Rs 38" },
          { id: 4, name: "Burger Bun",   qty: "1 pcs",   amount: "Rs 22" },
        ],
        transactions: [
          { id: 21, date: "2026-06-09", time: "11:48 AM", orderNo: "#ORD-0040", qty: 1, amount: 180, staff: "Priya Yadav",     range: "Today" },
          { id: 22, date: "2026-06-05", time: "01:02 PM", orderNo: "#ORD-0025", qty: 2, amount: 360, staff: "Salil Timalsina", range: "This Week" },
        ],
      },
      {
        id: 3, name: "Crunchy", type: "Veg",
        price: 250, cogs: 110,
        ingredients: [
          { id: 1, name: "Crispy Patty", qty: "0.12 kg", amount: "Rs 72" },
          { id: 2, name: "Lettuce",      qty: "0.04 kg", amount: "Rs 8" },
          { id: 3, name: "Mayo Sauce",   qty: "0.02 kg", amount: "Rs 5" },
          { id: 4, name: "Burger Bun",   qty: "1 pcs",   amount: "Rs 25" },
        ],
        transactions: [
          { id: 31, date: "2026-06-08", time: "08:11 PM", orderNo: "#ORD-0036", qty: 2, amount: 500, staff: "Bikash Gurung",   range: "This Week" },
          { id: 32, date: "2026-06-02", time: "07:42 PM", orderNo: "#ORD-0022", qty: 1, amount: 250, staff: "Salil Timalsina", range: "This Month" },
        ],
      },
    ],
  },
  {
    id: 2, name: "Chicken Pizza", emoji: "🍕",
    category: "Lunch", subMenu: "Food Menu", type: "Non-Veg",
    prepTime: "18 min", kotType: "KOT", hsCode: "1905.90",
    available: true, recommended: true,
    variants: [
      {
        id: 1, name: "Regular", type: "Non-Veg",
        price: 300, cogs: 160,
        ingredients: [
          { id: 1, name: "Pizza Base",     qty: "1 pcs",   amount: "Rs 60" },
          { id: 2, name: "Chicken Breast", qty: "0.10 kg", amount: "Rs 85" },
          { id: 3, name: "Mozzarella",    qty: "0.05 kg", amount: "Rs 48" },
          { id: 4, name: "Tomato",        qty: "0.08 kg", amount: "Rs 10" },
        ],
        transactions: [
          { id: 1, date: "2026-06-09", time: "01:05 PM", orderNo: "#ORD-0043", qty: 1, amount: 300, staff: "Salil Timalsina", range: "Today" },
          { id: 2, date: "2026-06-05", time: "07:24 PM", orderNo: "#ORD-0027", qty: 2, amount: 600, staff: "Bikash Gurung",   range: "This Week" },
        ],
      },
      {
        id: 2, name: "Large", type: "Non-Veg",
        price: 600, cogs: 280,
        ingredients: [
          { id: 1, name: "Pizza Base",     qty: "1 pcs",   amount: "Rs 110" },
          { id: 2, name: "Chicken Breast", qty: "0.20 kg", amount: "Rs 170" },
          { id: 3, name: "Mozzarella",    qty: "0.10 kg", amount: "Rs 95" },
        ],
        transactions: [
          { id: 1, date: "2026-06-08", time: "08:33 PM", orderNo: "#ORD-0037", qty: 1, amount: 600, staff: "Priya Yadav", range: "This Week" },
        ],
      },
    ],
  },
  {
    id: 3, name: "Iced Latte", emoji: "🧋",
    category: "Beverages", subMenu: "Cafe Menu", type: "Veg",
    prepTime: "4 min", kotType: "BOT",
    available: true,
    variants: [
      {
        id: 1, name: "Standard", type: "Veg",
        price: 180, cogs: 65,
        ingredients: [
          { id: 1, name: "Espresso Beans", qty: "0.018 kg", amount: "Rs 22" },
          { id: 2, name: "Mineral Water",  qty: "0.25 btl", amount: "Rs 6" },
        ],
        transactions: [
          { id: 1, date: "2026-06-09", time: "10:11 AM", orderNo: "#ORD-0039", qty: 2, amount: 360, staff: "Priya Yadav",     range: "Today" },
          { id: 2, date: "2026-06-04", time: "04:24 PM", orderNo: "#ORD-0024", qty: 1, amount: 180, staff: "Salil Timalsina", range: "This Week" },
        ],
      },
    ],
  },
  {
    id: 4, name: "Coffee", emoji: "☕",
    category: "Beverages", subMenu: "Cafe Menu", type: "Veg",
    prepTime: "3 min", kotType: "BOT",
    available: true,
    variants: [
      {
        id: 1, name: "Standard", type: "Veg",
        price: 130, cogs: 38,
        ingredients: [
          { id: 1, name: "Espresso Beans", qty: "0.015 kg", amount: "Rs 18" },
        ],
        transactions: [
          { id: 1, date: "2026-06-09", time: "09:42 AM", orderNo: "#ORD-0038", qty: 3, amount: 390, staff: "Salil Timalsina", range: "Today" },
        ],
      },
    ],
  },
  {
    id: 5, name: "Water", emoji: "💧",
    category: "Beverages", subMenu: "Cafe Menu", type: "Veg",
    prepTime: "—", kotType: "BOT",
    available: true,
    variants: [
      {
        id: 1, name: "Bottle", type: "Veg",
        price: 25, cogs: 12,
        ingredients: [{ id: 1, name: "Mineral Water", qty: "1 btl", amount: "Rs 12" }],
        transactions: [
          { id: 1, date: "2026-06-09", time: "12:14 PM", orderNo: "#ORD-0041", qty: 4, amount: 100, staff: "Bikash Gurung",  range: "Today" },
        ],
      },
    ],
  },
  {
    id: 6, name: "Coke", emoji: "🥤",
    category: "Beverages", subMenu: "Cafe Menu", type: "Veg",
    prepTime: "—", kotType: "BOT",
    available: true,
    variants: [
      {
        id: 1, name: "Bottle", type: "Veg",
        price: 60, cogs: 32,
        ingredients: [{ id: 1, name: "Coca Cola", qty: "1 btl", amount: "Rs 32" }],
        transactions: [
          { id: 1, date: "2026-06-09", time: "01:22 PM", orderNo: "#ORD-0045", qty: 2, amount: 120, staff: "Priya Yadav",  range: "Today" },
          { id: 2, date: "2026-06-06", time: "08:11 PM", orderNo: "#ORD-0030", qty: 5, amount: 300, staff: "Bikash Gurung", range: "This Week" },
        ],
      },
    ],
  },
];

export const DISH_TYPE_COLOR: Record<DishType, string> = {
  "Veg":     "#16A34A",
  "Non-Veg": "#E5484D",
  "Egg":     "#F59E0B",
  "Vegan":   "#1FA98B",
  "-":       "#B7A99E",
};

/* helpers */
export function priceLabel(d: Dish): string {
  const ps = d.variants.map((v) => v.price);
  if (ps.length === 0) return "—";
  const min = Math.min(...ps), max = Math.max(...ps);
  return min === max ? `Rs ${min}` : `Rs ${min} - Rs ${max}`;
}

/* ── categories ───────────────────────────────────────────────── */
export interface Category {
  id: number;
  name: string;
  dishCount: number;
  description?: string;
}
export const CATEGORIES: Category[] = [
  { id: 1, name: "Lunch",     dishCount: 2, description: "Mid-day mains served 11am – 3pm; quick service portions." },
  { id: 2, name: "Beverages", dishCount: 4, description: "Hot coffees, iced drinks, sodas and bottled water." },
  { id: 3, name: "Breakfast", dishCount: 3, description: "Morning plates and platters available 7am – 11am." },
  { id: 4, name: "Dinner",    dishCount: 5, description: "Evening dine-in service with chef specials." },
  { id: 5, name: "Desserts",  dishCount: 4, description: "Cakes, pastries and house-made ice creams." },
  { id: 6, name: "Snacks",    dishCount: 6, description: "Light bites and small plates for any hour." },
  { id: 7, name: "Soups",     dishCount: 3, description: "Daily soups, broths and starters." },
];

/* ── sub-menus ────────────────────────────────────────────────── */
export interface SubMenu {
  id: number;
  name: string;
  dishCount: number;
  description?: string;
}
export const SUB_MENUS: SubMenu[] = [
  { id: 1, name: "Food Menu",      dishCount: 2,  description: "Main food service menu — lunch + dinner mains." },
  { id: 2, name: "Cafe Menu",      dishCount: 4,  description: "Coffee bar, espresso drinks and bottled beverages." },
  { id: 3, name: "Bar Menu",       dishCount: 8,  description: "Cocktails, beer and shareable bar snacks." },
  { id: 4, name: "Kids Menu",      dishCount: 5,  description: "Smaller portions and milder spice for young guests." },
  { id: 5, name: "Weekend Brunch", dishCount: 7,  description: "Saturday + Sunday 9am – 1pm brunch specials." },
];

/* ── menu sets ────────────────────────────────────────────────── */
export interface MenuSet {
  id: number;
  name: string;
  dishCount: number;
  description?: string;
}
export const MENU_SETS: MenuSet[] = [
  { id: 1, name: "Lunch Buffet",     dishCount: 8,  description: "Mon–Fri 12pm – 3pm buffet line; flat pricing." },
  { id: 2, name: "Happy Hour",       dishCount: 5,  description: "5pm – 7pm drinks and bar bites at promo pricing." },
  { id: 3, name: "Festive Set",      dishCount: 12, description: "Seasonal multi-course set, available on holidays." },
  { id: 4, name: "Corporate Lunch",  dishCount: 6,  description: "Pre-orderable boxed lunch sets for offices." },
  { id: 5, name: "Family Combo",     dishCount: 9,  description: "Shareable platters portioned for 4–6 guests." },
];

/* ── add-ons & extras ─────────────────────────────────────────── */
export interface Addon {
  id: number;
  name: string;
  price: number;
  category?: string;
}
export const ADDONS: Addon[] = [
  { id: 1, name: "Extra Cheese",       price: 50,  category: "Topping" },
  { id: 2, name: "Garlic Bread",       price: 90,  category: "Side" },
  { id: 3, name: "Bacon Strips",       price: 120, category: "Topping" },
  { id: 4, name: "Jalapeños",          price: 35,  category: "Topping" },
  { id: 5, name: "French Fries",       price: 110, category: "Side" },
  { id: 6, name: "Onion Rings",        price: 130, category: "Side" },
  { id: 7, name: "Mushroom Sauté",     price: 80,  category: "Topping" },
  { id: 8, name: "BBQ Dip",            price: 25,  category: "Sauce" },
  { id: 9, name: "Sriracha Mayo",      price: 25,  category: "Sauce" },
  { id: 10, name: "Truffle Oil Drizzle", price: 150, category: "Premium" },
  { id: 11, name: "Avocado Slices",    price: 95,  category: "Topping" },
  { id: 12, name: "Vanilla Ice Cream Scoop", price: 70, category: "Dessert" },
];

/* ── combo offers ─────────────────────────────────────────────── */
export interface Combo {
  id: number;
  name: string;
  price: number;
  items: number;
  description?: string;
}
export const COMBOS: Combo[] = [
  { id: 1, name: "Burger + Coke",       price: 220,  items: 2, description: "Any burger variant + 1 chilled Coke bottle." },
  { id: 2, name: "Pizza Party",         price: 850,  items: 3, description: "1 large pizza + 2 sides of your choice." },
  { id: 3, name: "Cafe Breakfast",      price: 320,  items: 3, description: "Coffee + croissant + fruit bowl, served 8–11am." },
  { id: 4, name: "Family Feast",        price: 1450, items: 6, description: "2 mains, 2 sides, 2 drinks; serves 3–4 guests." },
  { id: 5, name: "Date Night",          price: 1100, items: 4, description: "2 mains + 2 desserts; valid Mon–Thu evenings." },
  { id: 6, name: "Kids Meal",           price: 250,  items: 3, description: "Small main + juice + scoop of ice cream." },
  { id: 7, name: "Office Lunch (×6)",   price: 1800, items: 6, description: "Six boxed lunches with same-day delivery." },
];

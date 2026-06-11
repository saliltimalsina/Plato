// Menu module shared data: dishes, categories, sub-menus, menu sets, addons, combo offers.

export type DishType =
  | "Veg" | "Non-Veg" | "Egg" | "Vegan"
  | "Spicy" | "Halal" | "Sugar Free" | "Gluten Free"
  | "-";

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
  "Veg":         "#16A34A",
  "Non-Veg":     "#E5484D",
  "Egg":         "#F59E0B",
  "Vegan":       "#1FA98B",
  "Spicy":       "#E5484D",
  "Halal":       "#0EA5E9",
  "Sugar Free":  "#0EA5E9",
  "Gluten Free": "#9B51E0",
  "-":           "#B7A99E",
};

export type DishTypeChoice = Exclude<DishType, "-">;
export const DISH_TYPES: DishTypeChoice[] = [
  "Veg", "Non-Veg", "Egg", "Vegan", "Spicy", "Halal", "Sugar Free", "Gluten Free",
];

export const DISH_TYPE_EMOJI: Record<Exclude<DishType, "-">, string> = {
  "Veg":         "🟢",
  "Non-Veg":     "🔴",
  "Egg":         "🥚",
  "Vegan":       "🌱",
  "Spicy":       "🌶️",
  "Halal":       "☪️",
  "Sugar Free":  "🩵",
  "Gluten Free": "🌾",
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
  emoji: string;
  dishCount: number;
  description?: string;
}
export const CATEGORIES: Category[] = [
  { id: 1, name: "Lunch",     emoji: "🍱", dishCount: 2, description: "Mid-day mains served 11am – 3pm; quick service portions." },
  { id: 2, name: "Beverages", emoji: "🥤", dishCount: 4, description: "Hot coffees, iced drinks, sodas and bottled water." },
  { id: 3, name: "Breakfast", emoji: "🍳", dishCount: 3, description: "Morning plates and platters available 7am – 11am." },
  { id: 4, name: "Dinner",    emoji: "🍽️", dishCount: 5, description: "Evening dine-in service with chef specials." },
  { id: 5, name: "Desserts",  emoji: "🍰", dishCount: 4, description: "Cakes, pastries and house-made ice creams." },
  { id: 6, name: "Snacks",    emoji: "🥨", dishCount: 6, description: "Light bites and small plates for any hour." },
  { id: 7, name: "Soups",     emoji: "🍲", dishCount: 3, description: "Daily soups, broths and starters." },
];

/* ── sub-menus ────────────────────────────────────────────────── */
export interface SubMenu {
  id: number;
  name: string;
  dishCount: number;
  description?: string;
}
export const SUB_MENUS: SubMenu[] = [
  { id: 1,  name: "Food Menu",        dishCount: 24, description: "Main food service menu — lunch + dinner mains." },
  { id: 2,  name: "Cafe Menu",        dishCount: 14, description: "Coffee bar, espresso drinks and bottled beverages." },
  { id: 3,  name: "Bar Menu",         dishCount: 18, description: "Cocktails, beer and shareable bar snacks." },
  { id: 4,  name: "Kids Menu",        dishCount: 8,  description: "Smaller portions and milder spice for young guests." },
  { id: 5,  name: "Weekend Brunch",   dishCount: 12, description: "Saturday + Sunday 9am – 1pm brunch specials." },
  { id: 6,  name: "Breakfast Menu",   dishCount: 11, description: "Weekday breakfast — 7am to 11am, eggs & toast plates." },
  { id: 7,  name: "Late Night Menu",  dishCount: 9,  description: "11pm – 2am limited menu for late-night service." },
  { id: 8,  name: "Banquet Menu",     dishCount: 22, description: "Private events, weddings, large-format catering." },
  { id: 9,  name: "Vegan Menu",       dishCount: 13, description: "Fully plant-based mains, sides and desserts." },
  { id: 10, name: "Gluten-Free Menu", dishCount: 7,  description: "Certified gluten-free kitchen-station offerings." },
  { id: 11, name: "Express Lunch",    dishCount: 6,  description: "15-minute prep guarantee for the lunch rush." },
  { id: 12, name: "Tasting Menu",     dishCount: 8,  description: "Chef-curated 7-course tasting — Thu–Sat dinner only." },
  { id: 13, name: "Dessert Menu",     dishCount: 10, description: "House-made cakes, pastries, ice creams and pairings." },
  { id: 14, name: "Wine List",        dishCount: 32, description: "Curated reds, whites, rosé and sparkling by the glass and bottle." },
  { id: 15, name: "Mocktail Menu",    dishCount: 9,  description: "Zero-proof cocktails and craft mixers." },
];

/* ── menu sets ────────────────────────────────────────────────── */
export interface MenuSet {
  id: number;
  name: string;
  dishCount: number;
  description?: string;
}
export const MENU_SETS: MenuSet[] = [
  { id: 1,  name: "Default Menuset",   dishCount: 24, description: "Standard pricing applied to dine-in and delivery services." },
  { id: 2,  name: "Lunch Buffet",      dishCount: 8,  description: "Mon–Fri 12pm – 3pm buffet line; flat pricing." },
  { id: 3,  name: "Happy Hour",        dishCount: 5,  description: "5pm – 7pm drinks and bar bites at promo pricing (-20%)." },
  { id: 4,  name: "Festive Set",       dishCount: 12, description: "Seasonal multi-course set, available on holidays (+15%)." },
  { id: 5,  name: "Corporate Lunch",   dishCount: 6,  description: "Pre-orderable boxed lunch sets for offices." },
  { id: 6,  name: "Family Combo",      dishCount: 9,  description: "Shareable platters portioned for 4–6 guests (-10%)." },
  { id: 7,  name: "Weekend Brunch",    dishCount: 11, description: "Sat–Sun 9am – 1pm brunch buffet, all-you-can-eat pricing." },
  { id: 8,  name: "Delivery Menuset",  dishCount: 18, description: "Delivery-only pricing — accounts for packaging cost (+8%)." },
  { id: 9,  name: "Aggregator Menuset",dishCount: 18, description: "Pricing markup for third-party delivery aggregators (+22%)." },
  { id: 10, name: "Banquet Set",       dishCount: 14, description: "Wedding and large-event pricing per head (Rs 1,200 / head)." },
  { id: 11, name: "Take Away Menuset", dishCount: 16, description: "Pickup pricing with 5% loyalty discount." },
  { id: 12, name: "Tasting Menu",      dishCount: 7,  description: "Fixed Rs 2,500 7-course chef's tasting menu." },
];

/* ── add-ons & extras ─────────────────────────────────────────── */
export interface Addon {
  id: number;
  name: string;
  price: number;
  emoji?: string;
  category?: string;
  type?: string;         // e.g. "Veg", "Non-Veg", "Uncategorized"
  cogs?: number;
  discount?: number;
  used?: number;         // # of dishes using this add-on
  available: boolean;
  description?: string;
}
export const ADDONS: Addon[] = [
  { id: 1,  name: "Extra Cheese",            emoji: "🧀",  price: 50,  category: "Topping", type: "Uncategorized", cogs: 20, available: true,  used: 7,  description: "House-shredded mozzarella + cheddar blend, melted to order." },
  { id: 2,  name: "Extra Mayonnaise",        emoji: "🥣",  price: 30,  category: "Sauce",   type: "Uncategorized", cogs: 10, available: true,  used: 12, description: "Classic creamy mayo, perfect for burgers and wraps." },
  { id: 3,  name: "French Fries",            emoji: "🍟",  price: 90,  category: "Side",    type: "Uncategorized", cogs: 35, available: true,  used: 18, description: "Hand-cut Idaho potatoes, double-fried for max crunch." },
  { id: 4,  name: "Honey",                   emoji: "🍯",  price: 20,  category: "Sweet",   type: "Uncategorized", cogs: 8,  available: true,  used: 3,  description: "Pure Himalayan wildflower honey, raw & unfiltered." },
  { id: 5,  name: "Sugar Syrup",             emoji: "🍶",  price: 20,  category: "Sweet",   type: "Uncategorized", cogs: 6,  available: true,  used: 1 },
  { id: 6,  name: "Bacon Strips",            emoji: "🥓",  price: 120, category: "Topping", type: "Non-Veg",       cogs: 70, available: true,  used: 5,  description: "Smoked applewood bacon, crisped on the flat-top." },
  { id: 7,  name: "Jalapeños",               emoji: "🌶️", price: 35,  category: "Topping", type: "Veg",           cogs: 12, available: true,  used: 9,  description: "Pickled green jalapeños, sliced thin." },
  { id: 8,  name: "Onion Rings",             emoji: "🧅",  price: 130, category: "Side",    type: "Veg",           cogs: 55, available: true,  used: 4,  description: "Beer-battered Spanish onions, served with chipotle aioli." },
  { id: 9,  name: "Mushroom Sauté",          emoji: "🍄",  price: 80,  category: "Topping", type: "Veg",           cogs: 30, available: true,  used: 6,  description: "Cremini mushrooms sautéed in garlic butter and thyme." },
  { id: 10, name: "BBQ Dip",                 emoji: "🍯",  price: 25,  category: "Sauce",   type: "Veg",           cogs: 8,  available: true,  used: 11, description: "Smoky house BBQ — molasses, hickory, brown sugar." },
  { id: 11, name: "Sriracha Mayo",           emoji: "🌶️", price: 25,  category: "Sauce",   type: "Veg",           cogs: 8,  available: true,  used: 8,  description: "Sriracha whipped into kewpie mayo for a spicy kick." },
  { id: 12, name: "Truffle Oil Drizzle",     emoji: "🫒",  price: 150, category: "Premium", type: "Vegan",         cogs: 60, available: true,  used: 2,  description: "Italian white truffle oil, finished tableside." },
  { id: 13, name: "Garlic Bread",            emoji: "🍞",  price: 110, category: "Side",    type: "Veg",           cogs: 40, available: true,  used: 14, description: "Toasted ciabatta, brushed with roasted-garlic butter." },
  { id: 14, name: "Sweet Potato Wedges",     emoji: "🍠",  price: 140, category: "Side",    type: "Vegan",         cogs: 60, available: true,  used: 6,  description: "Skin-on sweet potato wedges, smoked paprika dusted." },
  { id: 15, name: "Coleslaw Cup",            emoji: "🥗",  price: 60,  category: "Side",    type: "Veg",           cogs: 22, available: true,  used: 10, description: "Crunchy cabbage + carrot slaw in tangy buttermilk dressing." },
  { id: 16, name: "Caesar Dressing",         emoji: "🥗",  price: 35,  category: "Sauce",   type: "Veg",           cogs: 12, available: true,  used: 5 },
  { id: 17, name: "Ranch Dip",               emoji: "🥛",  price: 30,  category: "Sauce",   type: "Veg",           cogs: 10, available: true,  used: 7 },
  { id: 18, name: "Garlic Aioli",            emoji: "🧄",  price: 35,  category: "Sauce",   type: "Vegan",         cogs: 12, available: true,  used: 8,  description: "Roasted garlic aioli — egg-free, made with cashew base." },
  { id: 19, name: "Pesto Drizzle",           emoji: "🌿",  price: 80,  category: "Sauce",   type: "Veg",           cogs: 30, available: true,  used: 3,  description: "Basil-pine-nut-parmesan pesto, made fresh weekly." },
  { id: 20, name: "Grilled Chicken Strips",  emoji: "🍗",  price: 180, category: "Protein", type: "Halal",         cogs: 90, available: true,  used: 9,  description: "Halal-certified marinated breast, char-grilled and sliced." },
  { id: 21, name: "Pulled Pork Topping",     emoji: "🐖",  price: 220, category: "Protein", type: "Non-Veg",       cogs: 110,available: true,  used: 4,  description: "12-hour low-smoked pork shoulder, hand-pulled." },
  { id: 22, name: "Boiled Egg",              emoji: "🥚",  price: 30,  category: "Protein", type: "Non-Veg",       cogs: 12, available: true,  used: 6 },
  { id: 23, name: "Crispy Tofu Cubes",       emoji: "🥡",  price: 110, category: "Protein", type: "Vegan",         cogs: 45, available: true,  used: 5,  description: "Cornstarch-coated firm tofu, fried golden." },
  { id: 24, name: "Avocado Slices",          emoji: "🥑",  price: 130, category: "Topping", type: "Vegan",         cogs: 70, available: true,  used: 7,  description: "Ripe Hass avocado, sliced à la minute." },
  { id: 25, name: "Pineapple Chunks",        emoji: "🍍",  price: 70,  category: "Topping", type: "Vegan",         cogs: 25, available: true,  used: 4 },
  { id: 26, name: "Caramelized Onions",      emoji: "🧅",  price: 45,  category: "Topping", type: "Vegan",         cogs: 15, available: true,  used: 11, description: "Sweet onions slow-cooked in butter for 45 minutes." },
  { id: 27, name: "Fried Egg",               emoji: "🍳",  price: 45,  category: "Topping", type: "Non-Veg",       cogs: 15, available: true,  used: 8 },
  { id: 28, name: "Chocolate Sauce",         emoji: "🍫",  price: 40,  category: "Sweet",   type: "Veg",           cogs: 15, available: true,  used: 6 },
  { id: 29, name: "Whipped Cream",           emoji: "🍦",  price: 35,  category: "Sweet",   type: "Veg",           cogs: 12, available: true,  used: 9 },
  { id: 30, name: "Vanilla Ice Cream Scoop", emoji: "🍨",  price: 90,  category: "Sweet",   type: "Sugar Free",    cogs: 40, available: true,  used: 12, description: "House-churned vanilla bean — refined-sugar-free option." },
  { id: 31, name: "GF Burger Bun",           emoji: "🍔",  price: 70,  category: "Bread",   type: "Gluten Free",   cogs: 30, available: true,  used: 3,  description: "Sorghum + rice flour bun, baked in-house daily." },
  { id: 32, name: "Sourdough Slice",         emoji: "🥖",  price: 50,  category: "Bread",   type: "Veg",           cogs: 18, available: true,  used: 5 },
  { id: 33, name: "Extra Pickles",           emoji: "🥒",  price: 15,  category: "Topping", type: "Vegan",         cogs: 4,  available: true,  used: 10 },
  { id: 34, name: "Chili Flakes",            emoji: "🌶️", price: 10,  category: "Spice",   type: "Vegan",         cogs: 2,  available: true,  used: 13 },
  { id: 35, name: "Black Pepper Crackle",    emoji: "🧂",  price: 10,  category: "Spice",   type: "Vegan",         cogs: 2,  available: true,  used: 9 },
  { id: 36, name: "Lemon Wedge",             emoji: "🍋",  price: 10,  category: "Garnish", type: "Vegan",         cogs: 2,  available: true,  used: 15 },
  { id: 37, name: "Coriander Garnish",       emoji: "🌿",  price: 10,  category: "Garnish", type: "Vegan",         cogs: 2,  available: true,  used: 11 },
  { id: 38, name: "Wagyu Patty Upgrade",     emoji: "🥩",  price: 450, category: "Premium", type: "Non-Veg",       cogs: 280,available: false, used: 1,  description: "Swap regular patty for A5 wagyu — limited daily." },
  { id: 39, name: "Foie Gras Slice",         emoji: "🦆",  price: 600, category: "Premium", type: "Non-Veg",       cogs: 380,available: false, used: 0,  description: "Seared foie gras lobe, finished with port reduction." },
  { id: 40, name: "Lobster Tail Add-On",     emoji: "🦞",  price: 850, category: "Premium", type: "Halal",         cogs: 520,available: true,  used: 2,  description: "Half lobster tail, drawn butter on the side." },
  { id: 41, name: "Side Salad",              emoji: "🥗",  price: 95,  category: "Side",    type: "Vegan",         cogs: 30, available: true,  used: 7,  description: "Mixed greens, cherry tomato, balsamic vinaigrette." },
  { id: 42, name: "Mashed Potato",           emoji: "🥔",  price: 100, category: "Side",    type: "Veg",           cogs: 35, available: true,  used: 6 },
  { id: 43, name: "Steamed Veggies",         emoji: "🥦",  price: 80,  category: "Side",    type: "Vegan",         cogs: 28, available: true,  used: 8 },
  { id: 44, name: "Iced Lemon Tea",          emoji: "🧊",  price: 110, category: "Drink",   type: "Vegan",         cogs: 30, available: true,  used: 10, description: "House-brewed black tea with fresh lemon & honey." },
  { id: 45, name: "Soft Drink Refill",       emoji: "🥤",  price: 40,  category: "Drink",   type: "Veg",           cogs: 15, available: true,  used: 18 },
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
  { id: 1,  name: "Burger + Coke",        price: 220,  items: 2, description: "Any burger variant + 1 chilled Coke bottle." },
  { id: 2,  name: "Pizza Party",          price: 850,  items: 3, description: "1 large pizza + 2 sides of your choice." },
  { id: 3,  name: "Cafe Breakfast",       price: 320,  items: 3, description: "Coffee + croissant + fruit bowl, served 8–11am." },
  { id: 4,  name: "Family Feast",         price: 1450, items: 6, description: "2 mains, 2 sides, 2 drinks; serves 3–4 guests." },
  { id: 5,  name: "Date Night",           price: 1100, items: 4, description: "2 mains + 2 desserts; valid Mon–Thu evenings." },
  { id: 6,  name: "Kids Meal",            price: 250,  items: 3, description: "Small main + juice + scoop of ice cream." },
  { id: 7,  name: "Office Lunch (×6)",    price: 1800, items: 6, description: "Six boxed lunches with same-day delivery." },
  { id: 8,  name: "Veggie Lover",         price: 680,  items: 4, description: "Margherita + garlic bread + side salad + lemonade." },
  { id: 9,  name: "Bar Snack Platter",    price: 950,  items: 5, description: "Wings, nachos, fries, sliders + 2 craft beers." },
  { id: 10, name: "Weekend Brunch Set",   price: 1250, items: 5, description: "2 brunch mains + bottomless coffee + 2 mimosas." },
  { id: 11, name: "Bachelor Combo",       price: 520,  items: 3, description: "Burger + fries + soft drink — under 10-min prep." },
  { id: 12, name: "Late Night Bites",     price: 720,  items: 4, description: "After 11pm — 2 sliders + wings + drink." },
  { id: 13, name: "Coffee + Cake Combo",  price: 380,  items: 2, description: "Any espresso drink + slice of cake." },
  { id: 14, name: "Iftar Special",        price: 1100, items: 7, description: "Dates, soup, salad, kebabs, main, dessert + drink." },
  { id: 15, name: "Valentine's For Two",  price: 2400, items: 6, description: "Wine, 2 starters, 2 mains, dessert — Feb 14 only." },
  { id: 16, name: "Sunday Roast",         price: 1600, items: 5, description: "Roast + 3 sides + Yorkshire pudding, Sundays only." },
  { id: 17, name: "Game Day Special",     price: 1350, items: 6, description: "Pizza + wings + nachos + pitcher of beer, match days." },
  { id: 18, name: "Healthy Bowl Combo",   price: 580,  items: 3, description: "Grain bowl + cold-pressed juice + fruit salad." },
  { id: 19, name: "Diwali Sweet Box",     price: 1850, items: 8, description: "Assorted Indian sweets, festive seasonal pack." },
  { id: 20, name: "Birthday Party (×10)", price: 4200, items: 10,description: "Pizzas, snacks, cake and drinks for 10 guests." },
];

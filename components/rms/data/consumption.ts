export type ConsumptionType = "Dish" | "Dish's Variant" | "Beverage" | "Side" | "Add-on";

export interface StockUsed {
  id: number;
  name: string;
  qty: string;
  unit: string;
  amount: string;
}

export interface Consumption {
  id: number;
  finishedGood: string;
  salesPrice: string;
  salesPriceNum: number;
  type: ConsumptionType;
  cost: string;
  costNum: number;
  itemUsed: string;
  stocksUsed: StockUsed[];
}

export const CONSUMPTIONS: Consumption[] = [
  { id: 1, finishedGood: "Chicken Burger", salesPrice: "Rs 220", salesPriceNum: 220, type: "Dish's Variant", cost: "Rs 400", costNum: 400, itemUsed: "Lettuce (2.00kg)",
    stocksUsed: [{ id: 1, name: "Lettuce", qty: "2.00", unit: "kg", amount: "Rs 400" }] },
  { id: 2, finishedGood: "Veggie Pizza", salesPrice: "Rs 480", salesPriceNum: 480, type: "Dish", cost: "Rs 210", costNum: 210, itemUsed: "Mozzarella (0.30kg), Tomato (0.20kg)",
    stocksUsed: [{ id: 1, name: "Mozzarella", qty: "0.30", unit: "kg", amount: "Rs 285" }, { id: 2, name: "Tomato", qty: "0.20", unit: "kg", amount: "Rs 24" }] },
  { id: 3, finishedGood: "Margherita", salesPrice: "Rs 420", salesPriceNum: 420, type: "Dish", cost: "Rs 180", costNum: 180, itemUsed: "Mozzarella (0.25kg)",
    stocksUsed: [{ id: 1, name: "Mozzarella", qty: "0.25", unit: "kg", amount: "Rs 238" }] },
  { id: 4, finishedGood: "Espresso", salesPrice: "Rs 150", salesPriceNum: 150, type: "Beverage", cost: "Rs 40", costNum: 40, itemUsed: "Espresso Beans (0.02kg)",
    stocksUsed: [{ id: 1, name: "Espresso Beans", qty: "0.02", unit: "kg", amount: "Rs 24" }] },
  { id: 5, finishedGood: "Caesar Salad", salesPrice: "Rs 320", salesPriceNum: 320, type: "Side", cost: "Rs 90", costNum: 90, itemUsed: "Lettuce (0.20kg)",
    stocksUsed: [{ id: 1, name: "Lettuce", qty: "0.20", unit: "kg", amount: "Rs 40" }] },
];

export const CONSUMPTION_TYPES: ConsumptionType[] = ["Dish", "Dish's Variant", "Beverage", "Side", "Add-on"];

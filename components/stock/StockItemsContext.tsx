"use client";

import { createContext, useContext } from "react";
import type { StockItem } from "./data";

export interface StockItemsCtx {
  items: StockItem[];
  findById: (id: number) => StockItem | undefined;
  save: (it: StockItem) => void;
  requestEdit: (it: StockItem) => void;
  requestDelete: (it: StockItem) => void;
  toast: (title: string, color?: "success" | "warning" | "danger" | "primary" | "secondary") => void;
}

export const StockItemsContext = createContext<StockItemsCtx | null>(null);

export function useStockItems(): StockItemsCtx {
  const ctx = useContext(StockItemsContext);
  if (!ctx) throw new Error("useStockItems must be used inside StockItemsContext provider");
  return ctx;
}

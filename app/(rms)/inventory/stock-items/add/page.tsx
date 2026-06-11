"use client";

import { useRouter } from "next/navigation";
import { AddEditModal } from "@/components/stock/AddEditModal";
import { useStockItems } from "@/components/stock/StockItemsContext";

export default function AddStockItemPage() {
  const router = useRouter();
  const { save } = useStockItems();
  const close = () => router.push("/inventory/stock-items");
  return (
    <AddEditModal
      item={null}
      onClose={close}
      onSave={(it) => {
        save(it);
        close();
      }}
    />
  );
}

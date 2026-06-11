"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DetailDrawer } from "@/components/stock/DetailDrawer";
import { useStockItems } from "@/components/stock/StockItemsContext";

export default function StockItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = use(params);
  const router = useRouter();
  const { findById, requestEdit, requestDelete } = useStockItems();
  const id = Number(idStr);
  const item = Number.isFinite(id) ? findById(id) : undefined;
  const back = () => router.push("/inventory/stock-items");

  useEffect(() => {
    if (Number.isFinite(id) && !item) back();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, item]);

  if (!item) return null;
  return (
    <DetailDrawer
      item={item}
      onClose={back}
      onEdit={(it) => {
        back();
        requestEdit(it);
      }}
      onDelete={(it) => {
        back();
        requestDelete(it);
      }}
    />
  );
}

"use client";

import { ShoppingBag } from "lucide-react";
import StubPage from "@/components/rms/StubPage";

export default function OrdersPage() {
  return (
    <StubPage
      title="Orders"
      icon={ShoppingBag}
      description="Track and manage incoming orders."
    />
  );
}

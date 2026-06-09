"use client";

import { LayoutDashboard } from "lucide-react";
import StubPage from "@/components/rms/StubPage";

export default function DashboardPage() {
  return (
    <StubPage
      title="Dashboard"
      icon={LayoutDashboard}
      description="Your restaurant's overview and analytics will live here."
    />
  );
}

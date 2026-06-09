"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/rms/AppShell";
import { PageSkeleton } from "@/components/rms/PageSkeleton";

export default function RmsLayout({ children }: { children: React.ReactNode }) {
  // Gate page content until mounted: HeroUI's Table (React Aria) assigns random
  // collection keys that differ server vs client → hydration mismatch. The shell
  // chrome (sidebar/topbar) is deterministic and renders immediately.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return <AppShell>{mounted ? children : <PageSkeleton />}</AppShell>;
}

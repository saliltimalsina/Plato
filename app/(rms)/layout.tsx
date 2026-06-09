"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/rms/AppShell";

export default function RmsLayout({ children }: { children: React.ReactNode }) {
  // Gate page content until mounted: HeroUI's Table (React Aria) assigns random
  // collection keys that differ server vs client → hydration mismatch. The shell
  // chrome (sidebar/topbar) is deterministic and renders immediately.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <AppShell>
      {mounted ? children : (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-warm-500">
            <span className="w-7 h-7 rounded-[8px] flex items-center justify-center" style={{ background: "#F15022" }}>
              <span className="text-white font-extrabold text-sm leading-none">p</span>
            </span>
            <span className="text-sm font-semibold">Loading…</span>
          </div>
        </div>
      )}
    </AppShell>
  );
}

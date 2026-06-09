"use client";

import { Skeleton } from "@heroui/react";

export function PageSkeleton() {
  return (
    <div className="flex flex-col gap-[18px]">
      {/* header: title + actions */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-2 min-w-0">
          <Skeleton className="rounded-lg w-[180px] h-7" />
          <Skeleton className="rounded-md w-[220px] h-4" />
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <Skeleton className="rounded-md w-[210px] h-9" />
          <Skeleton className="rounded-md w-[90px] h-9" />
          <Skeleton className="rounded-md w-[120px] h-9" />
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="rounded-2xl h-[112px] w-full" />
        ))}
      </div>

      {/* tabs / filter chips */}
      <div className="flex items-center gap-2">
        <Skeleton className="rounded-lg w-[260px] h-9" />
        <div className="flex-1" />
        <Skeleton className="hidden lg:block rounded-md w-[110px] h-8" />
      </div>

      {/* table */}
      <div className="rounded-2xl border border-warm-200 bg-white overflow-hidden">
        <Skeleton className="w-full h-11 rounded-none" />
        <div className="flex flex-col">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-3 border-t border-warm-200 flex items-center gap-3">
              <Skeleton className="rounded-md w-5 h-5" />
              <Skeleton className="rounded-md flex-1 h-4" />
              <Skeleton className="hidden lg:block rounded-md w-[120px] h-4" />
              <Skeleton className="hidden lg:block rounded-md w-[80px] h-4" />
              <Skeleton className="rounded-md w-[60px] h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

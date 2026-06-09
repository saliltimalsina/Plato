"use client";

import { LucideIcon } from "lucide-react";
import { PageHeader, ORANGE } from "@/components/rms/primitives";

export default function StubPage({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <PageHeader title={title} />

      <div className="flex-1 flex items-center justify-center mt-5">
        <div className="w-full max-w-[440px] bg-white border border-[#EEEAE6] rounded-2xl px-8 py-12 flex flex-col items-center text-center"
          style={{ boxShadow: "0 1px 2px rgba(40,30,20,0.03)" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "#FBF6F1" }}>
            <Icon size={28} color="#C9BCB0" strokeWidth={2} />
          </div>

          <h2 className="mt-5 text-[18px] font-extrabold text-ink tracking-[-0.02em]">
            {title} is coming soon
          </h2>

          <p className="mt-2 text-[13.5px] text-warm-500 font-medium leading-relaxed max-w-[320px]">
            {description ?? "We're putting the finishing touches on this. Check back shortly."}
          </p>

          <span
            className="mt-6 inline-flex items-center gap-[6px] px-[13px] py-[6px] rounded-full text-[12px] font-bold cursor-not-allowed select-none"
            style={{ background: `${ORANGE}12`, color: ORANGE, opacity: 0.65 }}
          >
            <span className="w-[6px] h-[6px] rounded-full" style={{ background: ORANGE }} />
            Coming soon
          </span>
        </div>
      </div>
    </div>
  );
}

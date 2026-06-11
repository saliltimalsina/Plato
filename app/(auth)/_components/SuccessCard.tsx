"use client";

import { ArrowRight, Check } from "lucide-react";
import { CTA, INK, TINT, WARM_500, ORANGE } from "./primitives";

const cardStyle: React.CSSProperties = {
  width: "100%",
  background: "#fff",
  border: "1px solid #EFEAE6",
  borderRadius: 20,
  boxShadow: "0px 18px 48px -18px rgba(120,70,40,0.22)",
  padding: "38px 40px 34px",
};

export function SuccessCard({
  title,
  sub,
  ctaLabel,
  onCta,
}: {
  title: string;
  sub: string;
  ctaLabel: string;
  onCta: () => void;
}) {
  return (
    <div className="auth-card" key="success" style={cardStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: TINT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: `linear-gradient(155deg,${ORANGE},#FF8A5B)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 18px -6px rgba(241,80,34,0.6)",
            }}
          >
            <Check size={24} color="#fff" strokeWidth={3} />
          </div>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", margin: 0, color: INK }}>
          {title}
        </h1>
        <p style={{ fontSize: 14, color: WARM_500, margin: "4px 0 22px", lineHeight: 1.5, maxWidth: 300 }}>
          {sub}
        </p>
        <CTA onPress={onCta} withArrow={false}>
          {ctaLabel} <ArrowRight size={18} color="#fff" strokeWidth={2.2} />
        </CTA>
      </div>
    </div>
  );
}

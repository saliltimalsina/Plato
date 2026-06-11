"use client";

import type { ReactNode } from "react";
import { Carousel } from "./Carousel";
import { BORDER, INK, WARM_500 } from "./primitives";

const cardStyle: React.CSSProperties = {
  width: "100%",
  background: "#fff",
  border: `1px solid ${BORDER}`,
  borderRadius: 20,
  boxShadow: "0px 18px 48px -18px rgba(120,70,40,0.22)",
  padding: "38px 40px 34px",
};

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-wrap">
      <Carousel />
      <div className="auth-right">
        <div
          style={{
            width: "100%",
            maxWidth: 392,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function AuthCard({
  title,
  sub,
  children,
  cardKey,
}: {
  title: string;
  sub?: ReactNode;
  children: ReactNode;
  cardKey?: string;
}) {
  return (
    <div className="auth-card" key={cardKey} style={cardStyle}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/auth/logoDark.png" alt="plato" style={{ height: 38, marginBottom: 18 }} />
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: 0,
            color: INK,
          }}
        >
          {title}
        </h1>
        {sub && (
          <p
            style={{
              fontSize: 14,
              color: WARM_500,
              margin: "8px 0 0",
              lineHeight: 1.5,
              maxWidth: 320,
            }}
          >
            {sub}
          </p>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
    </div>
  );
}

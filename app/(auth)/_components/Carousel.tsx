"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { ORANGE } from "./primitives";

const SLIDES = [
  {
    img: "/auth/slide1.jpg",
    date: "MAY 22, 2026",
    h: "Earn a bigger bonus for every referral.",
    b: "Right now, earn Rs 5,000 extra for every restaurant you bring to plato. Refer a business today before the month ends. Terms apply.",
    cta: "Refer and earn more",
  },
  {
    img: "/auth/slide2.jpg",
    date: "NEW IN 3.2",
    h: "Run dinner service without the chaos.",
    b: "Live tables, fired tickets and course timing on one screen — so the floor and the kitchen finally move together.",
    cta: "See what's new",
  },
  {
    img: "/auth/slide3.jpg",
    date: "INVENTORY",
    h: "Inventory that counts itself.",
    b: "Ingredients auto-deduct as orders fire, low-stock alerts reach you before you run out, and reconciliation takes minutes.",
    cta: "Explore inventory",
  },
  {
    img: "/auth/slide4.jpg",
    date: "PAYMENTS",
    h: "Get paid faster, every shift.",
    b: "Settle card, wallet and QR payments into one ledger and close the day with a single tap.",
    cta: "Learn about payouts",
  },
];

export function Carousel() {
  const [i, setI] = useState(0);
  const n = SLIDES.length;
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % n), 5500);
    return () => clearInterval(t);
  }, [n]);
  const s = SLIDES[i];
  return (
    <div className="auth-photo">
      {SLIDES.map((sl, k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${sl.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: k === i ? 1 : 0,
            transition: "opacity .9s ease",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg,rgba(16,11,8,0.82) 0%,rgba(16,11,8,0.5) 48%,rgba(16,11,8,0.2) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(0deg,rgba(14,10,7,0.95) 0%,rgba(14,10,7,0.66) 38%,rgba(14,10,7,0.2) 66%,transparent 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 40,
          left: 56,
          right: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/auth/logoWhite.png" alt="plato" style={{ height: 28, width: "auto" }} />
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontSize: 12.5,
            fontWeight: 600,
            color: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 9999,
            padding: "5px 13px",
          }}
        >
          <Shield size={14} color="#fff" />
          Restaurant OS
        </span>
      </div>

      <div
        key={i}
        className="auth-slide"
        style={{ position: "absolute", left: 56, right: 56, bottom: 128, color: "#fff" }}
      >
        <div style={{ width: 40, height: 3, background: ORANGE, borderRadius: 2, marginBottom: 22 }} />
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.82)",
            marginBottom: 14,
          }}
        >
          {s.date}
        </div>
        <h2
          style={{
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.08,
            margin: 0,
            maxWidth: 520,
            textShadow: "0 2px 24px rgba(0,0,0,0.55)",
            color: "#fff",
          }}
        >
          {s.h}
        </h2>
        <p
          style={{
            fontSize: 15.5,
            color: "rgba(255,255,255,0.92)",
            lineHeight: 1.6,
            margin: "16px 0 0",
            maxWidth: 470,
            textShadow: "0 1px 14px rgba(0,0,0,0.5)",
          }}
        >
          {s.b}
        </p>
        <a
          href="#"
          style={{
            display: "inline-block",
            marginTop: 22,
            fontSize: 12.5,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#fff",
            textDecoration: "none",
            borderBottom: `2px solid ${ORANGE}`,
            paddingBottom: 4,
          }}
        >
          {s.cta}
        </a>
      </div>

      <div style={{ position: "absolute", left: 56, bottom: 92, display: "flex", gap: 8 }}>
        {SLIDES.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            aria-label={`Slide ${k + 1}`}
            style={{
              width: k === i ? 22 : 8,
              height: 8,
              borderRadius: 9999,
              border: "none",
              padding: 0,
              cursor: "pointer",
              background: k === i ? ORANGE : "rgba(255,255,255,0.45)",
              transition: "width .3s",
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          bottom: 34,
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.78)" }}>
          Powered by <strong style={{ color: ORANGE }}>plato</strong>
        </span>
        <span style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>© plato, Inc. 2026</span>
        <span style={{ color: "rgba(255,255,255,0.35)" }}>·</span>
        <a href="#" style={{ color: "rgba(255,255,255,0.78)", textDecoration: "none", fontSize: 12 }}>
          Privacy
        </a>
        <a href="#" style={{ color: "rgba(255,255,255,0.78)", textDecoration: "none", fontSize: 12 }}>
          Terms of Service
        </a>
      </div>
    </div>
  );
}

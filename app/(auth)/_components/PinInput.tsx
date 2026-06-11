"use client";

import { useRef } from "react";
import { BORDER, FIELD, INK, ORANGE, TINT } from "./primitives";

export function PinInput({
  digits,
  setDigits,
  onComplete,
}: {
  digits: string[];
  setDigits: (d: string[]) => void;
  onComplete?: () => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const handle = (i: number, raw: string) => {
    const d = raw.replace(/\D/g, "");
    const next = [...digits];
    if (d === "") {
      next[i] = "";
      setDigits(next);
      return;
    }
    if (d.length > 1) {
      d.split("")
        .slice(0, 6 - i)
        .forEach((c, k) => {
          next[i + k] = c;
        });
      setDigits(next);
      const f = Math.min(i + d.length, 5);
      if (refs.current[f]) refs.current[f]!.focus();
      if (next.every((x) => x)) onComplete?.();
      return;
    }
    next[i] = d;
    setDigits(next);
    if (i < 5 && refs.current[i + 1]) refs.current[i + 1]!.focus();
    if (next.every((x) => x)) onComplete?.();
  };
  const key = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0 && refs.current[i - 1]) refs.current[i - 1]!.focus();
  };
  return (
    <div style={{ display: "flex", gap: 9, justifyContent: "space-between" }}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const filled = !!digits[i];
        return (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            inputMode="numeric"
            maxLength={6}
            value={digits[i] || ""}
            autoFocus={i === 0}
            onChange={(e) => handle(i, e.target.value)}
            onKeyDown={(e) => key(i, e)}
            onFocus={(e) => e.target.select()}
            style={{
              flex: 1,
              minWidth: 0,
              width: "100%",
              height: 56,
              textAlign: "center",
              fontSize: 22,
              fontWeight: 700,
              color: INK,
              borderRadius: 13,
              border: `2px solid ${filled ? ORANGE : BORDER}`,
              background: filled ? TINT : FIELD,
              outline: "none",
              fontFamily: "inherit",
              padding: 0,
              transition: "border-color .12s, background .12s",
            }}
          />
        );
      })}
    </div>
  );
}

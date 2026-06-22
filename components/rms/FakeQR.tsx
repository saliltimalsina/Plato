"use client";

import { useMemo } from "react";

/* deterministic fake QR (mock UI — no qr lib in repo) */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function FakeQR({ seed, size = 150 }: { seed: string; size?: number }) {
  const N = 21;
  const cells = useMemo(() => {
    const rnd = mulberry32(hash(seed));
    const isFinder = (r: number, c: number) => {
      const inBox = (br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
      return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
    };
    const grid: boolean[] = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) grid.push(isFinder(r, c) ? false : rnd() > 0.5);
    return grid;
  }, [seed]);

  const m = size / N;
  const Finder = ({ x, y }: { x: number; y: number }) => (
    <>
      <rect x={x} y={y} width={m * 7} height={m * 7} fill="#111" />
      <rect x={x + m} y={y + m} width={m * 5} height={m * 5} fill="#fff" />
      <rect x={x + m * 2} y={y + m * 2} width={m * 3} height={m * 3} fill="#111" />
    </>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} shapeRendering="crispEdges" className="rounded-[4px]">
      <rect width={size} height={size} fill="#fff" />
      {cells.map((on, i) => on ? (
        <rect key={i} x={(i % N) * m} y={Math.floor(i / N) * m} width={m} height={m} fill="#111" />
      ) : null)}
      <Finder x={0} y={0} />
      <Finder x={size - m * 7} y={0} />
      <Finder x={0} y={size - m * 7} />
    </svg>
  );
}

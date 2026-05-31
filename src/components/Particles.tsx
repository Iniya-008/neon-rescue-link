import { useMemo } from "react";

export function Particles({ count = 40 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 1 + Math.random() * 3,
        delay: Math.random() * 20,
        duration: 16 + Math.random() * 18,
        color: ["var(--neon-blue)", "var(--neon-purple)", "var(--neon-pink)"][i % 3],
      })),
    [count],
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className="absolute inset-0 neon-grid opacity-40" />
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: `-10px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <div
        className="absolute inset-x-0 h-32 opacity-20"
        style={{
          background:
            "linear-gradient(180deg, transparent, var(--neon-blue), transparent)",
          animation: "scan-line 8s linear infinite",
        }}
      />
    </div>
  );
}
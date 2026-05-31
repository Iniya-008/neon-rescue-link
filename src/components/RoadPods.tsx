import { motion } from "framer-motion";

export function RoadPods({ active }: { active: boolean }) {
  const pods = [0, 1, 2, 3, 4];
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Smart SOS poles along the highway. The nearest pod activates lights, siren, camera and broadcasts coordinates.
      </p>
      <div className="relative h-24 rounded-xl glass overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[oklch(0.85_0.18_220)] to-transparent" />
        <div className="absolute inset-x-0 top-1/2 mt-0.5 h-px bg-gradient-to-r from-transparent via-[oklch(0.85_0.18_220)/0.3] to-transparent" />
        {pods.map((p) => {
          const isActive = active && p === 2;
          return (
            <div
              key={p}
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${10 + p * 20}%` }}
            >
              <motion.div
                animate={
                  isActive
                    ? { opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }
                    : { opacity: 0.6 }
                }
                transition={{ duration: 0.6, repeat: Infinity }}
                className="h-3 w-3 rounded-full"
                style={{
                  background: isActive ? "oklch(0.7 0.32 340)" : "oklch(0.85 0.18 220)",
                  boxShadow: isActive
                    ? "0 0 18px oklch(0.7 0.32 340)"
                    : "0 0 8px oklch(0.85 0.18 220)",
                }}
              />
              <span className="mt-1 h-6 w-px bg-[oklch(0.85_0.18_220)/0.6]" />
              <span className="text-[9px] mt-1 uppercase tracking-widest text-muted-foreground">
                P{p + 1}
              </span>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-2 text-[10px] uppercase tracking-widest">
        {["Siren", "Camera", "First Aid"].map((f) => (
          <div
            key={f}
            className={`glass rounded-lg p-2 text-center ${active ? "neon-border-pink animate-flicker" : ""}`}
          >
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}
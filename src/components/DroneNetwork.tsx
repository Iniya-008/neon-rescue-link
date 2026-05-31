import { motion } from "framer-motion";

export function DroneNetwork({ active }: { active: boolean }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Autonomous rescue drones deliver first-aid kits, AEDs and stream live video to responders.
      </p>
      <div className="relative h-32 rounded-xl glass overflow-hidden">
        <div className="absolute inset-0 neon-grid opacity-30" />
        <div className="absolute right-4 bottom-3 text-2xl">🏥</div>
        <div className="absolute left-4 bottom-3 text-2xl">📍</div>
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 text-3xl"
          initial={{ left: "10%" }}
          animate={active ? { left: ["10%", "85%"] } : { left: "10%" }}
          transition={{ duration: 4, repeat: active ? Infinity : 0, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 10px oklch(0.55 0.28 300))" }}
        >
          🚁
        </motion.div>
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <path
            d="M 8% 80% Q 50% 10% 92% 80%"
            stroke="oklch(0.55 0.28 300)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-widest">
        <div className="glass rounded-lg p-2 text-center">Drone-07 • ETA 2m</div>
        <div className="glass rounded-lg p-2 text-center">Payload • Trauma Kit</div>
      </div>
    </div>
  );
}
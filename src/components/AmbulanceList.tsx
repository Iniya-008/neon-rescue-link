import type { Ambulance } from "@/lib/roadsos-types";
import { motion } from "framer-motion";

export function AmbulanceList({ ambulances }: { ambulances: Ambulance[] }) {
  return (
    <ul className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-neon pr-1">
      {ambulances.map((a, i) => (
        <motion.li
          key={a.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-xl p-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold flex items-center gap-2">
                <span className="text-xl animate-flicker">🚑</span>
                {a.vehicleNo}
              </p>
              <p className="text-xs text-muted-foreground">
                {a.driver} • {a.distanceKm.toFixed(1)} km
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-[oklch(0.85_0.18_220)]">ETA</p>
              <p className="font-bold text-glow-blue">{a.etaMin}m</p>
            </div>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
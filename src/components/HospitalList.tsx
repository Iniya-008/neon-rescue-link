import type { Hospital } from "@/lib/roadsos-types";
import { motion } from "framer-motion";

const dot: Record<Hospital["status"], string> = {
  available: "bg-[oklch(0.85_0.25_145)] shadow-[0_0_12px_oklch(0.85_0.25_145)]",
  limited: "bg-[oklch(0.9_0.22_95)] shadow-[0_0_12px_oklch(0.9_0.22_95)]",
  full: "bg-[oklch(0.65_0.3_25)] shadow-[0_0_12px_oklch(0.65_0.3_25)]",
};
const label: Record<Hospital["status"], string> = {
  available: "Ready to Receive",
  limited: "Limited Capacity",
  full: "At Capacity",
};

export function HospitalList({
  hospitals,
  loading,
  emergency,
}: {
  hospitals: Hospital[];
  loading: boolean;
  emergency: boolean;
}) {
  if (loading)
    return (
      <p className="text-sm text-muted-foreground animate-pulse">
        Scanning hospital grid…
      </p>
    );
  if (!hospitals.length)
    return (
      <p className="text-sm text-muted-foreground">
        No hospitals located in this radius.
      </p>
    );
  return (
    <ul className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-neon pr-1">
      {hospitals.map((h, i) => (
        <motion.li
          key={h.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="glass rounded-xl p-3 border border-white/5 hover:neon-border-blue transition-shadow"
        >
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <p className="font-semibold truncate">{h.name}</p>
              <p className="text-xs text-muted-foreground">
                {h.distanceKm.toFixed(1)} km • ETA {h.etaMin} min •{" "}
                {h.beds} beds
              </p>
            </div>
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-widest whitespace-nowrap">
              <span className={`h-2.5 w-2.5 rounded-full ${dot[h.status]}`} />
              {label[h.status]}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] uppercase tracking-widest">
            {h.trauma && (
              <span className="px-2 py-0.5 rounded-full bg-[oklch(0.7_0.32_340)/0.15] text-[oklch(0.85_0.32_340)] border border-[oklch(0.7_0.32_340)/0.4]">
                Trauma Center
              </span>
            )}
            {emergency && (
              <span className="px-2 py-0.5 rounded-full bg-[oklch(0.85_0.18_220)/0.15] text-[oklch(0.85_0.18_220)] border border-[oklch(0.85_0.18_220)/0.4] animate-flicker">
                Patient Inbound
              </span>
            )}
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
import { motion } from "framer-motion";

export function SOSButton({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={onClick}
        className={`relative h-44 w-44 rounded-full grid place-items-center font-black text-3xl tracking-[0.2em] transition-colors ${
          active
            ? "bg-[oklch(0.7_0.32_340)] text-white animate-sos"
            : "bg-gradient-to-br from-[oklch(0.7_0.32_340)] via-[oklch(0.55_0.28_300)] to-[oklch(0.85_0.18_220)] text-white animate-sos"
        }`}
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        <span className="absolute inset-1 rounded-full border border-white/30" />
        <span className="absolute inset-3 rounded-full border border-white/20 animate-spin-slow" style={{ borderStyle: "dashed" }} />
        {active ? "ACTIVE" : "SOS"}
      </motion.button>
      <p className="mt-5 text-xs uppercase tracking-[0.4em] text-muted-foreground">
        {active ? "Emergency protocol engaged" : "Tap to launch rescue protocol"}
      </p>
    </div>
  );
}
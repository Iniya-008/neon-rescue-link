import { AnimatePresence, motion } from "framer-motion";

export type TimelineEvent = { time: string; label: string };

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (!events.length)
    return (
      <p className="text-sm text-muted-foreground">
        Awaiting incident… all sensors green.
      </p>
    );
  return (
    <ol className="relative pl-6 space-y-3 max-h-[320px] overflow-y-auto scrollbar-neon">
      <span className="absolute left-2 top-1 bottom-1 w-px bg-gradient-to-b from-[oklch(0.85_0.18_220)] via-[oklch(0.55_0.28_300)] to-[oklch(0.7_0.32_340)]" />
      <AnimatePresence initial={false}>
        {events.map((e, i) => (
          <motion.li
            key={`${e.time}-${i}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <span className="absolute -left-[18px] top-1.5 h-3 w-3 rounded-full bg-[oklch(0.85_0.18_220)] shadow-[0_0_10px_oklch(0.85_0.18_220)]" />
            <p className="text-xs tracking-widest text-[oklch(0.85_0.18_220)]">{e.time}</p>
            <p className="text-sm">{e.label}</p>
          </motion.li>
        ))}
      </AnimatePresence>
    </ol>
  );
}
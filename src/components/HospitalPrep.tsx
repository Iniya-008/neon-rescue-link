import { useState } from "react";
import type { Hospital } from "@/lib/roadsos-types";

const ACTIONS = [
  { id: "icu", label: "Prepare ICU" },
  { id: "trauma", label: "Trauma Team" },
  { id: "bed", label: "Reserve Bed" },
  { id: "blood", label: "Blood Bank" },
  { id: "surgery", label: "Surgery Team" },
];

export function HospitalPrep({
  hospital,
  emergency,
}: {
  hospital: Hospital | undefined;
  emergency: boolean;
}) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);
  if (!hospital)
    return (
      <p className="text-sm text-muted-foreground">
        Select an SOS event to brief receiving hospital.
      </p>
    );

  return (
    <div className="space-y-3">
      <div className="glass rounded-xl p-3 neon-border-pink">
        <p className="text-[10px] uppercase tracking-widest text-[oklch(0.85_0.32_340)]">
          Incoming Patient Alert
        </p>
        <p className="font-bold">{hospital.name}</p>
        <p className="text-xs text-muted-foreground">
          ETA {hospital.etaMin} min • {hospital.distanceKm.toFixed(1)} km •
          Severity: {emergency ? "Critical" : "Standby"}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            onClick={() => setDone((d) => ({ ...d, [a.id]: !d[a.id] }))}
            className={`text-xs px-3 py-2 rounded-lg uppercase tracking-widest transition-all ${
              done[a.id]
                ? "neon-border-blue bg-[oklch(0.85_0.18_220)/0.15]"
                : "glass hover:neon-border-blue"
            }`}
          >
            {done[a.id] ? "✓ " : ""}
            {a.label}
          </button>
        ))}
      </div>
      <button
        onClick={() => setReady(true)}
        disabled={ready}
        className={`w-full py-3 rounded-xl font-black tracking-[0.3em] uppercase transition-all ${
          ready
            ? "bg-[oklch(0.85_0.25_145)/0.2] border border-[oklch(0.85_0.25_145)] text-[oklch(0.85_0.25_145)]"
            : "neon-border-pink hover:bg-[oklch(0.7_0.32_340)/0.2]"
        }`}
      >
        {ready ? "✓ Ready to Receive" : "Mark Ready to Receive"}
      </button>
    </div>
  );
}
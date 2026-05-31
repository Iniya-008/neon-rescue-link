import type { Police } from "@/lib/roadsos-types";

export function PoliceList({ police, loading }: { police: Police[]; loading: boolean }) {
  if (loading) return <p className="text-sm text-muted-foreground animate-pulse">Pinging precincts…</p>;
  if (!police.length) return <p className="text-sm text-muted-foreground">No police stations nearby.</p>;
  return (
    <ul className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-neon pr-1">
      {police.map((p) => (
        <li key={p.id} className="glass rounded-xl p-3 flex items-center justify-between gap-3 hover:neon-border-purple">
          <div className="min-w-0">
            <p className="font-semibold truncate">{p.name}</p>
            <p className="text-xs text-muted-foreground">
              {p.distanceKm.toFixed(1)} km • ETA {p.etaMin} min
            </p>
          </div>
          <a
            href={`tel:${p.phone}`}
            className="text-xs px-3 py-1.5 rounded-full neon-border-purple font-bold tracking-widest uppercase hover:bg-[oklch(0.55_0.28_300)/0.15]"
          >
            📞 Call
          </a>
        </li>
      ))}
    </ul>
  );
}
import { useState } from "react";
import { motion } from "framer-motion";

type Risk = "Low" | "Moderate" | "Critical";

export function SeverityAnalyzer() {
  const [risk, setRisk] = useState<Risk | null>(null);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  function analyze() {
    const score =
      notes.length / 10 +
      (file ? 4 : 0) +
      (/blood|crash|severe|unconscious|fire/i.test(notes) ? 6 : 0);
    const r: Risk = score > 8 ? "Critical" : score > 3 ? "Moderate" : "Low";
    setRisk(r);
  }

  const color =
    risk === "Critical"
      ? "oklch(0.65 0.3 25)"
      : risk === "Moderate"
        ? "oklch(0.9 0.22 95)"
        : "oklch(0.85 0.25 145)";
  const pct = risk === "Critical" ? 95 : risk === "Moderate" ? 60 : risk ? 25 : 0;

  return (
    <div className="space-y-3">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        placeholder="Describe accident: injuries, vehicles, hazards…"
        className="w-full rounded-xl bg-[oklch(0.12_0.04_280)/0.6] border border-[oklch(0.85_0.18_220)/0.3] p-3 text-sm focus:outline-none focus:neon-border-blue resize-none"
      />
      <div className="flex gap-2 items-center">
        <label className="text-xs px-3 py-1.5 rounded-lg neon-border-purple cursor-pointer hover:bg-[oklch(0.55_0.28_300)/0.15]">
          📷 Upload Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {file && (
          <span className="text-xs text-muted-foreground truncate">{file.name}</span>
        )}
        <button
          onClick={analyze}
          className="ml-auto text-xs px-4 py-1.5 rounded-lg neon-border-pink font-bold tracking-widest uppercase hover:bg-[oklch(0.7_0.32_340)/0.15]"
        >
          Analyze
        </button>
      </div>
      <div>
        <div className="h-3 rounded-full bg-[oklch(0.15_0.04_280)] overflow-hidden">
          <motion.div
            className="h-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6 }}
            style={{
              background: `linear-gradient(90deg, oklch(0.85 0.25 145), oklch(0.9 0.22 95), oklch(0.65 0.3 25))`,
              boxShadow: risk ? `0 0 12px ${color}` : "none",
            }}
          />
        </div>
        <p className="mt-2 text-xs uppercase tracking-widest">
          {risk ? (
            <span style={{ color }}>AI assessment: {risk} Risk</span>
          ) : (
            <span className="text-muted-foreground">Awaiting input…</span>
          )}
        </p>
      </div>
    </div>
  );
}
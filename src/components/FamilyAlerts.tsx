import { useState } from "react";

type Contact = { id: number; name: string; phone: string; relation: string; lastAlert?: string };

const INITIAL: Contact[] = [
  { id: 1, name: "Priya Sharma", phone: "+91 98xxxxxx12", relation: "Spouse" },
  { id: 2, name: "Raj Verma", phone: "+91 98xxxxxx88", relation: "Brother" },
  { id: 3, name: "Mom", phone: "+91 98xxxxxx04", relation: "Mother" },
];

export function FamilyAlerts({ emergency }: { emergency: boolean }) {
  const [contacts, setContacts] = useState(INITIAL);
  const [history, setHistory] = useState<string[]>([]);

  function alertAll() {
    const stamp = new Date().toLocaleTimeString();
    setContacts((cs) => cs.map((c) => ({ ...c, lastAlert: stamp })));
    setHistory((h) => [
      `${stamp} — Live location + hospital details sent to ${contacts.length} contacts`,
      ...h,
    ]);
  }

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {contacts.map((c) => (
          <li key={c.id} className="glass rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-xs text-muted-foreground">
                {c.relation} • {c.phone}
              </p>
            </div>
            {c.lastAlert && (
              <span className="text-[10px] uppercase tracking-widest text-[oklch(0.85_0.25_145)]">
                Alerted {c.lastAlert}
              </span>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={alertAll}
        className={`w-full py-2.5 rounded-xl text-sm uppercase tracking-[0.3em] font-bold ${
          emergency ? "neon-border-pink animate-flicker" : "neon-border-purple"
        }`}
      >
        📡 Broadcast Alert
      </button>
      {history.length > 0 && (
        <ul className="text-[11px] text-muted-foreground space-y-1 max-h-20 overflow-y-auto scrollbar-neon">
          {history.map((h, i) => (
            <li key={i}>• {h}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
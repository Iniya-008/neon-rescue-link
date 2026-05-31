const NUMBERS = [
  { n: "112", label: "National Emergency", icon: "🆘" },
  { n: "108", label: "Ambulance", icon: "🚑" },
  { n: "100", label: "Police", icon: "🚓" },
  { n: "101", label: "Fire", icon: "🚒" },
  { n: "1098", label: "Child Helpline", icon: "🧒" },
  { n: "1073", label: "Highway Emergency", icon: "🛣️" },
];

export function EmergencyNumbers() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {NUMBERS.map((x) => (
        <a
          key={x.n}
          href={`tel:${x.n}`}
          className="glass neon-border-pink rounded-xl p-3 text-center hover:scale-[1.03] transition-transform"
        >
          <p className="text-2xl">{x.icon}</p>
          <p className="text-xl font-black text-glow-pink" style={{ fontFamily: "Orbitron, sans-serif" }}>
            {x.n}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {x.label}
          </p>
        </a>
      ))}
    </div>
  );
}
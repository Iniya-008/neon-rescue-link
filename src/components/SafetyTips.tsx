const TIPS = [
  { icon: "🪖", t: "Wear Helmet", d: "Always strap up before ignition." },
  { icon: "🔗", t: "Buckle Seatbelt", d: "Every seat, every ride." },
  { icon: "📵", t: "No Mobile Use", d: "Eyes on road, hands on wheel." },
  { icon: "🏁", t: "Mind Speed Limits", d: "Speed kills reaction time." },
  { icon: "🚦", t: "Follow Signals", d: "Stop. Look. Then proceed." },
  { icon: "📇", t: "Update Contacts", d: "Keep ICE numbers current." },
];

export function SafetyTips() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {TIPS.map((x) => (
        <div
          key={x.t}
          className="glass rounded-xl p-3 hover:neon-border-blue transition-shadow"
        >
          <p className="text-2xl">{x.icon}</p>
          <p className="font-semibold mt-1">{x.t}</p>
          <p className="text-xs text-muted-foreground">{x.d}</p>
        </div>
      ))}
    </div>
  );
}
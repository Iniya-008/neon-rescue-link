import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Particles } from "@/components/Particles";
import { SOSButton } from "@/components/SOSButton";
import { Panel } from "@/components/Panel";
import { HospitalList } from "@/components/HospitalList";
import { PoliceList } from "@/components/PoliceList";
import { AmbulanceList } from "@/components/AmbulanceList";
import { Timeline, type TimelineEvent } from "@/components/Timeline";
import { EmergencyNumbers } from "@/components/EmergencyNumbers";
import { SafetyTips } from "@/components/SafetyTips";
import { SeverityAnalyzer } from "@/components/SeverityAnalyzer";
import { RoadPods } from "@/components/RoadPods";
import { DroneNetwork } from "@/components/DroneNetwork";
import { HospitalPrep } from "@/components/HospitalPrep";
import { FamilyAlerts } from "@/components/FamilyAlerts";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNearbyPlaces } from "@/hooks/useNearbyPlaces";
import type { Ambulance } from "@/lib/roadsos-types";

const MapView = lazy(() => import("@/components/MapView"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RoadSoS AI — Smart Emergency Rescue Network" },
      {
        name: "description",
        content:
          "AI-powered emergency rescue platform connecting accident victims with nearby hospitals, ambulances and police in real time.",
      },
      { property: "og:title", content: "RoadSoS AI — Smart Emergency Rescue Network" },
      {
        property: "og:description",
        content: "Futuristic cyberpunk dashboard that slashes road-accident response time.",
      },
    ],
  }),
  component: Index,
});

function mockAmbulances(lat: number | undefined, lon: number | undefined): Ambulance[] {
  if (lat == null || lon == null) return [];
  return [
    { vehicleNo: "AMB-08-2241", driver: "Capt. Arjun" },
    { vehicleNo: "AMB-08-5519", driver: "Capt. Meera" },
    { vehicleNo: "AMB-08-3098", driver: "Capt. Khan" },
  ].map((a, i) => {
    const km = 1.2 + i * 1.3;
    return {
      id: `amb-${i}`,
      vehicleNo: a.vehicleNo,
      driver: a.driver,
      phone: "108",
      lat: lat + (Math.cos(i) * km) / 111,
      lon: lon + (Math.sin(i) * km) / 111,
      distanceKm: km,
      etaMin: Math.round(km * 1.4) + 2,
    };
  });
}

function Index() {
  const loc = useGeolocation();
  const { hospitals, police, loading } = useNearbyPlaces(loc.coords);
  const ambulances = useMemo(
    () => mockAmbulances(loc.coords?.lat, loc.coords?.lon),
    [loc.coords?.lat, loc.coords?.lon],
  );
  const [emergency, setEmergency] = useState(false);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [voiceMsg, setVoiceMsg] = useState<string | null>(null);

  function push(label: string) {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setEvents((e) => [{ time, label }, ...e].slice(0, 12));
  }

  function triggerSOS() {
    if (emergency) {
      setEmergency(false);
      push("🛑 Emergency protocol cancelled by user");
      return;
    }
    setEmergency(true);
    push("🚨 SOS triggered — GPS broadcast initiated");
    setTimeout(() => push("🏥 Nearest hospital alerted — bed reserved"), 700);
    setTimeout(() => push("🚑 Ambulance dispatched — ETA calculated"), 1400);
    setTimeout(() => push("🚓 Police & highway patrol notified"), 2100);
    setTimeout(() => push("📡 Family contacts sent live location"), 2800);
    setTimeout(() => push("🛰 Roadside SOS pod activated — sirens live"), 3500);
    setTimeout(() => push("🚁 Rescue drone deployed with trauma kit"), 4200);
  }

  function handleVoice(cmd: string) {
    setVoiceMsg(cmd);
    setTimeout(() => setVoiceMsg(null), 3500);
    const l = cmd.toLowerCase();
    if (l.includes("emergency") || l.includes("sos")) triggerSOS();
    else if (l.includes("hospital")) push("🎙 Voice → Showing nearest hospitals");
    else if (l.includes("ambulance")) push("🎙 Voice → Calling ambulance (108)");
    else if (l.includes("police")) push("🎙 Voice → Contacting police (100)");
    else if (l.includes("location")) push("🎙 Voice → Sharing live location");
    else push(`🎙 Voice command: "${cmd}"`);
  }

  useEffect(() => {
    if (loc.status === "ready" && loc.coords && events.length === 0) {
      push("📡 GPS locked — all systems nominal");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.status]);

  return (
    <div className="min-h-screen relative">
      <Particles />

      {/* HEADER */}
      <header className="sticky top-0 z-30 glass-strong border-b border-[oklch(0.85_0.18_220)/0.2]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-xl grid place-items-center bg-gradient-to-br from-[oklch(0.85_0.18_220)] via-[oklch(0.55_0.28_300)] to-[oklch(0.7_0.32_340)]">
              <span className="text-xl">⚡</span>
              <span className="absolute -inset-1 rounded-xl border border-[oklch(0.85_0.18_220)/0.5] animate-spin-slow" style={{ borderStyle: "dashed" }} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-glow-blue" style={{ fontFamily: "Orbitron, sans-serif" }}>
                RoadSoS<span className="text-[oklch(0.7_0.32_340)]">·AI</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Smart Emergency Rescue Network
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <StatusPill label="GPS" ok={loc.status === "ready"} pulse={loc.status === "locating"} />
            <StatusPill label="Grid" ok={!loading && hospitals.length > 0} pulse={loading} />
            <StatusPill label="Net" ok />
            <span className={`px-3 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold ${
              emergency
                ? "bg-[oklch(0.7_0.32_340)/0.2] text-[oklch(0.85_0.32_340)] border border-[oklch(0.7_0.32_340)] animate-flicker"
                : "bg-[oklch(0.85_0.25_145)/0.15] text-[oklch(0.85_0.25_145)] border border-[oklch(0.85_0.25_145)/0.4]"
            }`}>
              {emergency ? "EMERGENCY" : "Standby"}
            </span>
          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 grid gap-6 lg:grid-cols-12">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-6">
          <Panel title="Live Telemetry" accent="blue" icon="📍">
            <dl className="space-y-2 text-xs">
              <Row k="Address" v={loc.address} truncate />
              <Row k="Area" v={loc.area} />
              <Row k="City" v={loc.city} />
              <Row k="State" v={loc.state} />
              <Row k="Lat" v={loc.coords ? loc.coords.lat.toFixed(5) : "—"} />
              <Row k="Lon" v={loc.coords ? loc.coords.lon.toFixed(5) : "—"} />
            </dl>
            {loc.status === "error" && (
              <button
                onClick={loc.request}
                className="mt-3 w-full text-xs py-2 rounded-lg neon-border-blue uppercase tracking-widest"
              >
                Retry GPS Lock
              </button>
            )}
          </Panel>

          <Panel title="Emergency Numbers" accent="pink" icon="☎️">
            <EmergencyNumbers />
          </Panel>

          <Panel title="Family Alert System" accent="purple" icon="👨‍👩‍👧">
            <FamilyAlerts emergency={emergency} />
          </Panel>
        </div>

        {/* CENTER */}
        <div className="lg:col-span-6 space-y-6">
          <section className="glass-strong rounded-2xl p-6 sm:p-8 neon-border-pink relative overflow-hidden">
            <div className="absolute inset-0 neon-grid opacity-20 pointer-events-none" />
            <div className="grid sm:grid-cols-[1fr_auto] gap-6 items-center relative">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[oklch(0.85_0.18_220)] mb-2">
                  AI Accident Protocol
                </p>
                <h2 className="text-3xl sm:text-4xl font-black leading-tight text-glow-pink" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  Press to summon<br />the rescue grid.
                </h2>
                <p className="mt-3 text-sm text-muted-foreground max-w-md">
                  One tap broadcasts your GPS to hospitals, ambulances, police, family contacts, roadside SOS pods and rescue drones simultaneously.
                </p>
              </div>
              <SOSButton active={emergency} onClick={triggerSOS} />
            </div>
          </section>

          <Panel title="Tactical Map" accent="blue" icon="🛰" action={
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {hospitals.length} H • {police.length} P • {ambulances.length} A
            </span>
          }>
            <div className="h-[420px] rounded-xl overflow-hidden neon-border-blue">
              <Suspense fallback={<div className="h-full grid place-items-center text-sm text-muted-foreground">Loading map…</div>}>
                <MapView
                  user={loc.coords}
                  hospitals={hospitals}
                  police={police}
                  ambulances={ambulances}
                  emergency={emergency}
                />
              </Suspense>
            </div>
          </Panel>

          <div className="grid md:grid-cols-2 gap-6">
            <Panel title="Smart Road Pods" accent="pink" icon="🪧">
              <RoadPods active={emergency} />
            </Panel>
            <Panel title="Drone Rescue Net" accent="purple" icon="🚁">
              <DroneNetwork active={emergency} />
            </Panel>
          </div>

          <Panel title="AI Severity Analyzer" accent="pink" icon="🧠">
            <SeverityAnalyzer />
          </Panel>

          <Panel title="Safety Precaution Module" accent="blue" icon="🛡">
            <SafetyTips />
          </Panel>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-3 space-y-6">
          <Panel title="Hospitals" accent="blue" icon="🏥">
            <HospitalList hospitals={hospitals} loading={loading} emergency={emergency} />
          </Panel>
          <Panel title="Hospital Prep" accent="pink" icon="🩺">
            <HospitalPrep hospital={hospitals[0]} emergency={emergency} />
          </Panel>
          <Panel title="Ambulance Tracker" accent="purple" icon="🚑">
            <AmbulanceList ambulances={ambulances} />
          </Panel>
          <Panel title="Police Stations" accent="purple" icon="🚓">
            <PoliceList police={police} loading={loading} />
          </Panel>
          <Panel title="Incident Timeline" accent="blue" icon="⏱">
            <Timeline events={events} />
          </Panel>
          <Panel title="Voice Assistant" accent="pink" icon="🎙">
            <VoiceAssistant onCommand={handleVoice} />
          </Panel>
        </div>
      </main>

      <footer className="max-w-[1600px] mx-auto px-6 py-8 text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
        National Road Safety Hackathon 2026 • Prototype
      </footer>

      <AnimatePresence>
        {voiceMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-strong neon-border-pink rounded-full px-5 py-2 text-sm"
          >
            🎙 "{voiceMsg}"
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ k, v, truncate }: { k: string; v: string; truncate?: boolean }) {
  return (
    <div className="flex gap-2 justify-between">
      <dt className="text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">{k}</dt>
      <dd className={`text-right ${truncate ? "truncate max-w-[180px]" : ""}`} title={v}>
        {v}
      </dd>
    </div>
  );
}

function StatusPill({ label, ok, pulse }: { label: string; ok?: boolean; pulse?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest">
      <span
        className={`h-2 w-2 rounded-full ${
          ok
            ? "bg-[oklch(0.85_0.25_145)] shadow-[0_0_8px_oklch(0.85_0.25_145)]"
            : "bg-[oklch(0.65_0.3_25)] shadow-[0_0_8px_oklch(0.65_0.3_25)]"
        } ${pulse ? "animate-pulse" : ""}`}
      />
      {label}
    </span>
  );
}

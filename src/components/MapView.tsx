import { useEffect, useState } from "react";
import type { Coords, Hospital, Police, Ambulance } from "@/lib/roadsos-types";

type Props = {
  user: Coords | null;
  hospitals: Hospital[];
  police: Police[];
  ambulances: Ambulance[];
  emergency: boolean;
};

export default function MapView(props: Props) {
  const [ready, setReady] = useState(false);
  const [Mods, setMods] = useState<any>(null);
  useEffect(() => {
    let mounted = true;
    Promise.all([import("react-leaflet"), import("leaflet")]).then(([rl, L]) => {
      if (!mounted) return;
      setMods({ rl, L: L.default ?? L });
      setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!ready || !Mods) {
    return (
      <div className="h-full w-full grid place-items-center text-sm text-muted-foreground">
        Initializing tactical map…
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } = Mods.rl;
  const L = Mods.L;

  const icon = (color: string, label: string) =>
    L.divIcon({
      className: "",
      html: `<div style="
        width:28px;height:28px;border-radius:50%;
        background:radial-gradient(circle, ${color}, transparent 70%);
        display:grid;place-items:center;color:#0A0A0A;font-weight:900;font-size:12px;
        box-shadow:0 0 14px ${color}, 0 0 28px ${color};
        border:2px solid ${color};font-family:Orbitron,sans-serif;">${label}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

  const center: [number, number] = props.user
    ? [props.user.lat, props.user.lon]
    : [20.5937, 78.9629];

  return (
    <MapContainer
      center={center}
      zoom={props.user ? 14 : 5}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.user && (
        <>
          <Circle
            center={[props.user.lat, props.user.lon]}
            radius={props.emergency ? 1500 : 600}
            pathOptions={{
              color: props.emergency ? "#FF00FF" : "#00F5FF",
              fillColor: props.emergency ? "#FF00FF" : "#00F5FF",
              fillOpacity: 0.08,
              weight: 2,
              dashArray: "4 6",
            }}
          />
          <Marker position={[props.user.lat, props.user.lon]} icon={icon("#00F5FF", "YOU")}>
            <Popup>Your live location</Popup>
          </Marker>
        </>
      )}
      {props.hospitals.map((h) => (
        <Marker key={`h-${h.id}`} position={[h.lat, h.lon]} icon={icon("#7CFFB2", "H")}>
          <Popup>
            <strong>{h.name}</strong>
            <br />
            {h.distanceKm.toFixed(1)} km • {h.etaMin} min
            <br />
            Beds: {h.beds} • {h.status}
          </Popup>
        </Marker>
      ))}
      {props.police.map((p) => (
        <Marker key={`p-${p.id}`} position={[p.lat, p.lon]} icon={icon("#FFE066", "P")}>
          <Popup>
            <strong>{p.name}</strong>
            <br />
            {p.distanceKm.toFixed(1)} km • ETA {p.etaMin} min
          </Popup>
        </Marker>
      ))}
      {props.ambulances.map((a) => (
        <Marker key={`a-${a.id}`} position={[a.lat, a.lon]} icon={icon("#C77DFF", "A")}>
          <Popup>
            <strong>{a.vehicleNo}</strong>
            <br />
            Driver: {a.driver}
            <br />
            ETA {a.etaMin} min
          </Popup>
        </Marker>
      ))}
      {props.emergency &&
        props.user &&
        props.hospitals.slice(0, 1).map((h) => (
          <Polyline
            key={`route-${h.id}`}
            positions={[
              [props.user!.lat, props.user!.lon],
              [h.lat, h.lon],
            ]}
            pathOptions={{ color: "#FF00FF", weight: 3, dashArray: "8 6" }}
          />
        ))}
    </MapContainer>
  );
}
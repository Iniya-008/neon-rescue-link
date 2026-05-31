import { useEffect, useState } from "react";
import {
  etaFromKm,
  haversineKm,
  type Coords,
  type Hospital,
  type Police,
} from "@/lib/roadsos-types";

type Result = { hospitals: Hospital[]; police: Police[]; loading: boolean; error?: string };

const OVERPASS = "https://overpass-api.de/api/interpreter";

function statusFromBeds(beds: number): Hospital["status"] {
  if (beds > 12) return "available";
  if (beds > 4) return "limited";
  return "full";
}

export function useNearbyPlaces(coords: Coords | null, radiusM = 6000): Result {
  const [data, setData] = useState<Result>({ hospitals: [], police: [], loading: false });

  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    setData((p) => ({ ...p, loading: true, error: undefined }));
    const q = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radiusM},${coords.lat},${coords.lon});
        way["amenity"="hospital"](around:${radiusM},${coords.lat},${coords.lon});
        node["amenity"="clinic"](around:${radiusM},${coords.lat},${coords.lon});
        node["amenity"="police"](around:${radiusM},${coords.lat},${coords.lon});
        way["amenity"="police"](around:${radiusM},${coords.lat},${coords.lon});
      );
      out center 40;`;
    fetch(OVERPASS, {
      method: "POST",
      body: "data=" + encodeURIComponent(q),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const hospitals: Hospital[] = [];
        const police: Police[] = [];
        for (const el of json.elements ?? []) {
          const lat = el.lat ?? el.center?.lat;
          const lon = el.lon ?? el.center?.lon;
          if (lat == null || lon == null) continue;
          const km = haversineKm(coords, { lat, lon });
          const tags = el.tags ?? {};
          if (tags.amenity === "police") {
            police.push({
              id: el.id,
              name: tags.name || "Police Station",
              lat,
              lon,
              distanceKm: km,
              etaMin: etaFromKm(km, 60),
              phone: tags.phone || tags["contact:phone"] || "100",
            });
          } else {
            const seed = (el.id % 30) + 2;
            const beds = Math.max(0, seed - Math.floor(km));
            hospitals.push({
              id: el.id,
              name: tags.name || (tags.amenity === "clinic" ? "Clinic" : "Hospital"),
              lat,
              lon,
              distanceKm: km,
              etaMin: etaFromKm(km),
              beds,
              status: statusFromBeds(beds),
              trauma: tags["healthcare:speciality"]?.includes("trauma") || tags.emergency === "yes" || el.id % 4 === 0,
            });
          }
        }
        hospitals.sort((a, b) => a.distanceKm - b.distanceKm);
        police.sort((a, b) => a.distanceKm - b.distanceKm);
        setData({ hospitals: hospitals.slice(0, 12), police: police.slice(0, 8), loading: false });
      })
      .catch((e) => !cancelled && setData((p) => ({ ...p, loading: false, error: e.message })));
    return () => {
      cancelled = true;
    };
  }, [coords?.lat, coords?.lon, radiusM]);

  return data;
}
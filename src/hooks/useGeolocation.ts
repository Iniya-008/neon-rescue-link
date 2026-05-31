import { useEffect, useState } from "react";
import type { LocationInfo } from "@/lib/roadsos-types";

export function useGeolocation(): LocationInfo & { request: () => void } {
  const [info, setInfo] = useState<LocationInfo>({
    coords: null,
    address: "Acquiring satellite lock…",
    area: "—",
    city: "—",
    state: "—",
    status: "idle",
  });

  const request = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setInfo((p) => ({ ...p, status: "error", error: "Geolocation unsupported" }));
      return;
    }
    setInfo((p) => ({ ...p, status: "locating" }));
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setInfo((p) => ({ ...p, coords, status: "ready" }));
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lon}&zoom=16&addressdetails=1`,
            { headers: { Accept: "application/json" } },
          );
          const data = await r.json();
          const a = data.address || {};
          setInfo({
            coords,
            address: data.display_name || "Location acquired",
            area:
              a.suburb || a.neighbourhood || a.village || a.hamlet || a.road || "—",
            city: a.city || a.town || a.county || "—",
            state: a.state || "—",
            status: "ready",
          });
        } catch {
          /* keep coords-only fallback */
        }
      },
      (err) =>
        setInfo((p) => ({ ...p, status: "error", error: err.message })),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    );
  };

  useEffect(() => {
    request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...info, request };
}
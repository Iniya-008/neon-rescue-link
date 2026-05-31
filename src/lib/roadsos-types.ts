export type Coords = { lat: number; lon: number };

export type LocationInfo = {
  coords: Coords | null;
  address: string;
  area: string;
  city: string;
  state: string;
  status: "idle" | "locating" | "ready" | "error";
  error?: string;
};

export type Hospital = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distanceKm: number;
  etaMin: number;
  beds: number;
  status: "available" | "limited" | "full";
  trauma: boolean;
};

export type Police = {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distanceKm: number;
  etaMin: number;
  phone: string;
};

export type Ambulance = {
  id: string;
  vehicleNo: string;
  driver: string;
  phone: string;
  lat: number;
  lon: number;
  etaMin: number;
  distanceKm: number;
};

export function haversineKm(a: Coords, b: Coords) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function etaFromKm(km: number, speedKmh = 45) {
  return Math.max(1, Math.round((km / speedKmh) * 60));
}
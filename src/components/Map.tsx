import { useEffect } from "react";

interface Props {
  lat: number;
  lng: number;
  name: string;
}

export default function Map({ lat, lng, name }: Props) {
  useEffect(() => {
    let map: any;

    async function init() {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      map = L.map("leaflet-map", {
        scrollWheelZoom: false,
      }).setView([lat, lng], 15);

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: "&copy; OpenStreetMap contributors" }
      ).addTo(map);

      L.marker([lat, lng]).addTo(map).bindPopup(name).openPopup();

      // 🔥 double recalcul sécurisé
      setTimeout(() => map.invalidateSize(), 300);
      setTimeout(() => map.invalidateSize(), 800);
    }

    init();

    return () => {
      if (map) map.remove();
    };
  }, []);

  return (
    <div
      id="leaflet-map"
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "16px",
      }}
    />
  );
}

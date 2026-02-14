import { useEffect, useRef } from "react";

interface MarkerData {
  lat: number;
  lng: number;
  name: string;
  primary?: boolean;
}

interface Props {
  markers: MarkerData[];
  zoom?: number;
}

export default function Map({ markers, zoom = 15 }: Props) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let map: any;

    async function init() {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      map = L.map(containerRef.current, {
        scrollWheelZoom: false,
      });

      mapRef.current = map;

      L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: "&copy; OpenStreetMap contributors" }
      ).addTo(map);

      if (!markers || markers.length === 0) {
        map.setView([-20.28, 57.48], zoom);
        return;
      }

      const bounds: any[] = [];

      markers.forEach((marker) => {
        bounds.push([marker.lat, marker.lng]);

        const size = marker.primary ? 42 : 30;
        const icon = L.divIcon({
          className: "google-marker",
          html: `
            <div style="
              position: relative;
              width: ${size}px;
              height: ${size}px;
              transform: translate(-50%, -100%);
            ">
              <div style="
                width: 100%;
                height: 100%;
                background: #EA4335;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              "></div>
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                width: ${size / 3}px;
                height: ${size / 3}px;
                background: white;
                border-radius: 50%;
                transform: translate(-50%, -50%);
              "></div>
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size],
        });

        L.marker([marker.lat, marker.lng], { icon })
          .addTo(map)
          .bindPopup(marker.name);
      });

      if (markers.length === 1) {
        map.setView(bounds[0], zoom);
      } else {
        map.fitBounds(bounds, { padding: [60, 60] });
      }

      setTimeout(() => map.invalidateSize(), 400);
    }

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [markers, zoom]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "16px",
      }}
    />
  );
}
 
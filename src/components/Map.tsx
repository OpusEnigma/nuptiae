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
  activePlace?: string | null;
  onSelect?: (name: string) => void;
}

export default function Map({
  markers,
  zoom = 10,
  activePlace,
  onSelect,
}: Props) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Record<string, any>>({});

  // Create map
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

      const bounds: any[] = [];
      markerRefs.current = {};

      markers.forEach((marker) => {
        bounds.push([marker.lat, marker.lng]);

        const size = marker.primary ? 42 : 30;

        const icon = L.divIcon({
          className: "google-marker",
          html: markerHTML(size, false),
          iconSize: [size, size],
          iconAnchor: [size / 2, size],
        });

        const leafletMarker = L.marker([marker.lat, marker.lng], { icon })
          .addTo(map)
          .bindPopup(marker.name)
          .on("click", () => onSelect?.(marker.name));

        markerRefs.current[marker.name] = leafletMarker;
      });

      if (bounds.length === 1) {
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
  }, [markers, zoom, onSelect]);

  // Highlight active marker
  useEffect(() => {
    if (!markerRefs.current) return;

    import("leaflet").then((L) => {
      Object.entries(markerRefs.current).forEach(([name, marker]) => {
        const isActive = name === activePlace;

        const baseSize =
          markers.find((m) => m.name === name)?.primary ? 42 : 30;

        const size = isActive ? 50 : baseSize;

        const icon = L.divIcon({
          className: "google-marker",
          html: markerHTML(size, isActive),
          iconSize: [size, size],
          iconAnchor: [size / 2, size],
        });

        marker.setIcon(icon);

        if (isActive) marker.openPopup();
      });
    });
  }, [activePlace, markers]);

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

// Marker SVG/HTML
function markerHTML(size: number, active: boolean) {
  const color = active ? "#FF6B5A" : "#EA4335";
  const shadow = active
    ? "0 8px 20px rgba(0,0,0,0.45)"
    : "0 4px 10px rgba(0,0,0,0.3)";

  return `
    <div style="
      position: relative;
      width: ${size}px;
      height: ${size}px;
      transform: translate(-50%, -100%);
    ">
      <div style="
        width: 100%;
        height: 100%;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: ${shadow};
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
  `;
}

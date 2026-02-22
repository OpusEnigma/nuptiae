import { useEffect, useRef } from "react";

interface MarkerData {
  lat: number;
  lng: number;
  name: string;
}

interface Props {
  markers: MarkerData[];
  zoom?: number;
  activePlace?: string | null;
  hoveredPlace?: string | null;
  onSelect?: (name: string) => void;
  onHover?: (name: string | null) => void;
}

export default function Map({
  markers,
  zoom = 10,
  activePlace,
  hoveredPlace,
  onSelect,
  onHover,
}: Props) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Record<string, any>>({});
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  /* Create map */

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

        const size = 32;

        const icon = L.divIcon({
          className: "google-marker",
          html: markerHTML(size, false),
          iconSize: [size, size],
          iconAnchor: [size / 2, size],
          popupAnchor: [0, -size],
        });

        const leafletMarker = L.marker([marker.lat, marker.lng], { icon })
          .addTo(map)
          .bindPopup(marker.name, { closeButton: false, autoPan: false })
          .on("click", () => onSelectRef.current?.(marker.name))
          .on("mouseover", function () { this.openPopup(); onHover?.(marker.name); })
          .on("mouseout", function () { this.closePopup(); onHover?.(null); });

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
  }, [markers, zoom]);

  /* Highlight active and hovered markers */

  useEffect(() => {
    if (!markerRefs.current) return;

    import("leaflet").then((L) => {
      Object.entries(markerRefs.current).forEach(([name, marker]) => {
        const isActive = name === activePlace;
        const isHovered = name === hoveredPlace;
        const highlight = isActive || isHovered;

        const baseSize = 32;

        const size = highlight ? 50 : baseSize;

        const icon = L.divIcon({
          className: "google-marker",
          html: markerHTML(size, highlight),
          iconSize: [size, size],
          iconAnchor: [size / 2, size],
          popupAnchor: [0, -size],
        });

        marker.setIcon(icon);
      });
    });
  }, [activePlace, hoveredPlace, markers]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "clamp(8px, 2vw, 16px)",
      }}
    />
  );
}

/* Marker SVG/HTML rendering */

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

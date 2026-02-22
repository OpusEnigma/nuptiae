import { useCallback, useEffect, useState } from "react";
import { useActiveDomSync } from "../../hooks/useActiveDomSync";

import Map from "./Map";

interface MarkerData {
  lat: number;
  lng: number;
  name: string;
}

interface Props {
  markers: MarkerData[];
  zoom?: number;
  placeSelector?: string;
}

export default function MapSync({
  markers,
  zoom = 10,
  placeSelector = ".place",
}: Props) {
  const [activePlace, setActivePlace] = useState<string | null>(null);
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);

  /* Observe Astro place elements */

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(placeSelector)
    );
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActivePlace((prev) => (prev === id ? prev : id));
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [placeSelector]);

  /* Sync active and hovered classes in Astro DOM */

  useActiveDomSync(placeSelector, activePlace);
  useActiveDomSync(placeSelector, hoveredPlace, "hovered");

  /* Map marker click → scroll to place + force animation replay */

  const handleSelect = useCallback((name: string) => {
    setActivePlace(name);

    requestAnimationFrame(() => {
      const el = document.getElementById(name);
      if (!el) return;

      /* Force @keyframes restart */
      el.style.animation = "none";
      el.offsetHeight; /* reflow */
      el.style.animation = "";

      /* Scroll only the .places container, not the page */
      const container = el.closest(".places") as HTMLElement | null;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      container.scrollBy({
        top: elRect.top - containerRect.top,
        behavior: "smooth",
      });
    });
  }, []);

  return (
    <Map
      markers={markers}
      zoom={zoom}
      activePlace={activePlace}
      hoveredPlace={hoveredPlace}
      onSelect={handleSelect}
      onHover={setHoveredPlace}
    />
  );
}

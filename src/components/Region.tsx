import { useEffect, useRef, useState } from "react";
import Map from "./Map";
import { useActiveDomSync } from "./hooks/useActiveDomSync";

interface MarkerData {
  lat: number;
  lng: number;
  name: string;
  primary?: boolean;
}

interface Props {
  markers: MarkerData[];
}

export default function Region({ markers }: Props) {
  const [activePlace, setActivePlace] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".place");
    if (!elements.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActivePlace(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    elements.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  // ⭐ highlight Astro cards
  useActiveDomSync(".place", activePlace);

  const handleSelect = (name: string) => {
    setActivePlace(name);

    const el = document.getElementById(name);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <Map
      markers={markers.map((m) => ({
        ...m,
        primary: activePlace === m.name || m.primary,
      }))}
      zoom={10}
      activePlace={activePlace}
      onSelect={handleSelect}
    />
  );
}

import { useEffect } from "react";

export function useActiveDomSync(
  selector: string,
  activeId: string | null,
  activeClass = "active"
) {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector);

    elements.forEach((el) => {
      if (activeId && el.id === activeId) {
        el.classList.add(activeClass);
      } else {
        el.classList.remove(activeClass);
      }
    });
  }, [selector, activeId, activeClass]);
}

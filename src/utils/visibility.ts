/* Intersection Observer for visibility animations */

interface VisibilityConfig {
  visibilityThreshold?: number;
  visibilityMargin?: string;
}

export function initializeVisibility(config: VisibilityConfig = {}) {
  const {
    visibilityThreshold = 0.15,
    visibilityMargin = "0px 0px -10% 0px",
  } = config;

  const elements = Array.from(document.querySelectorAll("[data-visible]"));
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }
    },
    {
      threshold: visibilityThreshold,
      rootMargin: visibilityMargin,
    }
  );

  elements.forEach((el) => observer.observe(el));

  return observer;
}

/* Hide element when any matching section becomes visible */
export function hideElementOnSectionVisible(
  elementSelector: string,
  sectionSelector: string,
) {
  const element = document.querySelector(elementSelector);
  const sections = Array.from(document.querySelectorAll(sectionSelector));

  if (!element || !sections.length) return;

  /* Re-check all sections on every intersection change */
  const update = () => {
    const anyVisible = sections.some((s) => {
      const rect = s.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    if (anyVisible) {
      element.classList.remove("visible");
    } else {
      element.classList.add("visible");
    }
  };

  /* Multiple thresholds catch enter/exit at any scroll speed */
  const observer = new IntersectionObserver(update, {
    threshold: [0, 0.01, 0.1, 0.5, 1],
  });

  sections.forEach((s) => observer.observe(s));

  return observer;
}

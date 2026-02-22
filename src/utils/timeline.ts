/* Timeline sync for ritual sections */

interface TimelineConfig {
  activeRatio?: number;
}

export function initializeTimelineSync(config: TimelineConfig = {}) {
  const { activeRatio = 0.5 } = config;

  const rituals = Array.from(document.querySelectorAll("[data-visible]"));
  if (!rituals.length) return;

  const timeline = document.getElementById("timeline");
  const timelineItems = new Map(
    Array.from(document.querySelectorAll(".timeline-item")).map((el) => [
      el.dataset.id,
      el,
    ])
  );

  let ticking = false;

  function updateActive() {
    const vh = window.innerHeight;
    let activeId: string | null = null;

    for (const ritual of rituals) {
      const rect = ritual.getBoundingClientRect();

      const visiblePx =
        Math.min(rect.bottom, vh) - Math.max(rect.top, 0);

      const ratio = Math.max(0, visiblePx) / vh;

      if (ratio >= activeRatio) {
        activeId = ritual.id;
        break;
      }
    }

    for (const [id, el] of timelineItems) {
      el.classList.toggle("active", id === activeId);
    }

    if (timeline) {
      timeline.classList.toggle("visible", !!activeId);
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateActive);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  updateActive();

  /* Return cleanup function */
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}

/**
 * Reveals rules and media that start below the first screen, by removing the
 * `.pre`/`.pre-fade` classes once scrolled into view. Everything visible at
 * load is left alone — nothing depends on JavaScript to be seen.
 */
export function initReveal(): void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  const vh = window.innerHeight;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove("pre", "pre-fade");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px" },
  );

  const arm = (el: Element, classes: string[]) => {
    if (el.getBoundingClientRect().top > vh) {
      el.classList.add(...classes);
      observer.observe(el);
    }
  };

  document.querySelectorAll(".rule").forEach((el) => arm(el, ["pre"]));
  document
    .querySelectorAll(".sec-head .h2, .card .media, .sheet .media")
    .forEach((el) => arm(el, ["fade", "pre-fade"]));
}

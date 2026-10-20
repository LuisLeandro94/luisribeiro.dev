/** Marks the current section's desktop nav link with aria-current, via scroll position. */
export function initActiveNav(): void {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav a");
  if (!navLinks.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.setAttribute(
            "aria-current",
            link.getAttribute("href") === `/#${entry.target.id}` ? "true" : "false",
          );
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
}

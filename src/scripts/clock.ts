const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Lisbon",
  hour: "2-digit",
  minute: "2-digit",
});

export function initClock(): void {
  const nodes = document.querySelectorAll<HTMLElement>("[data-clock]");
  if (!nodes.length) return;

  function tick() {
    const value = formatter.format(new Date());
    nodes.forEach((node) => {
      node.textContent = value;
    });
  }

  tick();
  setInterval(tick, 30000);
}

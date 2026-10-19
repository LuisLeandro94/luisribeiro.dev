/** Shared status toast. Self-contained: reads/writes only #toast. */
let hideTimer: ReturnType<typeof setTimeout> | undefined;

export function showToast(message: string): void {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("on");
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => el.classList.remove("on"), 1800);
}

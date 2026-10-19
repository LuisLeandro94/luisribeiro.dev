export function initMobileIndex(): void {
  const idx = document.getElementById("idx") as HTMLDialogElement | null;
  if (!idx) return;

  document.querySelectorAll<HTMLElement>("[data-open-idx]").forEach((button) => {
    button.addEventListener("click", () => idx.showModal());
  });

  idx.querySelectorAll<HTMLElement>("[data-close-idx], nav a").forEach((el) => {
    el.addEventListener("click", () => idx.close());
  });
}

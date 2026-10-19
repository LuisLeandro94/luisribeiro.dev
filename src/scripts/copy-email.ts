import { showToast } from "./toast";
import { site } from "../content/site";

function selectAddress(): void {
  const el = document.querySelector<HTMLElement>(".mail .addr");
  if (!el) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  showToast("Address selected, press Ctrl C to copy");
}

export function copyEmail(): void {
  if (!navigator.clipboard?.writeText) {
    selectAddress();
    return;
  }
  navigator.clipboard.writeText(site.email).then(
    () => showToast("Email address copied"),
    () => selectAddress(),
  );
}

export function initCopyEmail(): void {
  const button = document.querySelector<HTMLButtonElement>("[data-copy-email]");
  button?.addEventListener("click", copyEmail);
}

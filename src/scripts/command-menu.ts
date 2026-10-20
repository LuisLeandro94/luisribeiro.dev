import { navSections, site } from "../content/site";
import { copyEmail } from "./copy-email";
import { toggleGrid } from "./grid-overlay";
import { cycleTheme } from "./theme";
import { showToast } from "./toast";

interface CommandItem {
  group: "Go to" | "Actions" | "View";
  title: string;
  keyHint: string;
  run: () => void;
}

function goTo(id: string): () => void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return () => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    } else {
      // Not on the homepage (e.g. a case study page) — the section lives there instead.
      window.location.href = `/#${id}`;
    }
  };
}

function buildItems(): CommandItem[] {
  const items: CommandItem[] = navSections.map((section) => ({
    group: "Go to",
    title: section.label === "Work" ? "Selected work" : section.label,
    keyHint: section.number,
    run: goTo(section.id),
  }));

  items.push(
    { group: "Actions", title: "Copy email address", keyHint: site.email, run: copyEmail },
    {
      group: "Actions",
      title: "Download CV",
      keyHint: "PDF",
      run: () => document.querySelector<HTMLAnchorElement>("[data-cv]")?.click(),
    },
    {
      group: "Actions",
      title: "Open LinkedIn",
      keyHint: "↗",
      run: () => window.open(site.linkedin.url, "_blank", "noopener"),
    },
    {
      group: "Actions",
      title: "Open GitHub",
      keyHint: "↗",
      run: () => window.open(site.github.url, "_blank", "noopener"),
    },
    { group: "View", title: "Toggle grid overlay", keyHint: "G", run: toggleGrid },
    {
      group: "View",
      title: "Switch theme",
      keyHint: "",
      run: () => showToast(`Theme: ${cycleTheme()}`),
    },
  );

  return items;
}

export function initCommandMenu(): void {
  const dialog = document.getElementById("cmd") as HTMLDialogElement | null;
  const input = document.getElementById("cmdq") as HTMLInputElement | null;
  const list = document.getElementById("cmdlist");
  if (!dialog || !input || !list) return;

  const items = buildItems();
  let shown: CommandItem[] = [];
  let selected = 0;

  function render() {
    const term = input!.value.trim().toLowerCase();
    shown = items.filter(
      (item) => !term || `${item.title} ${item.group}`.toLowerCase().includes(term),
    );
    if (selected >= shown.length) selected = 0;
    list!.innerHTML = "";

    if (!shown.length) {
      const empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent = `Nothing matches "${input!.value}". Try "work" or "email".`;
      list!.appendChild(empty);
      input!.removeAttribute("aria-activedescendant");
      return;
    }

    let lastGroup = "";
    shown.forEach((item, i) => {
      if (item.group !== lastGroup) {
        const heading = document.createElement("li");
        heading.className = "grp label";
        heading.setAttribute("role", "presentation");
        heading.textContent = item.group;
        list!.appendChild(heading);
        lastGroup = item.group;
      }
      const option = document.createElement("li");
      option.id = `c${i}`;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(i === selected));

      const label = document.createElement("span");
      label.textContent = item.title;
      const hint = document.createElement("span");
      hint.className = "data";
      hint.textContent = item.keyHint;
      option.append(label, hint);

      option.addEventListener("mousemove", () => {
        if (selected !== i) {
          selected = i;
          mark();
        }
      });
      option.addEventListener("click", () => run(i));
      list!.appendChild(option);
    });

    mark();
  }

  function mark() {
    list!.querySelectorAll("[role=option]").forEach((option) => {
      const isSelected = option.id === `c${selected}`;
      option.setAttribute("aria-selected", String(isSelected));
      if (isSelected) option.scrollIntoView({ block: "nearest" });
    });
    input!.setAttribute("aria-activedescendant", `c${selected}`);
  }

  function run(i: number) {
    const item = shown[i];
    dialog!.close();
    if (item) setTimeout(item.run, 10);
  }

  function open() {
    if (dialog!.open) return;
    input!.value = "";
    selected = 0;
    render();
    dialog!.showModal();
    input!.focus();
  }

  input.addEventListener("input", () => {
    selected = 0;
    render();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (shown.length) {
        selected = (selected + 1) % shown.length;
        mark();
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (shown.length) {
        selected = (selected - 1 + shown.length) % shown.length;
        mark();
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (shown.length) run(selected);
    }
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.querySelectorAll<HTMLElement>("[data-open-cmd]").forEach((button) => {
    button.addEventListener("click", open);
  });

  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && (event.key === "k" || event.key === "K")) {
      event.preventDefault();
      if (dialog.open) {
        dialog.close();
      } else {
        open();
      }
    }
  });
}

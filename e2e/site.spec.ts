import { test, expect } from "@playwright/test";

test.describe("navigation", () => {
  test("header links scroll to the matching section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /02.*Experience/i }).click();
    await expect(page.locator("#experience")).toBeInViewport();
  });

  test("desktop nav marks the active section with aria-current", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(page.locator('.nav a[href="/#contact"]')).toHaveAttribute("aria-current", "true");
  });
});

test.describe("command menu", () => {
  test("opens with Ctrl+K, filters, and closes with Escape", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    const dialog = page.locator("#cmd");
    await expect(dialog).toBeVisible();

    await page.keyboard.type("stack");
    await expect(page.locator("#cmdlist li[role=option]")).toHaveCount(1);
    await expect(page.locator("#cmdlist li[role=option]")).toHaveText(/Stack/);

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("arrow keys move the selection and Enter activates it", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    await page.keyboard.type("go to");
    await page.waitForTimeout(50);

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(page.locator("#cmd")).not.toBeVisible();
  });

  test("shows an empty state for a non-matching query", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    await page.keyboard.type("zzz-no-match");
    await expect(page.locator("#cmdlist .empty")).toBeVisible();
  });

  test("toggles grid overlay as a command", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    await page.keyboard.type("grid");
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveClass(/show-grid/);
  });

  test("backdrop click closes the dialog", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    await expect(page.locator("#cmd")).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(page.locator("#cmd")).not.toBeVisible();
  });

  // Regression test for a bug where command-menu.ts's dynamically created
  // <li> elements (document.createElement) never matched CommandMenu.astro's
  // scoped CSS, because Astro's compiler requires the component's
  // data-astro-cid attribute on the *element itself*, not just an ancestor —
  // an attribute only present on elements Astro renders at build time. The
  // rows silently fell back to the UA default `display: list-item`, so the
  // label and its metadata rendered as unstyled, overlapping inline text.
  // Checking textContent alone would not catch this: the DOM and the text
  // are both correct, only the layout is broken. This asserts actual
  // computed style and geometry instead.
  test("command rows use flex layout with non-overlapping label and metadata", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");

    const row = page.locator("#cmdlist li[role=option]").first();
    await expect(row).toBeVisible();

    const display = await row.evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe("flex");

    const label = row.locator("span").first();
    const meta = row.locator("span.data");
    const labelBox = await label.boundingBox();
    const metaBox = await meta.boundingBox();
    if (!labelBox || !metaBox) throw new Error("expected both spans to have a layout box");

    // Metadata must sit to the right of the label with no horizontal overlap —
    // the exact geometry a flex row with justify-content: space-between
    // guarantees, and that `display: list-item` does not.
    expect(metaBox.x).toBeGreaterThanOrEqual(labelBox.x + labelBox.width);

    // Row must have real padding, not the UA default of 0.
    const padding = await row.evaluate((el) => getComputedStyle(el).paddingTop);
    expect(parseFloat(padding)).toBeGreaterThan(0);
  });

  test("the command menu fits within the viewport at every required width", async ({ page }) => {
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.keyboard.press("Control+k");
      const box = await page.locator("#cmd").boundingBox();
      if (!box) throw new Error("expected the command dialog to have a layout box");
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      await page.keyboard.press("Escape");
    }
  });
});

test.describe("mobile index", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens from the header, lists sections, and closes after selecting one", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("[data-open-idx]").click();
    const dialog = page.locator("#idx");
    await expect(dialog).toBeVisible();

    await dialog.getByRole("link", { name: /Stack/ }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.locator("#stack")).toBeInViewport();
  });

  test("closes on Escape", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-open-idx]").click();
    await page.keyboard.press("Escape");
    await expect(page.locator("#idx")).not.toBeVisible();
  });
});

test.describe("grid overlay", () => {
  test("toggles with the G key outside of inputs", async ({ page }) => {
    await page.goto("/");
    await page.locator("body").click();
    await page.keyboard.press("g");
    await expect(page.locator("html")).toHaveClass(/show-grid/);
    await page.keyboard.press("g");
    await expect(page.locator("html")).not.toHaveClass(/show-grid/);
  });

  test("G is ignored while typing in the command menu input", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    await page.keyboard.type("g");
    await expect(page.locator("html")).not.toHaveClass(/show-grid/);
  });

  test("toggles from the footer button and persists across reload", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-grid-btn]").scrollIntoViewIfNeeded();
    await page.locator("[data-grid-btn]").click();
    await expect(page.locator("html")).toHaveClass(/show-grid/);
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/show-grid/);
  });
});

test.describe("theme", () => {
  test("footer control cycles system -> light -> dark -> system", async ({ page }) => {
    await page.goto("/");
    const button = page.locator("[data-theme-btn]");
    await button.scrollIntoViewIfNeeded();

    await expect(button).toHaveText("Theme: system");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");

    await button.click();
    await expect(button).toHaveText("Theme: light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    await button.click();
    await expect(button).toHaveText("Theme: dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await button.click();
    await expect(button).toHaveText("Theme: system");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  });

  test("explicit choice persists across reload", async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-theme-btn]").scrollIntoViewIfNeeded();
    await page.locator("[data-theme-btn]").click(); // light
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});

test.describe("experience", () => {
  test("the current role is expanded by default; others expand on click", async ({ page }) => {
    await page.goto("/");
    const rows = page.locator(".role-row");
    await expect(rows.nth(0)).toHaveAttribute("open", "");
    await expect(rows.nth(1)).not.toHaveAttribute("open", "");

    await rows.nth(1).locator("summary").click();
    await expect(rows.nth(1)).toHaveAttribute("open", "");
  });
});

test.describe("contact", () => {
  test("copy address button shows a confirmation toast", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.locator("[data-copy-email]").scrollIntoViewIfNeeded();
    await page.locator("[data-copy-email]").click();
    await expect(page.locator("#toast")).toHaveClass(/on/);
  });

  test("CV links point at the real asset path, not a placeholder", async ({ page }) => {
    await page.goto("/");
    const cvLinks = page.locator("[data-cv]");
    const count = await cvLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(cvLinks.nth(i)).toHaveAttribute("href", "/cv/luis-ribeiro-cv.pdf");
    }
  });

  test("external links open in a new tab safely", async ({ page }) => {
    await page.goto("/");
    const github = page.locator('a[href*="github.com/LuisLeandro94"]').first();
    await expect(github).toHaveAttribute("target", "_blank");
    await expect(github).toHaveAttribute("rel", /noopener/);
  });
});

test.describe("responsive layout", () => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  }
});

test.describe("accessibility baseline", () => {
  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("works with JavaScript disabled: content renders and roles expand", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Luís");
    await expect(page.locator(".role-row").first()).toHaveAttribute("open", "");
    await context.close();
  });
});

test.describe("wedding app case study", () => {
  test("loads directly with the project title and both screenshots", async ({ page }) => {
    await page.goto("/work/wedding-app");
    await expect(page.locator("h1")).toHaveText("Wedding Management App");
    await expect(page.locator(".shot img")).toHaveCount(2);
  });

  test("shows the structured metadata block", async ({ page }) => {
    await page.goto("/work/wedding-app");
    const terms = await page.locator(".case-meta dt").allTextContents();
    expect(terms).toEqual(["Role", "Type", "Stack", "Purpose"]);
  });

  test("the back link returns to the homepage Selected Work section", async ({ page }) => {
    await page.goto("/work/wedding-app");
    await page.locator(".back a").click();
    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.locator("#work")).toBeInViewport();
  });

  test("header nav links navigate back to the homepage from a subpage", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/work/wedding-app");
    await page.getByRole("link", { name: /03.*Stack/i }).click();
    await expect(page).toHaveURL(/\/#stack$/);
    await expect(page.locator("#stack")).toBeInViewport();
  });

  test("no horizontal overflow at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/work/wedding-app");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });

  test("covers all expected narrative sections in order", async ({ page }) => {
    await page.goto("/work/wedding-app");
    const headings = await page.locator(".cs-h").allTextContents();
    expect(headings).toEqual([
      "The problem",
      "Core functionality",
      "Authentication challenge",
      "Technology decisions",
      "Outcome",
    ]);
  });

  test("pairs the guest seating feature with its screenshot", async ({ page }) => {
    await page.goto("/work/wedding-app");
    const seatingItem = page.locator(".features li", { hasText: "Guest seating" });
    await expect(seatingItem.locator("img")).toHaveCount(1);
  });

  test('the homepage "Read the case study" link opens the case study', async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Read the case study/ }).click();
    await expect(page).toHaveURL(/\/work\/wedding-app$/);
    await expect(page.locator("h1")).toHaveText("Wedding Management App");
  });

  test("mobile index navigates from the case study page back to a homepage section", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/work/wedding-app");
    await page.locator("[data-open-idx]").click();
    await page.getByRole("dialog").getByRole("link", { name: /About/ }).click();
    await expect(page).toHaveURL(/\/#about$/);
    await expect(page.locator("#about")).toBeInViewport();
  });

  test("command menu navigates from the case study page back to a homepage section", async ({
    page,
  }) => {
    await page.goto("/work/wedding-app");
    await page.keyboard.press("Control+k");
    await page.keyboard.type("contact");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/#contact$/);
    await expect(page.locator("#contact")).toBeInViewport();
  });
});

import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = "/tmp/qa";
mkdirSync(OUT, { recursive: true });
const URL = "http://localhost:3137/";

const browser = await chromium.launch();

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  console.log("shot", name);
}

// ---- DESKTOP ----
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Add Item" }).waitFor({ state: "visible", timeout: 15000 });
  await page.waitForTimeout(500);
  await shot(page, "desktop-main");

  // open Add Item modal
  await page.getByRole("button", { name: "Add Item" }).click();
  await page.waitForTimeout(600);
  await shot(page, "desktop-modal");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // open detail drawer via row click (onRowAction)
  await page.getByText("Lettuce", { exact: true }).first().click();
  await page.waitForTimeout(700);
  await shot(page, "desktop-drawer");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);

  // select a couple rows to verify selected-row styling
  const cbs = page.getByRole("checkbox");
  await cbs.nth(1).click();
  await cbs.nth(3).click();
  await page.waitForTimeout(300);
  await shot(page, "desktop-selected");

  // open filter popover
  await page.getByRole("button", { name: /Filter/ }).click();
  await page.waitForTimeout(400);
  await shot(page, "desktop-filter");

  await ctx.close();
}

// ---- MOBILE ----
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.getByText("Home", { exact: true }).waitFor({ state: "visible", timeout: 15000 });
  await page.waitForTimeout(600);
  await shot(page, "mobile-main");
  // scroll to see cards lower
  await page.mouse.wheel(0, 380);
  await page.waitForTimeout(400);
  await shot(page, "mobile-cards");
  await ctx.close();
}

await browser.close();
console.log("done");

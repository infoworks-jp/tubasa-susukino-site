import { chromium } from "playwright";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: process.env.LOCATION_QA_EXECUTABLE || undefined,
  args:
    process.env.LOCATION_QA_HARDWARE === "1" && process.platform === "darwin"
      ? ["--use-angle=metal"]
      : [
          "--use-angle=swiftshader",
          "--enable-unsafe-swiftshader",
          "--disable-dev-shm-usage",
        ],
});
await fs.mkdir("location-reference-qa", { recursive: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  locale: "ja-JP",
});
// Detailed exported geometry is intentionally preserved. SwiftShader may need
// longer to drain GPU commands before the two stable frames required by capture.
// This changes the capture wait budget, never assertions or visual checks.
page.setDefaultTimeout(90000);
const reference =
  "https://tools.oyasumi-gamedev.com/rokehan/#ll=35.659500%2C139.700500&s=300&far=2&n=%E6%B8%8B%E8%B0%B7%E3%82%B9%E3%82%AF%E3%83%A9%E3%83%B3%E3%83%96%E3%83%AB%E4%BA%A4%E5%B7%AE%E7%82%B9";
try {
  await page.goto(reference, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(
    () =>
      document.querySelector("#status")?.textContent.includes("組み立てました"),
    {},
    { timeout: 180000 },
  );
  await page
    .locator("#v3wrap")
    .screenshot({ path: "location-reference-qa/reference-desktop.png" });
  await page.waitForTimeout(1000);
  await page
    .locator("#v3wrap")
    .screenshot({ path: "location-reference-qa/reference-desktop-1s.png" });
  await page.waitForTimeout(2000);
  await page
    .locator("#v3wrap")
    .screenshot({ path: "location-reference-qa/reference-desktop-3s.png" });
  await page.locator("#far").selectOption("0");
  await page.waitForFunction(
    () =>
      document.querySelector("#farCredit")?.hidden &&
      !document.querySelector("#info")?.textContent.includes("遠景 2km") &&
      document.querySelector("#status")?.textContent.includes("組み立てました"),
    {},
    { timeout: 60000 },
  );
  await page.mouse.move(400, 400);
  await page.mouse.down();
  await page.mouse.move(480, 440, { steps: 10 });
  await page.screenshot({
    path: "location-reference-qa/reference-desktop-dragging.png",
    timeout: 90000,
  });
  await page.mouse.up();
  await page.screenshot({
    path: "location-reference-qa/reference-desktop-moved.png",
    timeout: 90000,
  });
  await page.getByRole("button", { name: "線画＋トーン", exact: true }).click();
  await page.screenshot({
    path: "location-reference-qa/reference-tone.png",
    timeout: 90000,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "location-reference-qa/reference-mobile.png",
    fullPage: true,
    timeout: 90000,
  });
  await fs.writeFile(
    "location-reference-qa/reference.json",
    JSON.stringify(
      {
        reference,
        status: await page.locator("#status").textContent(),
        pass: true,
      },
      null,
      2,
    ),
  );
} catch (e) {
  await page
    .screenshot({ path: "location-reference-qa/reference-failure.png", fullPage: true })
    .catch(() => {});
  await fs.writeFile(
    "location-reference-qa/reference.json",
    JSON.stringify({ reference, pass: false, error: String(e) }, null, 2),
  );
  throw e;
} finally {
  await browser.close();
}
console.log("LOCATION REFERENCE QA PASS: external Rokehan reference.");
